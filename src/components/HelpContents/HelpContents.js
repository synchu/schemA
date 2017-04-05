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
import EditAmplifierItem from './images/EditAmplifierItem.gif'
import cx from 'classnames'
import classes from './HelpContents.scss'

export const TopMenuContent = () => {
  return (
    <div className={classes.helpText}>
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
    <div className={classes.helpText}>
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
    <div className={classes.helpText}>
      <h4>Supported browsers</h4>
      <strong>SchemA</strong> supports most of the contemporary browser software. Please, make sure that you have the latest version of your favorite browser.
      <br />There are (naturally) few exceptions:
      <ul className={classes.helpList}>
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
    <div className={classes.helpText}>
      <strong>SchemA</strong> searches content based on an amplifier version, model and brand. The search automatically shows available models when you start typing. You must select an item from the list displayed and the app will take you to the respective item.
      <br />
      <br />
      <img src={SearchBox} alt='SearchBox' />
    </div>
  )
}

export const InlineContent = () => {
  return (
    <div className={classes.helpText}>
      <strong>SchemA</strong> allows inline editing of amplifier item data within an amplifier item card. Editing within Table views is not possible.
      <br />
      Inline editing is available only to logged and appropriately authorized users.
      <br />
      Once you're logged in, upon hovering with your mouse on the respective card item a <FontIcon value='mode_edit' /> button is displayed. Clicking on the pencil button switches the field to editing mode.
      <ul className={classes.helpList}>
      You can edit the follow items:
      <li><i>Model</i> - editing the model field will <strong>move</strong> this amplifier item information to another model or will create a new model, if the data entered does not exist in the models' list for the respective brand</li>
      <li><i>Version</i> - changes the amplifier item version information</li>
      <li><i>Description</i> - changes the desciption</li>
      <li><i>Contributor</i> - changes the contributor</li>
      </ul>
      Upon finalizing the editing process for the respective field you can click on the <FontIcon value='save' /> button to save your edits or <FontIcon value='cancel' /> button to cancel your data entry.
      <br />
      <strong>Note:</strong> You will need to reload the data to view your changes, if you are changing the amplifier item model. Simply click on another brand and then back to the brand and model line edited.
      <br />
      <strong>Note:</strong> Brand names cannot be changed. If you would like to change a brand name, please, contact an administrator.
      <br />
      
    </div>
  )
}

export const UploadGeneralContent = () => {
  return (
    <div className={classes.helpText}>
      <h4>Amplifier item</h4>
      <strong>SchemA</strong> organizes amplifiers information based on brands, models within the brand and versions within the model. For example - <i>brand:</i> Fender, <i>model:</i> Deluxe, <i>version:</i> 5E3.
      <i>Note</i>, that not all amplifier brands have clearly defined model lines, therefore, where we haven't managed to split the information by models, there's a commong grouping of information items under a single <i>All</i> model.
      <h4>Security provisions</h4>
      The below is rather technical and a bit unclear, however, in short it says that you cannot access directly the files uploaded to the ./sch/ directory by the name of the file for security reasons.
      <br />
      It should be noted that <strong>SchemA</strong> provides features to upload image and pdf files and while best effort has been made to inspect the uploads, this is not possible in all cases.
      <br />
      Therefore, file uploads are handled via specifically designed upload functionality that does not provide further direct access to the uploaded files. Uploaded files are served by <strong>SchemA</strong> server software upon request.
      <h4>Deleting amplifier information</h4>
      You cannot delete a file that has been already <i>saved</i> to <strong>SchemA</strong> database. Please, contact us if you would like to delete a file item.
      <br />
      <br />
    </div>
  )
}

export const EditCreateContent = () => {
  return (
    <div className={classes.helpText}>
      <h4>Edit existing amplifier item</h4>
      In order to edit an existing amplifier item you must select the amplifier brand, model and version. <strong>SchemA</strong> provides autocomplete enabled inputs and we <strong>strongly</strong> suggest using them to find the amplifier information you would like to edit.
      <br />
      The following amplifier information can be edited:
      <ul className={classes.helpList}>
        <li> <i>Description</i> field is mandatory and amplifier information cannot be saved without filling this field.</li>
        <li> <i>Contributor</i> field is mandatory and amplifier information cannot be saved without filling this field. It is automatically filled with the name of the currently logged used, but you can change it.</li>
        <li> <i>Files table</i> lists all the associated files with the current amplifier item. These might be schematics, layouts, photos or other files. Please, note that only image (i.e. jpeg, png, gif) and pdf (Adobe Acrobat) files can be uploaded. You can add new files, change <i>Type</i>, <i>Display name</i> and the file itself. An already uploaded and saved (i.e. you clicked on Save button) file item cannot be deleted via the application user interface, due to security reasons. There is no limitation in the number of file items that can be associated with an amplifier item. Please, note that the first photo that is uploaded is always used as amplifier card front image. If there's no photo uploaded then the first layout in readable image format is used, instead.</li>
      </ul>
      Upon finalizing the editing process, you must click/tap the <i>Save</i> button and your changes will be saved to the database.
      <br />
      Clicking the <i>Cancel</i> button will <strong>reset</strong> the form contents, clearing all fields!
      <br />
      Renaming amplifier model or version is possible via amplifier item card inline editing. Renaming a brand is not possible via the application's user interface. Plesae, contact an administrator, if you would like to do so.
      <br />
      <br />
      <h4>Create new brand, model or version</h4>
      Adding a new brand or model to the database is rather straight-forward process.
      In order to create any of these, you simply type the new brand, model or version in the respective field. 
      <strong>SchemA</strong> automatically clears the respective fields within the form upon typing the new information.
      <br />
      Then you need to fill description, contributor and file items section.
      <br />
      Upon completion of the process click/tap the <i>Save</i> button to save the information to the database. The new items, i.e. brand or model or version are automatically recognized and saved by the application.
      <br />
      Click/tap the <i>Cancel</i> button to clear the form.
      <br />
      <br />
      <img src={EditAmplifierItem} alt='Edit amplifier item' />
    </div>
  )
}

export const SideNavigation = () => {
  return (
    <div className={cx(classes.container, classes.helpText)}>
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
