import { ajv } from "../ajv/index.mjs";
import { getSchema } from "../utils/schemas.js";

const schema = getSchema('tagfile.json');

//const validator = ajv.compile(schema);
const validator = ajv.compile(Object.assign({ "$async": true }, schema));

export default class Tag {
    error = false;
    isModified = false;
    tagfile = '';

    static schema = schema;
    static validator = validator;

    constructor(raw) {
        this.raw = raw;
    }

    async validateSchema() {
        try {
            await Tag.validator(this.raw);
        } catch (e) {
            throw `Tag data is not valid for ${this.tagfile} : ${JSON.stringify(e.errors)}`;
        }
    }

    get types() {
        return this.raw.tag.types;
    }

    get name() {
        return this.raw.tag.name;
    }

    get tid() {
        return this.raw.tag.tid;
    }

    get aliases() {
        return this.raw.tag.aliases;
    }

    get short() {
        return this.raw.tag.short;
    }

    get problematic() {
        return this.raw.tag.problematic;
    }

    get priority() {
        return this.raw.tag.priority;
    }

    get noLiveDownload() {
        return this.raw.tag.noLiveDownload;
    }

    get i18n() {
        return this.raw.tag.i18n;
    }

    get karacount() {
        return this.raw.tag.karacount;
    }

    get karaType() {
        return this.raw.tag.karaType;
    }

    get repository() {
        return this.raw.tag.repository;
    }
    set repository(repo) {
        this.raw.tag.repository = repo;
        this.isModified = true;
    }

    get modified_at() {
        if (this.raw.tag.modified_at) {
            return new Date(this.raw.tag.modified_at);
        } else {
            return undefined;
        }
    }
    set modified_at(date) {
        if (date instanceof Date) {
            this.raw.tag.modified_at = date;
        } else if (date instanceof String || typeof(date) === 'string') {
            this.raw.tag.modified_at = new Date(date);
        } else {
            throw new TypeError("Invalid type for modified_at");
        }
        this.isModified = true;
    }

    get count() {
        return this.raw.tag.count;
    }

    get karafile_tag() {
        return this.raw.tag.karafile_tag;
    }
}