import React from 'react'
import ReactCSS from 'reactcss'

class Page extends ReactCSS.Component {
  classes() {
    return {
      'default': {
        'section': {
          padding: '2rem'
        , minHeight: '100%'
        }
      }
    }
  }

  render() {
    const props = this.props

    return (
      <section is='section' key='page'>
        {props.children}
      </section>
    )
  }
}

export default Page
