import { mediaFileRegexp, subFileRegexp } from "./constants.mjs";

export default function addFormats(ajv) {
    ajv.addFormat("KaraMediaFile", mediaFileRegexp);
    ajv.addFormat("KaraSubFile", subFileRegexp);
};
