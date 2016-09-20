import React from 'react'
import { connect } from 'react-redux'
import classes from './CoreLayout.scss'
import '../../styles/core.scss'
import { Layout, Panel } from 'react-toolbox'

export let CoreLayout = (props) => {
  const { isAuthenticated, children, dispatch } = props
  return (
    <div style={{height: '100%'}}>
      {children}
    </div>
  )
}

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired,
  isAuthenticated: React.PropTypes.bool,
  dispatch: React.PropTypes.func
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.globalReducer.isAuthenticated
})

CoreLayout = connect(mapStateToProps)(CoreLayout)

export default CoreLayout
