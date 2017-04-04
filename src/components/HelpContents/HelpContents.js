import React from 'react'
import {IconButton} from 'react-toolbox'
import SearchBox from './images/SearchBox_1.gif'
import ToggleMenu from './images/ToggleMenu.gif'
import FilterBox from './images/FilterBox.gif'
import AmplifiersBrandsList from './images/AmplifiersBrandsList.gif'
import classes from './HelpContents.scss'

export const SearchContent = () => {
  return (
    <div>
      <strong>SchemA</strong> searches content based on an amplifier version, model and brand. The search automatically shows available models when you start typing. You must select an item from the list displayed and the app will take you to the respective item.
      <br />
      <img src={SearchBox} alt='SearchBox' />
    </div>
  )
}

export const SideNavigation = () => {
  return (
    <div className={classes.container}>
      <strong>SchemA</strong> Side Navigation Bar has three core elements.
      <br />
      <br />
      <strong>1. Toggle menu</strong>, used for amplifiers brands list display
      <br />
      <img src={ToggleMenu} alt='Toggle menu visualization' />
      <br />
      <br />
      <strong>2. Filter box</strong>, used for easy filter "as-you-type" of the brands
      <br />
      <img src={FilterBox} alt='Filter box usage' />
      <br />
      <br />
      <strong>3. Amplifiers brands list</strong> itself, where upon selecting a brand, the respective models are displayed. If there is no clear model line (or we hadn't figure it out yet) then there is a single model 'All' that is automatically selected by <strong>SchemA</strong> upon brand's selection.
      <br />
      <img src={AmplifiersBrandsList} alt='Amplifiers Brands List usage' />
      <br />
    </div>
  )
}
