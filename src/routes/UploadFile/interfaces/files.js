/* @flow*/

import {DESCRIPTION, SCHEMATIC, LAYOUT, OTHER, PHOTO} from 'utils/constants'

export type fileObject = {
	id: number,
	length: number,
	fileName: string,
	fileType: string
}


export type fileStateObject = {
	current: ?number,
		uploading: boolean,
			saved: Array < number >,
				files: Array<fileObject>
}

const types = {
	description: DESCRIPTION,
	photo: PHOTO,
	schematic: SCHEMATIC,
	layout: LAYOUT,
	other: OTHER
}
export type emptyAmpItem = {
	id: ?number,
		data_id: ?number,
			brand: string,
				model: string,
					version: string,
						type: types,
							data: string,
								contributor: string,
									date: Date,
										isfile: boolean,
											filename: string
}
