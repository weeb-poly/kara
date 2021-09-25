import fs from "fs";

import { ajv } from "../ajv/index.mjs";

import { resolveFileInDirs } from "../utils/files.mjs";

const schemaFileData = fs.readFileSync('./schema/karafile.json');
const schemaData = JSON.parse(schemaFileData);

const validator = ajv.compile(schemaData);

export { validator };

export async function validateKaraFileSchema([fileName, fileData]) {
    try {
        await validator(fileData);
    } catch (e) {
        throw `Kara data is not valid for ${fileName} : ${JSON.stringify(e.errors)}`;
    }
}

export async function getKaraFileData([karafile, kara], mediaDirs, lyricsDirs, silent = { media: true, lyrics: false }, opt = { strict: true, noMedia: true }) {
	let error = false;
	let isKaraModified = false;
	let mediaFile;
	let downloadStatus;

    const media = kara.medias[0];
	const lyrics = kara.medias[0].lyrics[0];

    try {
		const mediaFiles = await resolveFileInDirs(media.filename, mediaDirs);
		mediaFile = mediaFiles[0];
		downloadStatus = 'DOWNLOADED';
	} catch (err) {
		if (!silent.media) {
            if (opt.strict) {
                console.error("Media file is missing: %s", media.filename);
                error = true;
            } else {
                console.debug("Media file not found: %s", media.filename);
            }
        }
		downloadStatus = 'MISSING';
	}
	let lyricsFile = null;
	try {
		if (lyrics) {
			lyricsFile = lyrics.filename;
			await resolveFileInDirs(lyrics.filename, lyricsDirs);
		}
	} catch (err) {
		if (!silent.lyrics) {
            if (opt.strict) {
                console.error("Lyrics file is missing: %s", lyricsFile);
                error = true;
            } else {
                console.debug("Lyrics file not found: %s", lyricsFile);
            }
        }
	}

	if (mediaFile && !opt.noMedia) {
		const mediaInfo = await extractMediaTechInfos(mediaFile, media.filesize);
		if (mediaInfo.error) {
			if (opt.strict && mediaInfo.size !== null) {
				console.error("Media data is wrong for: %s", mediaFile);
				error = true;
			}
			if (opt.strict && mediaInfo.size === null) {
				console.error("Media file could not be read by ffmpeg: %s", mediaFile);
				error = true;
			}
		} else if (mediaInfo.size) {
			if (opt.strict) {
				console.error("Media data is wrong for: %s", mediaFile);
				error = true;
			}
			isKaraModified = true;
			kara.medias[0].filesize = mediaInfo.size;
			kara.medias[0].audiogain = mediaInfo.gain;
			kara.medias[0].duration = mediaInfo.duration;
			kara.medias[0].loudnorm = mediaInfo.loudnorm;
		}
	}

	return {
		kid: kara.data.kid,
		karafile: karafile,
		mediafile: kara.medias[0].filename,
		gain: kara.medias[0].audiogain,
		loudnorm: kara.medias[0].loudnorm,
		duration: kara.medias[0].duration,
		mediasize: kara.medias[0].filesize,
		subfile: lyricsFile,
		titles: kara.data.titles,
		comment: kara.data.comment,
		modified_at: new Date(kara.data.modified_at),
		created_at: new Date(kara.data.created_at),
		error: error,
		isKaraModified: isKaraModified,
		year: kara.data.year,
		songorder: kara.data.songorder,
        tags: {
            misc: (kara.data.tags.misc || []).map(t => ({tid: t})),
            songtypes: (kara.data.tags.songtypes || []).map(t => ({tid: t})),
            singers: (kara.data.tags.singers || []).map(t => ({tid: t})),
            songwriters: (kara.data.tags.songwriters || []).map(t => ({tid: t})),
            creators: (kara.data.tags.creators || []).map(t => ({tid: t})),
            groups: (kara.data.tags.groups || []).map(t => ({tid: t})),
            authors: (kara.data.tags.authors || []).map(t => ({tid: t})),
            langs: (kara.data.tags.langs || []).map(t => ({tid: t})),
            families: (kara.data.tags.families || []).map(t => ({tid: t})),
            genres: (kara.data.tags.genres || []).map(t => ({tid: t})),
            origins: (kara.data.tags.origins || []).map(t => ({tid: t})),
            series: (kara.data.tags.series || []).map(t => ({tid: t})),
            platforms: (kara.data.tags.platforms || []).map(t => ({tid: t})),
            versions: (kara.data.tags.versions || []).map(t => ({tid: t}))
        },
		repository: kara.data.repository,
		download_status: downloadStatus,
		ignoreHooks: kara.data.ignoreHooks
	};
}
