import fs from "fs";
import path from "path";

import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addCustomFormats from "./formats.mjs";
import addCustomKeywords from "./keywords.mjs";

function setupAjv(ajv) {
    addErrors(ajv);
    addFormats(ajv);
    addCustomFormats(ajv);
    addCustomKeywords(ajv);
}

function readJsonFile(filename) {
    let rawdata = fs.readFileSync(filename);
    let data = JSON.parse(rawdata);
    return data;
}

function allFilesInDir(dir) {
    let files = fs.readdirSync(dir);
  
    files = files.map(file => path.join(dir, file));
    files = files.filter(file => {
        const stat = fs.statSync(file);
        return stat.isFile();
    });
    
    return files;
}

function validateType(validator, files) {
    for (const filename of files) {
        let rawdata = fs.readFileSync(filename);
        let data = JSON.parse(rawdata);
        let res = validator(data);
        if (!res) {
            console.error('Validation error:', filename, validator.errors);
        }
    }
}

function main() {
    const ajv = new Ajv({allErrors: true});
    setupAjv(ajv);

    const karaFileSchema = readJsonFile('./schema/karafile.json');
    const tagFileSchema = readJsonFile('./schema/tagfile.json');

    const karaFileValidator = ajv.compile(karaFileSchema);
    const tagFileValidator = ajv.compile(tagFileSchema);

    const tagFiles = allFilesInDir('../tags/');
    const karaFiles = allFilesInDir('../karaokes/');

    validateType(tagFileValidator, tagFiles);
    validateType(karaFileValidator, karaFiles);
}

main();
