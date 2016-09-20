export type LayoutObject = {
    layout: string,
    layoutName: string,
    layoutDate: Date,
    layoutContributor: string
}
export type SchematicObject = {
    schematic: string,
    schematicName: string,
    schematicDate: Date,
    schematicContributor: string
}
export type PhotoObject = {
    photo: string,
    photoName: string,
    photoDate: Date,
    photoContributor: string
}
export type ItemObject = {
    version: string,
    description: string,
    contributor: string,
    descriptionDate: Date,
    layouts: Array<LayoutObject>,
    schematics: Array<SchematicObject>,
    photos: Array<PhotoObject>
}

export type ItemObjects = Array<ItemObject>
