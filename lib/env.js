'use strict'

const PORT = process.env.K_PORT

if (!PORT) {
  throw new Error('Missing K_PORT')
}

exports.PORT = PORT

const MONGO_URL = process.env.K_MONGO_URL

if (!MONGO_URL) {
  throw new Error('Missing K_MONGO_URL')
}

exports.MONGO_URL = MONGO_URL

const SESSION_SECRET = process.env.K_SESSION_SECRET

if (!SESSION_SECRET) {
  throw new Error('Missing K_SESSION_SECRET')
}

exports.SESSION_SECRET = SESSION_SECRET

const SOCKET_URL = process.env.K_SOCKET_URL

if (!SOCKET_URL) {
  throw new Error('Missing K_SOCKET_URL')
}

exports.SOCKET_URL = SOCKET_URL
