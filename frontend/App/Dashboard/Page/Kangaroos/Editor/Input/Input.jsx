import React from 'react'
import ReactCSS from 'reactcss'

class Input extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'row': {
          marginBottom: 0
        , textTransform: 'uppercase'
        }
      }
    }
  }

  render() {
    const props = this.props

    const view = props.type === 'textarea' ?
      <textarea className='materialize-textarea' {...props}></textarea>
    : <input className='validate' {...props}/>

    return (
      <div className='row' is='row'>
        <div className='input-field col s12'>
          {view}
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
