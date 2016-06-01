'use strict'

const LocalStrategy = require('passport-local').Strategy

const log = require('../../../lib/log')

exports.createStrategy = function createStrategy(database) {
  return new LocalStrategy(function handleLogin(username, password, done) {
    log.passport('Attempting to authorize:', username)

    database.authenticateUser({
      username: username
    , password: password
    }, done)
  })
}

exports.handleSerializeUser = function handleSerializeUser(user, done) {
  log.passport('Serializing:', user.username)
  done(null, user.username)
}

exports.createDeserializeUserHandler = function createDeserializeUserHandler(
  database
) {
  return function handleDeserializeUser(username, done) {
    log.passport('Deserializing:', username)

    database.findUser({username: username}, done)
  }
}
