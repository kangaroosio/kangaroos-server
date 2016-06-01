'use strict'

const cookieParser = require('cookie-parser')
const io = require('socket.io')
const socketPassport = require('passport.socketio')

const Message = require('./Message/Message')

const env = require('../../lib/env')
const log = require('../../lib/log')

class WebSocket {
  constructor(options) {
    this.io = io(options.httpServer.http)
    this.database = options.database
    this.events = {}

    this.set('authorization', socketPassport.authorize({
      cookieParser: cookieParser
    , key: options.key || 'connect.sid'
    , secret: env.SESSION_SECRET
    , store: options.store
    , fail: this.handleAuthFail
    , success: this.handleAuthSuccess
    }))

    this.on('initialize', ['all'], this.handleInitialize)
    this.on('update', ['user', 'admin'], this.handleUpdate)
    this.on(
      'insert kangaroo'
    , ['user', 'admin']
    , this.handleInsertKangaroo
    )

    this.io.on('connection', this.handleConnection.bind(this))
  }

  // Settings
  use(...args) {
    this.io.use(...args)
  }

  set(...args) {
    this.io.set(...args)
  }

  // Actions
  on(event, roles, callback) {
    this.events[event] = {
      roles: roles
    , callback: callback
    }
  }

  emit(...args) {
    this.io.emit(...args)
  }

  updateOne(socket) {
    this.database.getKangaroos(null, function handleGet(error, kangaroos) {
      socket.emit('update', {data: {kangaroos: kangaroos}})
    })
  }

  updateAll() {
    const self = this
    self.database.getKangaroos(null, function handleGet(error, kangaroos) {
      self.emit('update', {data: {kangaroos: kangaroos}})
    })
  }

  // Getters
  getUser(socket) {
    const userData = socket.request.user

    if (!userData) {
      return null
    }

    return userData
  }

  // Setters
  setUser(socket, userData) {
    socket.handshake.session.userData = userData
  }

  // Handlers
  handleAuthFail(data, message, error, accept) {
    accept(null, true)
  }

  handleAuthSuccess(data, accept) {
    accept(null, true)
  }

  handleConnection(socket) {
    const self = this

    function keysIterator(key) {
      const event = self.events[key]

      function callback(message) {
        event.callback.call(self, new Message(message, socket))
      }

      if (event.roles[0] === 'all') {
        return socket.on(key, callback)
      }

      function callbackAuth(rawMessage) {
        const user = self.getUser(socket)
        const message = new Message(rawMessage, socket)

        function replyUnauthorized() {
          message.reply(new Error('Unauthorized access.'))
        }

        if (!user) {
          return replyUnauthorized()
        }

        if (event.roles.indexOf(user.role) === -1) {
          return replyUnauthorized()
        }

        return event.callback.call(self, message)
      }

      return socket.on(key, callbackAuth)
    }

    const keys = Object.keys(self.events)
    keys.forEach(keysIterator)

    const user = self.getUser(socket)

    if (!user) {
      return
    }

    self.updateOne(socket)
  }

  handleInitialize(message) {
    const self = this

    log.webSocket('Received initialization data:', message)

    const data = message.data

    if (self.database.initialized) {
      return message.reply(
        new Error('This instance has already been initialized.')
      )
    }

    function handleInitialize(error) {
      if (error) {
        return message.reply(error)
      }

      return message.reply()
    }

    this.database.initialize(data, handleInitialize)
  }

  handleUpdate(message) {
    function handleGet(error, kangaroos) {
      if (error) {
        return message.reply(error)
      }

      return message.reply({kangaroos: kangaroos})
    }

    this.database.getKangaroos(message.data, handleGet)
  }

  handleInsertKangaroo(message) {
    const self = this

    function handleInsert(error) {
      if (error) {
        return message.reply(error)
      }

      self.updateAll()

      message.reply()
    }

    self.database.insertKangaroo(message.data, handleInsert)
  }
}

module.exports = WebSocket
