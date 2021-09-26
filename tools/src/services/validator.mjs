export async function validateFileSchema(tags, karas) {
    await Promise.all(
        tags.map(tag => tag.validateSchema())
    );

    await Promise.all(
        karas.map(kara => kara.validateSchema())
    );
}
