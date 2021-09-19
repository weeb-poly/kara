import { mediaFileRegexp, subFileRegexp } from './constants';

export default function addFormats(ajv) {
    ajv.addFormat("KaraMediaFile", mediaFileRegexp);
    ajv.addFormat("KaraSubFile", subFileRegexp);
};
