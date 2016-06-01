'use strict'

const PREFIX = 'k'
const debug = require('debug')

exports.httpServer = debug(`${PREFIX}:httpServer`)
exports.webSocket = debug(`${PREFIX}:webSocket`)
exports.passport = debug(`${PREFIX}:passport`)
exports.database = debug(`${PREFIX}:database`)
exports.web = debug(`${PREFIX}:web`)
