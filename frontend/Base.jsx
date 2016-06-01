import React from 'react'
import ReactDOM from 'react-dom'

import App from './App/App.jsx'

ReactDOM.render(
  <App socketUrl={env.SOCKET_URL}/>
, document.body.querySelector('#container')
)
