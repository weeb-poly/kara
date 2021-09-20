import fs from "fs";

const schemaFileData = fs.readFileSync('./schema/karafile.json');
const schemaData = JSON.parse(schemaFileData);

export { schemaData as schema };

export function getDataFromKaraFile(filename, validator) {
    const karaFileData = fs.readFileSync(filename, 'utf-8');
    let karaData;
    try {
        karaData = JSON.parse(karaFileData);
    } catch {
        throw `Syntax error in file ${filename}`;
    }
    const isValid = validator(karaData);
    if (!isValid) {
        throw `Kara data is not valid for ${filename} : ${JSON.stringify(validator.errors)}`;
    }

    // TODO: Extra DAO Steps

    return karaData;
}
