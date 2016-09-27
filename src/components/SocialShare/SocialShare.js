import React from 'react'
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share'
import classes from './SocialShare.scss'


const {
  FacebookShareButton,
  GooglePlusShareButton,
  TwitterShareButton
} = ShareButtons

const {
  FacebookShareCount,
  GooglePlusShareCount
} = ShareCounts

const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const GooglePlusIcon = generateShareIcon('google')

export const SocialShare = () => {
  const shareUrl = 'http://schematics.synchu.com'
  const title = 'SchemA - the ultimate DIY tube amps schematics archive for http://diyguitaramps.prophpbb.com/';

  return (
    <div className={classes.sharePanel}>
      <div className={classes.sharePack}>
        <FacebookShareButton
          url={shareUrl}
          title={title}
          >
          <FacebookIcon
            size={28}
            round />
        </FacebookShareButton>

        <FacebookShareCount
          url={shareUrl}
          className={classes.counter}
          >
          {count => count}
        </FacebookShareCount>
      </div>

      <div className={classes.sharePack}>
        <TwitterShareButton
          url={shareUrl}
          title={title}>
          <TwitterIcon
            size={28}
            round />
        </TwitterShareButton>

        <div >
          &nbsp;
        </div>
      </div>

      <div className={classes.sharePack}>
        <GooglePlusShareButton
          url={shareUrl}
          >
          <GooglePlusIcon
            size={28}
            round />
        </GooglePlusShareButton>

        <GooglePlusShareCount
          url={shareUrl}
          className={classes.counter}
          >
          {count => count}
        </GooglePlusShareCount>
      </div>
    </div>
  )
}

export default SocialShare
