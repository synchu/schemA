/* @flow*/

export type fileObject = {
	id: number,
	length: number,
	fileName: string,
	fileType: string
}


export type fileStateObject = {
	current: ?number,
	uploading: boolean,
	saved: Array<number>,
	files: Array<fileObject>
}
