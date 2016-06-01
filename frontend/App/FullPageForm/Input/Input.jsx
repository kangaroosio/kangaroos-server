import React from 'react'
import ReactCSS from 'reactcss'

class Input extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'row': {
          width: '100%'
        , maxWidth: '30rem'
        , marginBottom: 0
        }
      }
    }
  }

  render() {
    const props = this.props

    return (
      <div className='row' is='row'>
        <div className='input-field col s12'>
          <input
            className='validate'
            {...props}
          />
          <label
            className='active'
            htmlFor={props.id}
          >{props.label || props.name}</label>
        </div>
      </div>
    )
  }
}

export default Input
