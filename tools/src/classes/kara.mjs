import { ajv } from "../ajv/index.mjs";
import { getSchema } from "../utils/schemas.js";

const schema = getSchema('karafile.json');

//const validator = ajv.compile(schema);
const validator = ajv.compile(Object.assign({ "$async": true }, schema));

export default class Kara {
    error = false;
    isKaraModified = false;
    karafile = '';
    download_status;

    static schema = schema;
    static validator = validator;

    constructor(raw) {
        this.raw = raw;
    }

    async validateSchema() {
        try {
            await Kara.validator(this.raw);
        } catch (e) {
            throw `Kara data is not valid for ${this.karafile} : ${JSON.stringify(e.errors)}`;
        }
    }

    get kid() {
        return this.raw.data.kid;
    }

    get mediafile() {
        return this.raw.medias[0].filename;
    }

    get gain() {
        return this.raw.medias[0].audiogain;
    }

    set gain(audiogain) {
        this.raw.medias[0].audiogain = audiogain;
        this.isKaraModified = true;
    }

    get loudnorm() {
        return this.raw.medias[0].loudnorm;
    }

    set loudnorm(lnorm) {
        this.raw.medias[0].loudnorm = lnorm;
        this.isKaraModified = true;
    }

    get duration() {
        return this.raw.medias[0].duration;
    }

    set duration(dur) {
        this.raw.medias[0].duration = dur;
        this.isKaraModified = true;
    }

    get mediasize() {
        return this.raw.medias[0].filesize;
    }

    set mediasize(msize) {
        this.raw.medias[0].filesize = msize;
        this.isKaraModified = true;
    }

    get mediafile() {
        return this.raw.medias[0].filename;
    }

    get subfile() {
        const lyrics = this.raw.medias[0].lyrics[0];

        if (lyrics !== undefined) {
            return lyrics.filename;
        } else {
            return undefined;
        }
    }

    get titles() {
        return this.raw.data.titles;
    }

    get comment() {
        return this.raw.data.comment;
    }

    get modified_at() {
        return new Date(this.raw.data.modified_at);
    }
    set modified_at(date) {
        if (date instanceof Date) {
            this.raw.data.modified_at = date.toISOString();
        } else if (date instanceof String || typeof(date) === 'string') {
            this.raw.data.modified_at = date;
        } else {
            throw new TypeError("Invalid type for modified_at");
        }
        this.isModified = true;
    }

    get created_at() {
        return new Date(this.raw.data.created_at);
    }

    get year() {
        return this.raw.data.year;
    }

    get songorder() {
        return this.raw.data.songorder;
    }

    getTagType(type) {
        return (this.raw.data.tags[type] || []).map(t => ({tid: t}));
    }

    get misc() {
        return this.getTagType('misc');
    }
    get songtypes() {
        return this.getTagType('songtypes');
    }
    get singers() {
        return this.getTagType('singers');
    }
    get songwriters() {
        return this.getTagType('songwriters');
    }
    get creators() {
        return this.getTagType('creators');
    }
    get groups() {
        return this.getTagType('groups');
    }
    get authors() {
        return this.getTagType('authors');
    }
    get langs() {
        return this.getTagType('langs');
    }
    get families() {
        return this.getTagType('families');
    }
    get genres() {
        return this.getTagType('genres');
    }
    get origins() {
        return this.getTagType('origins');
    }
    get series() {
        return this.getTagType('series');
    }
    get platforms() {
        return this.getTagType('platforms');
    }
    get versions() {
        return this.getTagType('versions');
    }

    get tags() {
        return {
            misc: this.misc,
            songtypes: this.songtypes,
            singers: this.singers,
            songwriters: this.songwriters,
            creators: this.creators,
            groups: this.groups,
            authors: this.authors,
            langs: this.langs,
            families: this.families,
            genres: this.genres,
            origins: this.origins,
            series: this.series,
            platforms: this.platforms,
            versions: this.versions
        }
    }

    get repository() {
        return this.raw.data.repository;
    }

    get ignoreHooks() {
        return this.raw.data.ignoreHooks;
    }
}
