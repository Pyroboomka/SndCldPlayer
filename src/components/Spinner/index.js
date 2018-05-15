import React from 'react'
import './styles.css'

const Spinner = (props) => (
  props.isSpinning
    ? (
      <div className="spinner-wrapper">
        <div className="cssload-container">
          <ul className="cssload-loader">
            <li /><li /><li /><li /><li /><li />
          </ul>
        </div>
      </div>
    )
    : props.children
)

export default Spinner
