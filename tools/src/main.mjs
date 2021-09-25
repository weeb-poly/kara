import { allFilesInDir, readAllJsonFiles } from "./utils/files.mjs";

import { validateFileSchema } from "./services/validator.mjs";
import { getFileData, buildDataMaps } from "./services/generator.mjs";


async function main() {
    console.info('Reading data files');

    const tagFnames = await allFilesInDir('../tags/');
    const karaFnames = await allFilesInDir('../karaokes/');

    console.debug('Number of karas found: %d', karaFnames.length);
    console.debug('Number of tags found: %d', tagFnames.length);

    const tagFiles = await readAllJsonFiles(tagFnames);
    const karaFiles = await readAllJsonFiles(karaFnames);
    
    console.info('Starting data files validation');

    await validateFileSchema(tagFiles, karaFiles);

    console.info('Schema Validation complete');

    //const mediaDirs = ['../../medias/'];
    const mediaDirs = [];
    const lyricsDirs = ['../lyrics/'];

    console.info('Reading File Data');

    const [tags, karas] = await getFileData(tagFiles, karaFiles, mediaDirs, lyricsDirs);

    console.info('Building Data Map');

    const dataMap = await buildDataMaps(karas, tags);

    //console.debug(dataMap.tags);

    console.info('Validation Complete');
}

await main();