const fs = require('fs');
const path = require('path');

const schemaDir = path.resolve(__dirname, '../../schema/');

function getSchema(fname) {
    const schemaFileData = fs.readFileSync(path.resolve(schemaDir, fname));
    return JSON.parse(schemaFileData);
}

module.exports.getSchema = getSchema;