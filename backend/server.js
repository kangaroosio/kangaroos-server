'use strict'

const env = require('../lib/env')
const log = require('../lib/log')

const Database = require('./Database/Database')
const HttpServer = require('./HttpServer/HttpServer')
const WebSocket = require('./WebSocket/WebSocket')

const database = new Database({url: env.MONGO_URL}, handleDatabase)

function handleDatabase(error) {
  if (error) {
    throw new Error('Database failure:', error)
  }

  const httpServer = new HttpServer({
    port: env.PORT
  , database: database
  })

  const webSocket = new WebSocket({
    httpServer: httpServer
  , store: httpServer.store
  , database: database
  })

  log.httpServer('Started HTTP Server:', httpServer)
  log.webSocket('Started WebSocket Server:', webSocket)
}
