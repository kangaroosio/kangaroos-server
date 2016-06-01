import React from 'react'
import ReactCSS from 'reactcss'

import Page from '../../Page.jsx'
import Input from './Input/Input.jsx'

class Editor extends ReactCSS.Component {
  constructor(props) {
    super(props)

    this.handleClickSave = this.handleClickSave.bind(this)

    const kangaroo = props.kangaroo

    this.state = {
      name: kangaroo ? kangaroo.name : ''
    , content: kangaroo ? kangaroo.content : ''
    }
  }

  classes() {
    return {
      'default': {
        'save': {
          position: 'fixed'
        , right: '2rem'
        , bottom: '2rem'
        }
      }
    }
  }

  componentWillUpdate(props) {
    const state = this.state
    const kangaroo = props.kangaroo

    if (!kangaroo) {
      return
    }

    if (state.name.length || state.content.length) {
      return
    }

    this.setState({
      name: kangaroo.name
    , content: kangaroo.content
    })
  }

  componentDidMount() {
    this.refs.save.addEventListener('click', this.handleClickSave)
  }

  handleClickSave(event) {
    const state = this.state

    event.preventDefault()

    this.props.onSave({
      name: state.name
    , content: state.content
    })
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  handleContentChange(event) {
    this.setState({
      content: event.target.value
    })
  }

  render() {
    const state = this.state

    return (
      <Page>
        <div className='row'>
          <div className='col s12'>
            <Input
              id='name'
              name='name'
              onChange={this.handleNameChange.bind(this)}
              type='text'
              value={state.name}
            />
            <Input
              id='pouch'
              name='pouch'
              onChange={this.handleContentChange.bind(this)}
              type='textarea'
              value={state.content}
            />
          </div>
        </div>
        <a
          className='btn-floating btn-large waves-effect waves-light teal'
          is='save'
          ref='save'
        >
          <i className='material-icons'>save</i>
        </a>
      </Page>
    )
  }
}

Editor.propTypes = {
  onSave: React.PropTypes.func.isRequired
, updateRoute: React.PropTypes.func.isRequired
}

export default Editor
