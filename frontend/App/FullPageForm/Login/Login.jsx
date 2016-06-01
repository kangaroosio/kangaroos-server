import request from 'superagent'
import React from 'react'
import ReactCSS from 'reactcss'

import log from 'log'

import FullPageForm from '../FullPageForm.jsx'
import Input from '../Input/Input.jsx'

class Login extends ReactCSS.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: ''
    , password: ''
    , submitting: false
    }
  }

  classes() {
    return {
      'default': {
        'h1': {
          letterSpacing: '0.1em'
        }
      , 'p': {
          textAlign: 'center'
        }
      }
    }
  }

  handleSubmit(event) {
    const self = this
    const state = self.state

    event.preventDefault()

    request.post(
      '/login'
    , {
        username: state.username
      , password: state.password
      }
    , function handleLogin(error, response) {
        if (error) {
          return log.web('Failed to login:', error)
        }

        if (!JSON.parse(response.text).success) {
          return log.web('Unable to login.')
        }

        log.web('Successful login.')
        self.props.updateRoute('/')

        self.props.emit('update')
      }
    )
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
        onSubmit={this.handleSubmit.bind(this)}
        submitting={state.submitting}
      >
        <h1 is='h1'>Kangaroos</h1>
        <Input
          id='username'
          name='username'
          onChange={this.handleUsernameChange.bind(this)}
          type='text'
          value={state.username}
        />
        <Input
          id='password'
          name='password'
          onChange={this.handlePasswordChange.bind(this)}
          type='password'
          value={state.password}
        />
        <p is='p'>
          <button
            className='btn waves-effect waves-light'
            type='submit'
          >Login</button>
        </p>
      </FullPageForm>
    )
  }
}

Login.propTypes = {
  emit: React.PropTypes.func.isRequired
, updateRoute: React.PropTypes.func.isRequired
}

export default Login
