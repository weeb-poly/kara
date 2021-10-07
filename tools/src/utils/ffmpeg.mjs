import pathToFfmpeg from "ffmpeg-static";
import execa from "execa";

function timeToSeconds(time) {
	if (!time.match(/\d+:\d{1,2}:\d+\.?\d*/)) {
		throw `The parameter ${time} is in a wrong format '00:00:00.000' .`;
	}

	const a = time.split(':'); // split it at the colons

	if (+a[1] >= 60 || +a[2] >= 60) {
		throw `The parameter ${time} is invalid, please follow the format "Hours:Minutes:Seconds.Milliseconds`;
	}

	a[2] = '' + Math.floor(+a[2]); // Seconds can have miliseconds
	// minutes are worth 60 seconds. Hours are worth 60 minutes.

	return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}

async function getReplayGain(mediafile) {
    const result = await execa(pathToFfmpeg, ['-hide_banner', '-nostats', '-i', mediafile, '-vn', '-af', 'replaygain', '-f', 'null', '-'], { encoding : 'utf8' });

    const outputArray = result.stderr.split(' ');
    const indexTrackGain = outputArray.indexOf('track_gain');
    const indexDuration = outputArray.indexOf('Duration:');

    let audiogain = '0';
    let duration = '0';
    let error = false;

    if (indexTrackGain > -1) {
        const gain = parseFloat(outputArray[indexTrackGain + 2]);
        audiogain = gain.toString();
    } else {
        error = true;
    }

    if (indexDuration > -1) {
        duration = outputArray[indexDuration + 1].replace(',','');
        duration = timeToSeconds(duration).toString();
    } else {
        error = true;
    }

    return {
        duration: +duration,
        gain: +audiogain,
        error: error
    };
}

async function getLoudNorm(mediafile) {
    const resultLoudnorm = await execa(pathToFfmpeg, ['-hide_banner', '-nostats', '-i', mediafile, '-vn', '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], { encoding : 'utf8' });

    const outputArrayLoudnorm = resultLoudnorm.stderr.split('\n');
    const indexLoudnorm = outputArrayLoudnorm.findIndex(s => s.startsWith('[Parsed_loudnorm'));
    const loudnormArr = outputArrayLoudnorm.splice(indexLoudnorm + 1);
    const loudnorm = JSON.parse(loudnormArr.join('\n'));
    const loudnormStr = `${loudnorm.input_i},${loudnorm.input_tp},${loudnorm.input_lra},${loudnorm.input_thresh},${loudnorm.target_offset}`;

    return {
        loudnorm: loudnormStr,
    };
}


export async function getMediaInfo(mediafile) {
    try {
        console.debug('Analyzing %s', mediafile);

        const { duration, gain, error } = await getReplayGain(mediafile);

        // We need a second ffmpeg for loudnorm since you can't have two audio filters at once
        const { loudnorm } = await getLoudNorm(mediafile);

        return {
            duration: duration,
            gain: gain,
            loudnorm: loudnorm,
            error: error,
        };
    } catch (err) {
        console.warn('Video %s probe error', mediafile);
        return { duration: 0, gain: 0, loudnorm: '', error: true };
    }
}
