import {DESCRIPTION, SCHEMATIC, LAYOUT, OTHER, PHOTO} from 'utils/constants'

export const transformData = (item) => {
  let itemObjects = []

  let j = 0
  let maxDataId = 0

  item.map((i) => {
    let bFound = false
    let itemObject = {
      model: '',
      version: '',
      description: '',
      contributor: '',
      descriptionDate: new Date(),
      layouts: [],
      schematics: [],
      photos: [],
      others: [],
      brand: '',
      bid: '',
      descriptionId: 0,
      maxDataId: 0,
      versionId: 0
    }

    for (j = 0; j < itemObjects.length; j++) {
      if (itemObjects[j].version === i.version) {
        bFound = true
        break
      }
    }

    if (bFound) {
      itemObject = itemObjects[j]
    } else {
      itemObject.version = i.version
      itemObject.model = i.model
      itemObject.brand = i.brand
      itemObject.bid = i.bid
      itemObject.versionId = i.id
    }

    maxDataId = i.data_id > maxDataId
      ? i.data_id
      : maxDataId

    switch (i.type) {
      case DESCRIPTION:
        itemObject.description = i.data
        itemObject.contributor = i.contributor
        itemObject.descriptionDate = i.datestamp
        itemObject.descriptionId = i.id
        break
      case LAYOUT:
        itemObject
          .layouts
          .push({
            id: itemObject.layouts.length + 1,
            layout: i.data,
            layoutName: i.filename,
            layoutDate: i.datestamp,
            layoutContributor: i.contributor,
            updateId: i.id
          })
          // itemObject.layoutsMaxId = i.id > itemObject.layoutsMaxId ? i.id :
          // itemObject.layoutsMaxId
        break
      case SCHEMATIC:
        itemObject
          .schematics
          .push({
            id: itemObject.schematics.length + 1,
            schematic: i.data,
            schematicName: i.filename,
            schematicDate: i.datestamp,
            schematicContributor: i.contributor,
            updateId: i.id
          })
          // itemObject.schematicsMaxId = i.id > itemObject.schematicsMaxId ? i.id :
          // itemObject.schematicsMaxId
        break
      case PHOTO:
        itemObject
          .photos
          .push({
            id: itemObject.photos.length + 1,
            photo: i.data,
            photoName: i.filename,
            photoDate: i.datestamp,
            photoContributor: i.contributor,
            updateId: i.id
          })
          // itemObject.photosMaxId = i.id > itemObject.photosMaxId ? i.id :
          // itemObject.photosMaxId
        break
      case OTHER:
        itemObject
          .others
          .push({
            id: itemObject.others.length + 1,
            other: i.data,
            otherName: i.filename,
            otherDate: i.datestamp,
            otherContributor: i.contributor,
            updateId: i.id
          })
          // itemObject.othersMaxId = i.id > itemObject.othersMaxId ? i.id :
          // itemObject.othersMaxId
        break
      default:
        break
    }
    if (!bFound) {
      itemObjects.push(itemObject)
    }
  })

  itemObjects.forEach(function (value) {
    value.maxDataId = maxDataId
  })

  return itemObjects
}
