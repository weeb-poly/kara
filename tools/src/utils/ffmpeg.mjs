export async function getMediaInfo(mediafile) {
    try {
        logger.debug(`Analyzing ${mediafile}`, {service: 'ffmpeg'});
        // We need a second ffmpeg for loudnorm since you can't have two audio filters at once
        const [result, resultLoudnorm] = await Promise.all([
            execa(getState().binPath.ffmpeg, ['-i', mediafile, '-vn', '-af', 'replaygain', '-f','null', '-'], { encoding : 'utf8' }),
            execa(getState().binPath.ffmpeg, ['-i', mediafile, '-vn', '-af', 'loudnorm=print_format=json', '-f','null', '-'], { encoding : 'utf8' })
        ]);
        const outputArray = result.stderr.split(' ');
        const outputArrayLoudnorm = resultLoudnorm.stderr.split('\n');
        const indexTrackGain = outputArray.indexOf('track_gain');
        const indexDuration = outputArray.indexOf('Duration:');
        const indexLoudnorm = outputArrayLoudnorm.findIndex(s => s.startsWith('[Parsed_loudnorm'));
        const loudnormArr = outputArrayLoudnorm.splice(indexLoudnorm + 1);
        const loudnorm = JSON.parse(loudnormArr.join('\n'));
        const loudnormStr = `${loudnorm.input_i},${loudnorm.input_tp},${loudnorm.input_lra},${loudnorm.input_thresh},${loudnorm.target_offset}`;
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
            loudnorm: loudnormStr,
            error: error,
            filename: mediafile
        };
    } catch(err) {
        logger.warn(`Video ${mediafile} probe error`, {service: 'ffmpeg', obj: err});
        return { duration: 0, gain: 0, loudnorm: '', error: true, filename: mediafile };
    }
}
