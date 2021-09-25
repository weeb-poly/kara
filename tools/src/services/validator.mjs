import { validateTagFileSchema } from "../dao/tagfile.mjs";
import { validateKaraFileSchema } from "../dao/karafile.mjs";

export async function validateFileSchema(tagFiles, karaFiles) {
    await Promise.all(
        Object.entries(tagFiles).map(entry => validateTagFileSchema(entry))
    );

    await Promise.all(
        Object.entries(karaFiles).map(entry => validateKaraFileSchema(entry))
    );
}
