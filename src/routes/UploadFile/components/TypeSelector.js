import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Dropdown} from 'react-toolbox'
import classes from './TypeSelector.scss'

const types = [
  {
    value: 'Schematic',
    label: 'Schematic'
  }, {
    value: 'Layout',
    label: 'Layout'
  }, {
    value: 'Photo',
    label: 'Photo'
  }, {
    value: 'Other',
    label: 'Other'
  }
]

export class TypeSelector extends Component {
  static propTypes = {
    selection: PropTypes.string,
    returnSelection: PropTypes.func,
    change: PropTypes.func,
    field: PropTypes.string
  }
  state = {
    selection: 'Schematic'
  }
  constructor(props) {
    super(props)
    this.state = Object.assign({}, {selection: this.props.selection ? this.props.selection : 'Schematic'})
  }

  handleChange = (value) => {
    const {returnSelection, change, field} = this.props
    this.setState({selection: value})
    if (returnSelection) {
      returnSelection(value, change, field)
    }
  }

  componentDidMount = () => {
    const {returnSelection, change, field, selection} = this.props
    this.state = Object.assign({}, {selection: this.props.selection ? this.props.selection : 'Schematic'})
    if (returnSelection) {
      returnSelection(selection, change, field)
    }
  }

  render () {
    return (<Dropdown className={classes.typeSelector}
      allowBlank={false}
      onChange={this.handleChange}
      source={types}
      value={this.state.selection}
      />)
  }
}
export default TypeSelector
