import fs from "fs";

const schemaFileData = fs.readFileSync('./schema/tagfile.json');
const schemaData = JSON.parse(schemaFileData);

export { schemaData as schema };

export function getDataFromTagFile(filename, validator) {
    const tagFileData = fs.readFileSync(filename, 'utf-8');
    let tagData;
    try {
        tagData = JSON.parse(tagFileData);
    } catch {
        throw `Syntax error in file ${filename}`;
    }
    const isValid = validator(tagData);
    if (!isValid) {
        throw `Tag data is not valid for ${filename} : ${JSON.stringify(validator.errors)}`;
    }

    // TODO: Extra DAO Steps

    return tagData.tag;
}