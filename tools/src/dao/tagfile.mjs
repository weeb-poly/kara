import fs from "fs";
import path from "path";

import { ajv } from "../ajv/index.mjs";

const schemaFileData = fs.readFileSync('./schema/tagfile.json');
const schemaData = JSON.parse(schemaFileData);

const validator = ajv.compile(schemaData);

export { validator };

export async function validateTagFileSchema([fileName, fileData]) {
    try {
        await validator(fileData);
    } catch (e) {
        throw `Tag data is not valid for ${fileName} : ${JSON.stringify(e.errors)}`;
    }
}

export async function getTagFileData([fileName, tagData]) {
	fileName = path.basename(fileName);
    tagData.tag.tagfile = fileName;
	tagData.tag.types = tagData.tag.types.filter((t) => t !== undefined);
	if (tagData.tag.types.length === 0)
        console.warn("Tag %s has no types!", fileName);
	if (!tagData.tag.repository)
        tagData.tag.repository = 'kara.moe';
	if (!tagData.tag.modified_at)
        tagData.tag.modified_at = '1982-04-06';
	return tagData.tag;
}