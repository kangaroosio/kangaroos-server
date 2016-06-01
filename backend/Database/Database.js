'use strict'

const SALT_SIZE = 10

const async = require('async')
const bcrypt = require('bcrypt')
const semver = require('semver')
const MongoClient = require('mongodb').MongoClient

const pkg = require('../../package.json')
const log = require('../../lib/log')

class Database {
  constructor(options, callback) {
    const self = this
    const url = options.url

    self.initialized = false

    MongoClient.connect(url, function handleConnect(error, connection) {
      self.handleConnect(error, connection, callback)
    })
  }

  // Handlers
  handleConnect(error, connection, callback) {
    if (error) {
      throw new Error('Unable to connect to the database:', error)
    }

    this.connection = connection

    this.checkVersion(callback)
  }

  // Inserts
  initialize(data, callback) {
    const self = this

    function handleInitialize(error) {
      if (error) {
        callback(error)
      }

      self.initialized = true

      callback()
    }

    async.parallel([
      function insertProjectMetadata(cb) {
        self.insertMetadata(data, cb)
      }
    , function insertUser(cb) {
        data.role = 'admin'
        self.insertUser(data, cb)
      }
    ], handleInitialize)
  }

  insertMetadata(data, callback) {
    const self = this

    self.connection.collection('metadata').insertOne(
      {
        name: data.projectName
      }
    , callback
    )
  }

  insertUser(data, callback) {
    const self = this

    self.hashPassword(
      data.password
    , function handleHash(error, hashedPassword) {
        self.connection.collection('users').insertOne(
          {
            fullName: data.fullName
          , email: data.email
          , username: data.username
          , password: hashedPassword
          , role: data.role
          }
        , callback
        )
      }
    )
  }

  // Getters
  findUser(credentials, callback) {
    const self = this

    const cursor = self.connection.collection('users')
      .find(credentials)
      .limit(1)

    cursor.next(function handleNext(error, user) {
      if (error) {
        return callback(error, user)
      }

      if (!user) {
        return callback(null, null)
      }

      return callback(null, user)
    })
  }

  checkInitialization(callback) {
    const self = this

    const cursor = self.connection.collection('users')
      .find()
      .limit(1)

    cursor.next(function handleNext(error, document) {
      if (error) {
        return callback(error)
      }

      self.initialized = Boolean(document)

      if (!self.initialized) {
        log.database('Database has not been initialized.')
      }

      return callback(null, {
        database: self
      , initialized: self.initialized
      })
    })
  }

  checkVersion(callback) {
    const self = this

    const cursor = self.connection.collection('kangaroos-metadata')
      .find()
      .sort({$natural:-1})
      .limit(1)

    cursor.next(function handleNext(error, document) {
      if (!document) {
        document = {version: '0.0.0'}
      }

      if (semver.lt(document.version, pkg.version)) {
        const intro = 'Database is out of date' 
        log.database(
          `${intro} (current=v${document.version} latest=v${pkg.version}).
        `)
        return self.update(callback)
      }

      log.database(`Database is up-to-date (v${document.version}).`)

      return self.checkInitialization(callback)
    })
  }

  update(callback) {
    const self = this

    self.connection.collection('kangaroos-metadata')
      .insertOne({
        version: pkg.version
      }, function handleInsert(error) {
        if (error) {
          return callback(error)
        }

        log.database(`Database has been updated to v${pkg.version}.`)

        return self.checkInitialization(callback)
      })
  }

  // Utilities
  hashPassword(password, callback) {
    bcrypt.hash(password, SALT_SIZE, callback)
  }

  checkPassword(password, encrypted, callback) {
    bcrypt.compare(password, encrypted, callback)
  }

  authenticateUser(credentials, callback) {
    const self = this

    self.findUser(
      {username: credentials.username}
    , function handleUser(error, user) {
        if (error) {
          return callback(error)
        }

        if (!user) {
          return callback(null, null)
        }

        self.checkPassword(
          credentials.password
        , user.password
        , function handleCheck(error, match) {
          if (error) {
            return callback(error)
          }

          if (!match) {
            return callback(null, null)
          }

          return callback(null, user)
        })
      }
    )
  }

  getKangaroos(options, callback) {
    const self = this

    self.connection.collection('kangaroos')
      .find()
      .toArray(function handleKangaroos(error, kangaroos) {
        if (error) {
          return callback(error)
        }

        callback(null, kangaroos)
      })
  }

  insertKangaroo(data, callback) {
    this.connection.collection('kangaroos').insertOne(
      {
        name: data.name
      , content: data.content
      }
    , callback
    )
  }
}

module.exports = Database
