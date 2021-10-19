import path from "path";

export async function tagPostProcessing(tag) {
    tag.tagfile = path.basename(tag.tagfile);

    /*
    let types = tag.raw.tag.types.filter((t) => t !== undefined);
    if (types.length === 0)
    console.warn("Tag %s has no types!", fileName);
    tag.raw.tag.types = types;
    */

    if (!tag.repository) {
        tag.repository = 'kara.moe';
    }
    if (!tag.modified_at) {
        tag.modified_at = '1982-04-06';
    }
}