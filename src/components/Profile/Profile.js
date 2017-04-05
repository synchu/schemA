import React, {Component, PropTypes} from 'react'
import {Avatar, IconButton} from 'react-toolbox'
import classes from './Profile.scss'
import cn from 'classnames'

export class Profile extends Component {
  state = {
    visible: true
  }

  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    isAdmin: PropTypes.bool
  }

  handleClick = (e) => {
    console.log(e.target.id)
  }

  toggleProfile = (e) => {
    this.setState({
      ...this.state,
      visible: !this.state.visible
    })
  }

  render () {
    const {title, image, name, isAdmin} = this.props
    return (
      <div className={cn(classes.avatarPanel, isAdmin ? classes.admin : '')}>
        {this.state.visible && <span>
          <Avatar image={image} title={title} onClick={this.handleClick} />
          <span style={{
            marginLeft: '5px'
          }}>
            {name}
          </span>
        </span>}
        <IconButton
          icon={this.state.visible
          ? 'keyboard_arrow_up'
          : 'keyboard_arrow_down'}
          onClick={this.toggleProfile}
          className={classes.toggleButton}
          title='Show/hide...' />
      </div>
    )
  }
}

export default Profile
