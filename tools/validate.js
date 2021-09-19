import fs from "fs";

import Ajv from "ajv";
import addFormats from "ajv-formats";

import addCustomFormats from "./formats";

const ajv = new Ajv();
addFormats(ajv);
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

// TODO: Loop through dirs and get all tag and karaoke filepaths
