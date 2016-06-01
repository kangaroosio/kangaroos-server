import React from 'react'
import ReactCSS from 'reactcss'

import Page from '../Page.jsx'
import logo from '../../../logo.png'

class Home extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'container': {
          display: 'flex'
        , justifyContent: 'center'
        , alignItems: 'center'
        , position: 'absolute'
        , top: 0
        , bottom: 0
        , left: 0
        , right: 0
        }
      }
    }
  }

  render() {
    return (
      <Page>
        <div is='container'>
          <img src={logo}/>
        </div>
      </Page>
    )
  }
}

export default Home
