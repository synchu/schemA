/* @flow*/

export type trackObject = {
	songId: string,
	src: string,
	avatar_url: string,
	author: string,
	trackName: string,
    playCount: number
}

export type tracksObject = Array<trackObject>[]

/*
export type fileStateObject = {
	current: ?number,
	uploading: boolean,
	saved: Array<number>,
	files: Array<fileObject>
}*/
