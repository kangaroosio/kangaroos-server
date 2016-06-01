import React from 'react'
import ReactCSS from 'reactcss'

class Navigation extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'nav': {
          position: 'fixed'
        , left: '15rem'
        , top: 0
        , right: 0
        , color: '#000'
        , width: 'auto'
        , height: '5rem'
        , lineHeight: '5rem'
        , paddingLeft: '3rem'
        , textTransform: 'uppercase'
        , letterSpacing: '0.1em'
        }
      , 'navHeight': {
          height: '5rem'
        , lineHeight: '5rem'
        }
      , 'notifications': {
          padding: '0 1rem'
        , height: '5rem'
        }
      , 'bell': {
          display: 'inline-block'
        , lineHeight: '5rem'
        , height: '5rem'
        }
      , 'count': {
          verticalAlign: 'top'
        , marginLeft: '0.5rem'
        }
      }
    }
  }

  breadcrumbsLinkMapper(breadcrumb) {
    return `${breadcrumb.path}${breadcrumb.query}`
  }

  breadcrumbsMapper(breadcrumb, index, breadcrumbs) {
    function handleBreadcrumbClick() {
      const url = breadcrumbs.slice(0, index + 1)
        .map(this.breadcrumbsLinkMapper)
        .join('/')
      this.props.updateRoute(`/${url}`)
    }

    return (
      <a
        className='breadcrumb'
        key={index}
        onClick={handleBreadcrumbClick.bind(this)}
        style={{color: '#263238', cursor: 'pointer'}}
      >{breadcrumb.path}</a>
    )
  }

  render() {
    const props = this.props

    return (
      <nav className='white z-depth-0' is='nav'>
        <div className='nav-wrapper' is='navHeight'>
          {props.breadcrumbs.map(this.breadcrumbsMapper.bind(this))}
          <ul className='right' is='navHeight'>
            <li
              className='white-text deep-orange waves-effect waves-light'
              is='notifications'
            >
              <i className='material-icons' is='bell'>
                notifications
              </i>
              <span is='count'>
                {props.notificationCount}
              </span>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

Navigation.propTypes = {
  breadcrumbs: React.PropTypes.array.isRequired
, notificationCount: React.PropTypes.number.isRequired
, updateRoute: React.PropTypes.func.isRequired
}

export default Navigation
