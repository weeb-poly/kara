import { getTagFileData } from "../dao/tagfile.mjs";
import { getKaraFileData } from "../dao/karafile.mjs";

export function buildDataMaps(karas, tags) {
	let error;

    const tagMap = new Map(
        tags.map(t => [ t.tid, new Map() ])
    );

	const disabledKaras = [];
	for (const kara of karas) {
		for (const [tagType, tagValue] of Object.entries(kara.tags)) {
			if (tagValue.length > 0) {
				for (const tag of tagValue)	 {
					const tagData = tagMap.get(tag.tid);
					if (tagData !== undefined) {
						tagData.set(kara.kid, tagType);
						tagMap.set(tag.tid, tagData);
					} else {
						kara.error = true;
						disabledKaras.push(kara.kid);
						tags = tags.filter(t => t.tid !== tag.tid);
						tagMap.delete(tag.tid);
						console.error('Tag %s was not found in your tag.json files (Kara file "%s" will not be used for generation)', tag.tid, kara.karafile);
					}
				}
			}
		}
	}

    if (karas.some(kara => kara.error))
		error = true;

	karas = karas.filter(kara => !kara.error);

	// Also remove disabled karaokes from the tagMap.
	// Checking through all tags to identify the songs we removed because one of their other tags was missing.
	// @Aeden's lucky that this only takes about 36ms for one missing tag on an old laptop or else I'd have deleted that code already.
	for (const kid of disabledKaras) {
		for (const [tag, karas] of tagMap) {
			const newKaras = karas.filter(k => k[0] !== kid);
			if (newKaras.length !== karas.length)
				tagMap.set(tag, newKaras);
		}
	}

	return {
		tags: tagMap,
		tagData: tags,
		karas: karas
	};
}

export async function getFileData(tagFiles, karaFiles, mediaDirs, lyricsDirs) {
    const tags = await Promise.all(
        Object.entries(tagFiles).map(entry => getTagFileData(entry))
    );

    const karas = await Promise.all(
        Object.entries(karaFiles).map(entry => getKaraFileData(entry, mediaDirs, lyricsDirs))
    );

	return [tags, karas];
}
