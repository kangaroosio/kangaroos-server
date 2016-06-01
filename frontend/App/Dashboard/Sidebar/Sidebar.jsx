import React from 'react'
import ReactCSS from 'reactcss'

import Item from './Item/Item.jsx'

class Sidebar extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'ul': {
          position: 'absolute'
        , left: 0
        , top: 0
        , width: '15rem'
        , bottom: 0
        , margin: 0
        , border: 'none'
        , borderRadius: 0
        }
      , 'home': {
          textAlign: 'center'
        }
      }
    }
  }

  render() {
    const props = this.props

    return (
      <ul className='collection blue-grey darken-4' is='ul'>
        <Item
          href='/dashboard'
          icon='home'
          isHome
          updateRoute={props.updateRoute}
        />
        <Item
          href='/dashboard/kangaroos'
          icon='assignment'
          updateRoute={props.updateRoute}
        >Kangaroos</Item>
        <Item
          href='/dashboard/troops'
          icon='list'
          updateRoute={props.updateRoute}
        >Troops</Item>
      </ul>
    )
  }
}

Sidebar.propTypes = {
  updateRoute: React.PropTypes.func.isRequired
}

export default Sidebar
