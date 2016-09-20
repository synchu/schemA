import React from 'react'
import classes from './Logo.scss'

export class Logo extends React.Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.drawLogo(this.props.scale)
  }
  componentDidUpdate () {
    this.drawLogo(this.props.scale)
  }

/*
  ds - scale parameter - 2x will double, 0.5 will halve
*/
  drawLogo (ds) {
    // was this.refs.canvas.
    let canvas = this.refs.canvas
    let logotext = 'SchemA'
    canvas.width = 723 * ds
    canvas.height = 182 * ds
    // set defaults

    // let ctx = this.refs.canvas.getContext('2d')
    let ctx = canvas.getContext('2d')

    // #layer1
    ctx.save()
    ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, -50.064171 * ds, -103.770390 * ds)

    // #text3336
    ctx.lineJoin = 'miter'
    ctx.lineCap = 'butt'
    ctx.lineWidth = 1.000000
    ctx.fillStyle = 'rgba(48, 97, 195, 0.8)'
    ctx.font = 'normal normal ' + 180 * ds + "px 'Chelsea Market'"
    ctx.fillText(logotext, 42.857140 * ds, 249.505070 * ds)

   
    // #text3336-5
    ctx.lineJoin = 'miter'
    ctx.lineCap = 'butt'
    ctx.lineWidth = 1.000000
    ctx.fillStyle = 'rgba(48, 97, 195, 0.5)'
    ctx.globalAlpha = 0.7
    ctx.font = 'normal normal ' + 180 * ds + "px 'Chelsea Market'"
    ctx.fillText(logotext, 43.698383 * ds, 250.090940 * ds)

    ctx.restore()
  }

  render () {
    return (
      <canvas ref='canvas'
        className={classes.logocanvas}
        width={this.props.width * this.props.scale}
        height={this.props.height * this.props.scale}>
      </canvas>
    )
  }

}

Logo.propTypes = {
  // default width 723
  width: React.PropTypes.string.isRequired,
  // default height 182
  height: React.PropTypes.string.isRequired,
  // scale prop:
  scale: React.PropTypes.string.isRequired
}

export default Logo
