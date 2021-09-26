import { resolveFileInDirs, getFileSize } from "../utils/files.mjs";
import { getMediaInfo } from "../utils/ffmpeg.mjs";

export async function karaPostProcessing(kara, mediaDirs, lyricsDirs, silent = { media: true, lyrics: false }, opt = { strict: true, noMedia: true }) {
    let mediaFile;

    try {
        const mediaFiles = await resolveFileInDirs(kara.mediafile, mediaDirs);
        mediaFile = mediaFiles[0];
        kara.download_status = 'DOWNLOADED';
    } catch (err) {
        if (!silent.media) {
            if (opt.strict) {
                console.error("Media file is missing: %s", media.filename);
                kara.error = true;
            } else {
                console.debug("Media file not found: %s", media.filename);
            }
        }
        kara.download_status = 'MISSING';
    }

    if (kara.subfile !== undefined) {
        try {
            await resolveFileInDirs(kara.subfile, lyricsDirs);
        } catch (err) {
            if (!silent.lyrics) {
                if (opt.strict) {
                    console.error("Lyrics file is missing: %s", kara.subfile);
                    kara.error = true;
                } else {
                    console.debug("Lyrics file not found: %s", kara.subfile);
                }
            }
        }
    }

    if (mediaFile && !opt.noMedia) {
        let mediaSize;
        try {
            mediaSize = await getFileSize(mediaFile);
        } catch (err) {
            if (opt.strict) {
                console.error("Media file could not be read: %s", mediaFile);
                kara.error = true;
            }
        }

        if (mediaSize !== kara.mediasize) {
            if (opt.strict) {
                console.error("Media data is wrong for: %s", mediaFile);
                kara.error = true;
            }

            const mediaInfo = await getMediaInfo(mediaFile);
            if (mediaInfo.error !== true) {
                if (opt.strict) {
                    console.error("ffmpeg encountered an error: %s", mediaFile);
                    kara.error = true;
                }
            } else {
                kara.isKaraModified = true;
                kara.mediasize = mediaSize;
                kara.gain = mediaInfo.gain;
                kara.duration = mediaInfo.duration;
                kara.loudnorm = mediaInfo.loudnorm;
            }
        }
    }
}
