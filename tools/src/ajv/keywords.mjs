import semver from "semver";

export default function addKeywords(ajv) {
    ajv.addKeyword({
        keyword: "semver",
        validate: (schema, data) => {
            let semverData = semver.coerce(data);
            if (schema.hasOwnProperty('satisfies')) {
                return semver.satisfies(semverData, schema['satisfies']);
            }
            return true;
        }
    });
};