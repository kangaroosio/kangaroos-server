import React from 'react'
import ReactCSS from 'reactcss'

class Item extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'li': {
          textTransform: 'uppercase'
        , border: 'none'
        , height: '5rem'
        , lineHeight: '5rem'
        , letterSpacing: '0.15em'
        , boxSizing: 'border-box'
        , padding: '0 1.5rem'
        , display: 'block'
        }
      , 'icon': {
          verticalAlign: 'middle'
        , marginRight: '1rem'
        }
      , 'liHome': {
          border: 'none'
        , height: '5rem'
        , lineHeight: '5rem'
        , textAlign: 'center'
        , display: 'block'
        }
      }
    }
  }

  componentDidMount() {
    const self = this
    const props = self.props

    self.refs.li.addEventListener('click', function handleClick() {
      props.updateRoute(props.href)
    })
  }

  render() {
    const props = this.props

    return props.isHome ? (
      <li
        className='collection-item grey darken-4 white-text waves-effect waves-light'
        is='liHome'
        ref='li'
      >
        <i className='small material-icons'>home</i>
      </li>
    ) : (
      <li
        className='collection-item blue-grey darken-4 white-text waves-effect waves-light'
        is='li'
        ref='li'
      >
        <i className='small material-icons' is='icon'>{props.icon}</i>
        {props.children}
      </li>
    )
  }
}

Item.propTypes = {
  href: React.PropTypes.string
, icon: React.PropTypes.string
, isHome: React.PropTypes.bool
, updateRoute: React.PropTypes.func.isRequired
}

export default Item
