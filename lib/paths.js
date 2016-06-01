'use strict'

const path = require('path')

const LIB = __dirname
exports.LIB = LIB

const FRONTEND = path.join(__dirname, '..', 'frontend')
exports.FRONTEND = FRONTEND

const APP = path.join(FRONTEND, 'App')
exports.APP = APP

const I18N = path.join(APP, 'i18n')
exports.I18N = I18N

const DIST = path.join(__dirname, '..', 'dist')
exports.DIST = DIST

const BASE_JS = path.join(DIST, 'base.bundle.js')
exports.BASE_JS = BASE_JS
