import React from 'react'
import ReactCSS from 'reactcss'

import Page from '../Page.jsx'
import Kangaroo from './Kangaroo/Kangaroo.jsx'

class Kangaroos extends ReactCSS.Component {
  constructor(props) {
    super(props)

    this.kangarooMapper = this.kangarooMapper.bind(this)
    this.handleClickAdd = this.handleClickAdd.bind(this)
  }

  classes() {
    return {
      'default': {
        'add': {
          position: 'fixed'
        , right: '2rem'
        , bottom: '2rem'
        }
      }
    }
  }

  kangarooMapper(kangaroo) {
    return (
      <Kangaroo
        content={kangaroo.content}
        id={kangaroo._id}
        key={kangaroo._id}
        title={kangaroo.name}
        updateRoute={this.props.updateRoute}
      />
    )
  }

  componentDidMount() {
    this.refs.add.addEventListener('click', this.handleClickAdd)
  }

  handleClickAdd(event) {
    event.preventDefault()

    this.props.updateRoute('/dashboard/kangaroos/new')
  }

  render() {
    const props = this.props

    return (
      <Page>
        <div className='row'>
          {props.kangaroos.map(this.kangarooMapper)}
        </div>
        <a
          className='btn-floating btn-large waves-effect waves-light red'
          is='add'
          ref='add'
        >
          <i className='material-icons'>add</i>
        </a>
      </Page>
    )
  }
}

Kangaroos.propTypes = {
  kangaroos: React.PropTypes.array.isRequired
, updateRoute: React.PropTypes.func.isRequired
}

export default Kangaroos
