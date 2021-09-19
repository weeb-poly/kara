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
	]
};

/** Regexps for validation. */
export const uuidRegexp = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
export const uuidPlusTypeRegexp = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}~[0-9]+$';
export const md5Regexp = '^[a-f0-9]{32}$';
export const mediaFileRegexp = `^.+\\.(${supportedFiles.video.concat(supportedFiles.audio).join('|')})$`;
export const imageFileRegexp = '^.+\\.(jpg|jpeg|png|gif)$';
export const subFileRegexp = `^.+\\.(${supportedFiles.lyrics.join('|')})$`;
export const audioFileRegexp = `^.+\\.(${supportedFiles.audio.join('|')})$`;
export const hostnameRegexp = /^[a-zA-Z0-9-.]+\.[a-zA-Z0-9-]+$/;
export const asciiRegexp = /^[\u0000-\u007F]+$/u;
export const imageFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
