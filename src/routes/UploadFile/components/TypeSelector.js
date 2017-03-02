import React, {PropTypes, Component} from 'react'
import {Dropdown} from 'react-toolbox'
import classes from './TypeSelector.scss'

const types = [
  {
    value: 'schematics',
    label: 'Schematic'
  }, {
    value: 'layout',
    label: 'Layout'
  }, {
    value: 'photo',
    label: 'Photo'
  }, {
    value: 'other',
    label: 'Other'
  }
]

export class TypeSelector extends Component {
  static propTypes = {
    selection: PropTypes.string
  }
  state = {
    selection: 'schematic'
  }
  constructor(props) {
    super(props)
    this.state = Object.assign({}, {selection: this.props.selection ? this.props.selection : 'schematic'})
  }

  handleChange = (value) => {
    this.setState({selection: value})
  }

  render() {
    return (<Dropdown className={classes.typeSelector}
      allowBlank={false}
      onChange={this.handleChange}
      source={types}
      value={this.state.selection}
      />)
  }
}
export default TypeSelector
