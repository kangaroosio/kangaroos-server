import React from 'react'
import ReactCSS from 'reactcss'

class Modal extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'modal': {
          position: 'fixed'
        , bottom: '3rem'
        , left: '50%'
        , width: '20rem'
        , marginLeft: '-2.5rem'
        , zIndex: 9000
        , textAlign: 'center'
        , textTransform: 'uppercase'
        , letterSpacing: '0.1em'
        }
      }
    }
  }

  render() {
    const props = this.props

    return (
      <div className={`card-panel ${props.className}`} is='modal'>
        {props.children}
      </div>
    )
  }
}

export default Modal
