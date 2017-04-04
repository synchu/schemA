import React from 'react'
import { FontIcon} from 'react-toolbox'
import SearchBox from './images/SearchBox_1.gif'
import ToggleMenu from './images/ToggleMenu.gif'
import FilterBox from './images/FilterBox.gif'
import AmplifiersBrandsList from './images/AmplifiersBrandsList.gif'
import TopMenu from './images/TopMenu.gif'
import ModelsAsList from './images/ModelsAsList.gif'
import CardsAsList from './images/CardsAsList.gif'
import ShowStats from './images/ShowStats.gif'
import TypesAsPictures from './images/TypesAsPictures.gif'
import classes from './HelpContents.scss'


export const TopMenuContent = () => {
    return (
    <div>
      <strong>SchemA top menu</strong> provides for the core navigation through the app features.
      <br />
      <br />
      <FontIcon value='menu' /> Left menu icon toggles amplifiers brands list visibility. You can click (or tap) to hide or show it.
      <br />
      <br />
      <FontIcon value='account_box' /> Provides login facility to user's account. Logins to <strong>SchemA</strong> are provided on per request basis. While you may freely register to Auth0 service that provides authentication services to this app, these will not automatically provide you with access to extended app features.
      <br />
      <br />
      <FontIcon value='clear' /> Clears the contents of the search box.
      <br />
      <br />
      <FontIcon value='settings' /> Opens application settings dialog.
      <br />
      <br />
      <FontIcon value='help' /> Opens this dialog box.
      <br />
      <br />
      <img src={TopMenu} alt='Top menu' />
    </div>
  )
}

export const AppSettingsContent = () => {
  return (
    <div>
      <strong>SchemA</strong> provides a number of appication settings to control display of amplifier information.
      <br />
      <br />
      <strong>Models as list</strong> controls display of an amplifier brand models (if any). They can be either displayed as tokens, which are easier to navigate on mobile devices, or list.
      <br />
      <img src={ModelsAsList} alt='Models as list' />
      <br />
      <br />
      <strong>Cards as list</strong> controls display of an amplifier item information. It can be displayed either as a card or list.
      <br />
      <img src={CardsAsList} alt='Cards as list' />
      <br />
      <br />
      <strong>Show stats</strong> displays some short statistics for each amplifier brand. I.e. how many schematics, layouts, etc. are stored by <strong>SchemA</strong>.
      <br />
      <img src={ShowStats} alt='Show stats' />
      <br />
      <br />
      <strong>Types as pictures</strong> controls display of each file item type, i.e. schematic can be either displayed either as <FontIcon value='developer_board' /> or simply 'SCH'.
      <br />
      <img src={TypesAsPictures} alt='Types as pictures' />
      <br />
      <br />
    </div>
  )
}

export const GeneralContent = () => {
  return (
    <div>
      <h4>Supported browsers</h4>
      <strong>SchemA</strong> supports most of the contemporary browser software. Please, make sure that you have the latest version of your favorite browser.
      <br />There are (naturally) few exceptions:
      <ul>
        <li>Edge is not fully supported for some of the content. Edge does not support data: URI that is used for downloading some of the content.</li>
        <li>Internet Explorer works for most of the features, albeit some visualizations might not be displayed entirely correct.</li>
      </ul>
      <h4>Supported devices</h4>
      <strong>SchemA</strong> is designed to work on desktop, laptop and mobile devices. For best experience and access to the full feature set of the application, it is recommended that you use either desktop or laptop computer or a tablet in landscape mode.
      <h4>View and save content</h4>
      
      <br />
    </div>
  )
}

export const SearchContent = () => {
  return (
    <div>
      <strong>SchemA</strong> searches content based on an amplifier version, model and brand. The search automatically shows available models when you start typing. You must select an item from the list displayed and the app will take you to the respective item.
      <br />
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
