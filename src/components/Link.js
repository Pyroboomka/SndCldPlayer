import React, { Component } from 'react'
import { push } from 'react-router-redux'

class Link extends Component {
  handleLinkClick(e) {
    e.preventDefault()
    const { dispatch, path, query } = this.props
    dispatch(push(`${path}?q=${query}`))
  }

  render() {
    const { className, path, query, children } = this.props
    return (
      <a onClick={this.handleLinkClick.bind(this)}
        href={`${path}?q=${query}`}
        className={`link ${className}`}
        >{children}
      </a>

    )
  }
}
export default Link
