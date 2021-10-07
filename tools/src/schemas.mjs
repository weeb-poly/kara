import fs from "fs";

const schemaDir = new URL('../schema/', import.meta.url);

export function getSchema(fname) {
    const schemaPath = new URL(fname, schemaDir);
    const schemaFileData = fs.readFileSync(schemaPath);
    return JSON.parse(schemaFileData);
}