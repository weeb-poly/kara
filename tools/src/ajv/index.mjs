import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";

import addCustomFormats from "./formats.mjs";
import addCustomKeywords from "./keywords.mjs";

const ajv = new Ajv({ allErrors: true });

addErrors(ajv);
addFormats(ajv);
addCustomFormats(ajv);
addCustomKeywords(ajv);

export { ajv };