/*
 * Constants for KM (tags, langs, types, etc.).
 */

export const supportedFiles = {
	video: [
		'avi',
		'mkv',
		'mp4',
		'webm',
		'mov',
		'wmv',
		'mpg',
		'm2ts',
		'rmvb',
		'ts',
		'm4v'
	],
	audio: [
		'ogg',
		'm4a',
		'mp3',
		'wav',
		'flac',
		'mid'
	],
	lyrics: [
		'ass',
		'srt',
		'kar',
		'txt',
		'kfn',
		'lrc'
	],
	image: [
		'jpg',
		'jpeg',
		'png',
		'gif'
	]
};

/** Regexps for validation. */
export const mediaFileRegexp = `^.+\\.(${supportedFiles.video.concat(supportedFiles.audio).join('|')})$`;
export const imageFileRegexp = `^.+\\.(${supportedFiles.image.join('|')})$`;
export const subFileRegexp = `^.+\\.(${supportedFiles.lyrics.join('|')})$`;
export const audioFileRegexp = `^.+\\.(${supportedFiles.audio.join('|')})$`;
export const asciiRegexp = /^[\u0000-\u007F]+$/u;
export const imageFileTypes = supportedFiles.image;