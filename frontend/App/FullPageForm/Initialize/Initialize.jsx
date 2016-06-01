import React from 'react'
import ReactCSS from 'reactcss'

import FullPageForm from '../FullPageForm.jsx'
import Input from '../Input/Input.jsx'
import logo from '../../logo.png'

class Initialize extends ReactCSS.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitReply = this.handleSubmitReply.bind(this)
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this)
    this.handleFullNameChange = this.handleFullNameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)

    this.state = {
      projectName: ''
    , fullName: ''
    , email: ''
    , username: ''
    , password: ''
    , submitting: false
    }
  }

  classes() {
    return {
      'default': {
        'logo': {
          width: '50em'
        }
      , 'p': {
          textAlign: 'center'
        }
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault()

    this.setState({
      submitting: true
    })

    this.props.emit('initialize', this.state, this.handleSubmitReply)
  }

  handleSubmitReply(error) {
    this.setState({
      submitting: false
    })

    if (error) {
      return
    }

    this.props.updateRoute('login')
  }

  handleProjectNameChange(event) {
    this.setState({
      projectName: event.target.value
    })
  }

  handleFullNameChange(event) {
    this.setState({
      fullName: event.target.value
    })
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    const state = this.state

    return (
      <FullPageForm
        onSubmit={this.handleSubmit}
        submitting={state.submitting}
      >
        <img src={logo} is='logo'/>
        <p is='p'>
          <br/>
          Let's get started.
          <br/>
          <br/>
        </p>
        <Input
          id='projectName'
          label='Project Name'
          name='projectName'
          onChange={this.handleProjectNameChange}
          required
          type='text'
          value={state.projectName}
        />
        <Input
          id='fullName'
          label='Full Name'
          name='fullName'
          onChange={this.handleFullNameChange}
          required
          type='text'
          value={state.fullName}
        />
        <Input
          id='email'
          name='email'
          onChange={this.handleEmailChange}
          required
          type='email'
          value={state.email}
        />
        <Input
          id='username'
          name='username'
          onChange={this.handleUsernameChange}
          required
          type='text'
          value={state.username}
        />
        <Input
          id='password'
          name='password'
          onChange={this.handlePasswordChange}
          required
          type='password'
          value={state.password}
        />
        <p is='p'>
          <br/>
          <button
            className='btn waves-effect waves-light deep-orange'
            type='submit'
          >Get Started</button>
        </p>
      </FullPageForm>
    )
  }
}

Initialize.propTypes = {
  emit: React.PropTypes.func.isRequired
}

export default Initialize
