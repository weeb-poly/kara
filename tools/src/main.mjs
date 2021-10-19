import { allFilesInDir, readAllJsonFiles } from "./utils/files.mjs";

import { validateFileSchema } from "./services/validator.mjs";
import { postProcessing } from "./services/processor.mjs";
import { buildDataMaps } from "./services/generator.mjs";

import { Kara, Tag } from "./classes/index.mjs"

const TAGS_DIR = new URL('../tags/', import.meta.url);
const KARAS_DIR = new URL('../karaokes/', import.meta.url);

const MEDIA_DIRS = ['../medias/', '../../medias/'].map(x => new URL(x, import.meta.url));
const LYRICS_DIRS = ['../lyrics/'].map(x => new URL(x, import.meta.url));

async function readAllTags() {
    const tagFnames = await allFilesInDir(TAGS_DIR);
    const tagFiles = await readAllJsonFiles(tagFnames);
    const tags = Object.entries(tagFiles).map(([fileName, fileData]) => {
        const tag = new Tag(fileData);
        tag.tagfile = fileName;
        return tag;
    });
    return tags;
}

async function readAllKaras() {
    const karaFnames = await allFilesInDir(KARAS_DIR);
    const karaFiles = await readAllJsonFiles(karaFnames);
    const karas = Object.entries(karaFiles).map(([fileName, fileData]) => {
        const kara = new Kara(fileData);
        kara.karafile = fileName;
        return kara;
    });
    return karas;
}

async function main() {
    console.time("Reading Data Files");

    const tags = await readAllTags();
    const karas = await readAllKaras();

    console.timeEnd("Reading Data Files");

    console.debug('Number of karas found: %d', karas.length);
    console.debug('Number of tags found: %d', tags.length);
    
    console.time("Schema Validation");

    await validateFileSchema(tags, karas);

    console.timeEnd("Schema Validation");

    console.time("Post Processing");

    await postProcessing(tags, karas, MEDIA_DIRS, LYRICS_DIRS);

    console.timeEnd("Post Processing");

    console.time("Building Data Map");

    const dataMap = await buildDataMaps(karas, tags);

    console.timeEnd("Building Data Map");

    //console.debug(dataMap.tags);

    if (dataMap.error) {
        throw "Error in PostProcessing + DataMap Steps";
    }

    console.info("Validation Complete");
}

await main();