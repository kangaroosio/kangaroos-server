'use strict'

class Message {
  constructor(message, socket) {
    this.id = message.id
    this.data = message.data
    this.socket = socket
  }

  reply(data) {
    if (data instanceof Error) {
      return this.socket.emit('reply', {
        replyTo: this.id
      , success: false
      , reason: data.message
      })
    }

    this.socket.emit('reply', {
      replyTo: this.id
    , success: true
    , data: data
    })
  }
}

module.exports = Message
