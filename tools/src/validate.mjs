import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";

import addCustomFormats from "./formats.mjs";
import addCustomKeywords from "./keywords.mjs";

import { allFilesInDir } from "./utils/files.mjs";

import { schema as tagFileSchema, getDataFromTagFile } from "./dao/tagfile.mjs";
import { schema as karaFileSchema, getDataFromKaraFile } from "./dao/karafile.mjs";

function setupAjv(ajv) {
    addErrors(ajv);
    addFormats(ajv);
    addCustomFormats(ajv);
    addCustomKeywords(ajv);
}

function main() {
    console.info('Starting data files validation');

    const tagFiles = allFilesInDir('../tags/');
    const karaFiles = allFilesInDir('../karaokes/');

    console.debug('Number of karas found: %d', karaFiles.length);
    console.debug('Number of tags found: %d', tagFiles.length);

    const ajv = new Ajv({allErrors: true});
    setupAjv(ajv);

    const karaFileValidator = ajv.compile(karaFileSchema);
    const tagFileValidator = ajv.compile(tagFileSchema);

    for (const filename of tagFiles) {
        getDataFromTagFile(filename, tagFileValidator);
    }

    for (const filename of karaFiles) {
        getDataFromKaraFile(filename, karaFileValidator);
    }

    console.info('Validation complete');
}

main();
