'use strict'

const express = require('express')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)

const passport = require('passport')
const passportExt = require('./passport/extensions')

const env = require('../../lib/env')
const log = require('../../lib/log')
const paths = require('../../lib/paths')

class HttpServer {
  constructor(options) {
    this.express = express()

    this.http = require('http').createServer(this.express)
    this.store = new MongoStore({url: env.MONGO_URL})
    this.session = expressSession({
      store: this.store
    , secret: env.SESSION_SECRET
    })

    this.set('views', paths.FRONTEND)
    this.set('view engine', 'jade')

    this.use(bodyParser.json())
    this.use(bodyParser.urlencoded({extended: true}))
    this.use(cookieParser())
    this.use(this.session)

    // Database
    this.database = options.database

    // Passport
    this.passport = passport
    this.passport.use(passportExt.createStrategy(this.database))
    this.passport.serializeUser(passportExt.handleSerializeUser)
    this.passport.deserializeUser(
      passportExt.createDeserializeUserHandler(this.database)
    )

    this.use(this.passport.initialize())
    this.use(this.passport.session())

    // Routes
    this.get('/favicon.ico', this.handleGetFavicon.bind(this))
    this.post(
      '/login'
    , this.passport.authenticate('local')
    , this.handlePostLogin.bind(this)
    )
    this.get('/base.js', this.handleGetBaseJs.bind(this))
    this.get('/login', this.handleGetLogin.bind(this))
    this.get('/initialize', this.handleGetInitialize.bind(this))
    this.get('*', this.handleGetWildcard.bind(this))

    // Listen
    this.server = this.http.listen(
      options.port || env.PORT
    , this.handleListen.bind(this)
    )
  }


  // Settings
  set(...args) {
    this.express.set(...args)
  }

  use(...args) {
    this.express.use(...args)
  }

  ioUse(...args) {
    this.io.use(...args)
  }

  // Routes
  post(...args) {
    this.express.post(...args)
  }

  get(...args) {
    this.express.get(...args)
  }

  // Getters
  getUser(request) {
    const session = request.session

    if (!session) {
      return null
    }

    const passport = session.passport

    if (!passport) {
      return null
    }

    const user = passport.user

    if (!user) {
      return null
    }

    return user
  }

  // Handlers
  handleListen() {
    const address = this.server.address()

    const host = address.address
    const port = address.port

    log.httpServer(`Listening on ${host}:${port}`)
  }

  handlePostLogin(request, response) {
    response.json({success: true})
  }

  handleGetBaseJs(request, response) {
    response.sendFile(paths.BASE_JS)
  }

  handleGetLogin(request, response, next) {
    if (this.getUser(request)) {
      return response.redirect('/')
    }

    next()
  }

  handleGetInitialize(request, response, next) {
    if (this.database.initialized) {
      return response.redirect('/')
    }

    next()
  }

  handleGetFavicon(request, response) {
    response.end()
  }

  handleGetWildcard(request, response) {
    if (request.path !== '/initialize' && !this.database.initialized) {
      return response.redirect('/initialize')
    }

    if (
       ['/initialize', '/login'].indexOf(request.path) < 0
    && !this.getUser(request)) {
      return response.redirect('/login')
    }

    response.render('base')
  }
}

module.exports = HttpServer
