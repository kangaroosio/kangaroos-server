import React from 'react'
import ReactCSS from 'reactcss'

import Navigation from './Navigation/Navigation.jsx'
import Sidebar from './Sidebar/Sidebar.jsx'

import Home from './Page/Home/Home.jsx'
import Kangaroos from './Page/Kangaroos/Kangaroos.jsx'
import KangaroosEditor from './Page/Kangaroos/Editor/Editor.jsx'

class Dashboard extends ReactCSS.Component {
  constructor(props) {
    super(props)
    console.log(props)

    this.getKangaroo = this.getKangaroo.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleSaveNew = this.handleSaveNew.bind(this)
    this.handleSaveReply = this.handleSaveReply.bind(this)
  }

  classes() {
    return {
      'default': {
        'section': {
          position: 'absolute'
        , left: 0
        , top: 0
        , right: 0
        , bottom: 0
        }
      , 'content': {
          position: 'absolute'
        , left: '15rem'
        , right: 0
        , top: '5rem'
        , bottom: 0
        }
      }
    }
  }

  handleSaveReply(error) {
    if (error) {
      return
    }

    this.props.updateRoute('/dashboard/kangaroos')
  }

  handleSave(data) {
    this.props.emit('update kangaroo', data, this.handleSaveReply)
  }

  handleSaveNew(data) {
    this.props.emit('insert kangaroo', data, this.handleSaveReply)
  }

  getKangaroo(query) {
    return this.props.kangaroos.find(function kangarooFinder(kangaroo) {
      if (kangaroo._id === query.id) {
        return true
      }

      return false
    })
  }

  render() {
    const props = this.props

    var currentView

    const queryIndex = props.route.indexOf('?')
    const route = queryIndex === -1
      ? props.route
      : props.route.substring(0, queryIndex)

    switch (route) {
      case '/':
        currentView = <Home/>
      break
      case '/kangaroos':
        currentView = (
          <Kangaroos
            kangaroos={props.kangaroos}
            updateRoute={props.updateRoute}
          />
        )
      break
      case '/kangaroos/new':
        currentView = (
          <KangaroosEditor
            onSave={this.handleSaveNew.bind(this)}
            updateRoute={props.updateRoute}
          />
        )
      break
      case '/kangaroos/edit':
        currentView = (
          <KangaroosEditor
            kangaroo={this.getKangaroo(props.query)}
            onSave={this.handleSave.bind(this)}
            updateRoute={props.updateRoute}
          />
        )
      break
    }

    return (
      <section className='blue-grey lighten-5' is='section'>
        <Navigation
          breadcrumbs={props.breadcrumbs}
          notificationCount={0}
          updateRoute={props.updateRoute}
        />
        <Sidebar updateRoute={props.updateRoute}/>
        <div is='content'>
          {currentView}
        </div>
      </section>
    )
  }
}

Dashboard.propTypes = {
  breadcrumbs: React.PropTypes.array.isRequired
, emit: React.PropTypes.func.isRequired
, kangaroos: React.PropTypes.array.isRequired
, query: React.PropTypes.object
, route: React.PropTypes.string
, updateRoute: React.PropTypes.func.isRequired
}

export default Dashboard
