import React from 'react'
import ReactCSS from 'reactcss'

class Kangaroo extends ReactCSS.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  classes() {
    return {
      'default': {
        'title': {
          display: 'block'
        , overflow: 'hidden'
        , textOverflow: 'ellipsis'
        , whiteSpace: 'nowrap'
        }
      , 'content': {
          display: 'block'
        , overflow: 'hidden'
        , textOverflow: 'ellipsis'
        , height: '5em'
        }
      , 'card': {
          display: 'block'
        }
      }
    }
  }

  componentDidMount() {
    this.refs.card.addEventListener('click', this.handleClick)
  }

  handleClick(event) {
    event.preventDefault()

    this.props.updateRoute(`/dashboard/kangaroos/edit?id=${this.props.id}`)
  }

  render() {
    const props = this.props

    return (
      <div className='col s12 m4'>
        <div
          className='card z-depth-0 waves-effect waves-dark'
          is='card'
          ref='card'
        >
          <div className='card-content'>
            <span className='card-title' is='title'>
              {props.title}
            </span>
            <p is='content'>
              {props.content}
            </p>
          </div>
        </div>
      </div>
    )
  }
}

Kangaroo.propTypes = {
  id: React.PropTypes.string.isRequired
, updateRoute: React.PropTypes.func.isRequired
}

export default Kangaroo
