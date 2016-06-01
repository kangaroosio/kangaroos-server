import React from 'react'
import ReactCSS from 'reactcss'
import io from 'socket.io-client'
import urlParse from 'url-parse'
import uuid from 'node-uuid'

import * as log from 'log'

import Modal from './Modal/Modal.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'
import Login from './FullPageForm/Login/Login.jsx'
import Initialize from './FullPageForm/Initialize/Initialize.jsx'

class App extends ReactCSS.Component {
  constructor(props) {
    super(props)

    window.app = this

    log.web('Application started.')

    this.updateRoute = this.updateRoute.bind(this)

    var socket = {}
    if (typeof props.socketUrl === 'string') {
      socket = io(this.props.socketUrl)

      socket.on('connect', this.handleSocketConnect.bind(this))
      socket.on('disconnect', this.handleSocketDisconnect.bind(this))
      socket.on('initialize', this.handleSocketInitialize.bind(this))
      socket.on('reply', this.handleSocketReply.bind(this))
      socket.on('update', this.handleSocketUpdate.bind(this))
      this.emit = this.emit.bind(this)
    }

    const url = urlParse(window.location.href)
    const parsed = this.parseRoute(window.location.href)
    const route = parsed.route

    if (url.pathname !== route) {
      history.pushState(null, null, route)
    }

    this.state = {
      kangaroos: []
    , rawRoute: parsed.rawRoute
    , route: parsed.route
    , subRoute: parsed.subRoute
    , topRoute: parsed.topRoute
    , query: parsed.query
    , socket: socket
    , socketCallbacks: {}
    }
  }

  emit(type, data, callback) {
    const id = uuid.v4()

    const socketCallbacks = this.state.socketCallbacks
    socketCallbacks[id] = callback

    this.setState({
      socketCallbacks: socketCallbacks
    })

    this.state.socket.emit(type, {
      id: id
    , data: data
    })

    log.webSocket('Emitting', type, {id: id, data: data})
  }

  handleSocketConnect() {
    log.webSocket('Socket connected.')
    this.setState({socket: this.state.socket})
    this.emit('authenticate')
  }

  handleSocketDisconnect() {
    log.webSocket('Socket disconnected.')
    this.setState({socket: this.state.socket})
  }

  handleSocketInitialize() {
    log.webSocket('Initialization requested.')
    this.updateRoute('initialize')
  }

  handleSocketReply(message) {
    var error

    if (message.success) {
      error = null
      log.webSocket('Reply received:', message)
    } else {
      error = new Error(message.reason)
      log.webSocket('Unsuccessful reply recieved:', message.reason, message)
    }

    const socketCallbacks = this.state.socketCallbacks
    const callback = socketCallbacks[message.replyTo]

    if (!callback) {
      return
    }

    callback(error, message.data)

    delete socketCallbacks[message.replyTo]

    this.setState({
      socketCallbacks: socketCallbacks
    })
  }

  handleSocketUpdate(message) {
    log.web('Update received:', message)

    const data = message.data

    this.setState({
      kangaroos: data.kangaroos
    })
  }

  parseRoute(raw) {
    const parsed = urlParse(raw, true)
    var route = parsed.pathname

    if (route === '/') {
      route = '/dashboard'
    }

    const indexOfSlash = route.indexOf('/', 1)

    return {
      route: route
    , subRoute: indexOfSlash === -1 ? '/' : route.substring(indexOfSlash)
    , topRoute: indexOfSlash === -1 ? route : route.substring(0, indexOfSlash)
    , query: parsed.query
    , rawRoute: raw
    }
  }

  updateRoute(raw) {
    const parsed = this.parseRoute(raw)
    const rawRoute = parsed.rawRoute

    if (this.state.rawRoute === rawRoute) {
      return
    }

    log.web('Updating route:', rawRoute, parsed)
    history.pushState(null, null, rawRoute)

    this.setState(parsed)
  }

  classes() {
    return {
      'default': {
        'app': {
          fontFamily: 'Roboto'
        }
      }
    }
  }

  breadcrumbsMapper(breadcrumb) {
    const queryIndex = breadcrumb.indexOf('?')

    if (queryIndex === -1) {
      return {
        path: breadcrumb
      , query: ''
      }
    }

    return {
      path: breadcrumb.substring(0, queryIndex)
    , query: breadcrumb.substring(queryIndex)
    }
  }

  createBreadcrumbs() {
    return (
      this.state.rawRoute
        .substring(1)
        .split('/')
        .map(this.breadcrumbsMapper)
    )
  }

  render() {
    const state = this.state

    var currentView

    switch (state.topRoute) {
      case '/login':
        currentView = (
          <Login
            emit={this.emit}
            updateRoute={this.updateRoute}
          />
        )
      break
      case '/initialize':
        currentView = (
          <Initialize
            emit={this.emit}
            updateRoute={this.updateRoute}
          />
        )
      break
      case '/dashboard':
        currentView = (
          <Dashboard
            breadcrumbs={this.createBreadcrumbs()}
            emit={this.emit}
            kangaroos={state.kangaroos}
            query={state.query}
            route={state.subRoute}
            updateRoute={this.updateRoute}
          />
        )
      break
    }

    return (
      <div is='app'>
        {
          state.socket.disconnected
            ? <Modal className='red white-text'>Disconnected...</Modal>
            : null
        }
        {currentView}
      </div>
    )
  }
}

App.propTypes = {
  socketUrl: React.PropTypes.string.isRequired
}

export default App
