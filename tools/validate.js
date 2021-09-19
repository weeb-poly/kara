import fs from "fs";
import path from "path";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import addSemver from "ajv-semver";

import addCustomFormats from "./formats";

const ajv = new Ajv();
addFormats(ajv);
addSemver(ajv);
addCustomFormats(ajv);

function readJsonFile(filename) {
    let rawdata = fs.readFileSync(filename);
    let data = JSON.parse(rawdata);
    return data;
}

const karaFileSchema = readJsonFile('./schema/karafile.json');
const tagFileSchema = readJsonFile('./schema/karafile.json');

const karaFileValidator = ajv.compile(karaFileSchema);
const tagFileValidator = ajv.compile(tagFileSchema);

function allFilesInDir(dir) {
    let files = fs.readdirSync(dir);
  
    files = files.map(file => path.join(dir, file));
    files = files.filter(file => {
        const stat = fs.statSync(file);
        return stat.isFile();
    });
    
    return files;
}

const tagFiles = allFilesInDir('../tags/');
const karaFiles = allFilesInDir('../karaokes/');

function validateType(schemaValidator, files) {
    for (const file of files) {
        let rawdata = fs.readFileSync(filename);
        let data = JSON.parse(rawdata);
        let res = schemaValidator(data);
        if (!res) {
            console.error('Validation error:', file, schemaValidator.error);
            return false
        }
    }

    return true;
}

validateType(tagFileValidator, tagFiles);
validateType(karaFileValidator, karaFiles);
