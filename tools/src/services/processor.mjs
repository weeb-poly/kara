import { tagPostProcessing } from "../dao/tagfile.mjs";
import { karaPostProcessing } from "../dao/karafile.mjs";

export async function postProcessing(tags, karas, mediaDirs, lyricsDirs) {
    await Promise.all(
        tags.map(entry => tagPostProcessing(entry))
    );

    await Promise.all(
        karas.map(entry => karaPostProcessing(entry, mediaDirs, lyricsDirs))
    );
}
