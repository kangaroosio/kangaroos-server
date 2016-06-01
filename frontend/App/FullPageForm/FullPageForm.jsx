import React from 'react'
import ReactCSS from 'reactcss'

class FullPageForm extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'section': {
          position: 'absolute'
        , left: 0
        , right: 0
        , top: 0
        , minHeight: '100%'
        , height: 'auto'
        , display: 'flex'
        , flexDirection: 'column'
        , alignItems: 'center'
        , justifyContent: 'center'
        , textAlign: 'center'
        , textTransform: 'uppercase'
        , letterSpacing: '0.1em'
        , boxSizing: 'border-box'
        , padding: '2em'
        }
      , 'form': {
          display: 'block'
        , width: '100%'
        }
      , 'h1': {
          letterSpacing: '0.1em'
        }
      }
    }
  }

  render() {
    const props = this.props

    const spinner = (
      <div>
        <h1 is='h1'>Working</h1>
        <div className='progress'>
          <div className='indeterminate'></div>
        </div>
      </div>
    )

    return (
      <section is='section'>
        <form is='form' onSubmit={props.onSubmit}>
          {props.submitting ? spinner : props.children}
        </form>
      </section>
    )
  }
}

FullPageForm.propTypes = {
  onSubmit: React.PropTypes.func
, submitting: React.PropTypes.bool
}

export default FullPageForm
