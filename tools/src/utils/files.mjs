import fs from "fs";
import path from "path";

const asyncFilter = async (arr, predicate) => Promise.all(arr.map(predicate))
	.then((results) => arr.filter((_v, index) => results[index]));

async function asyncExists(file, write = false) {
    return await fs.promises.access(file, write ? fs.constants.W_OK : fs.constants.F_OK)
    .then(() => true, () => false);
}

export async function allFilesInDir(dir) {
    let files = await fs.promises.readdir(dir);
  
    files = files.map(file => path.join(dir, file));
    files = asyncFilter(files, async (file) => {
        const stat = await fs.promises.stat(file);
        return stat.isFile();
    });

    return files;
}

export async function resolveFileInDirs(filename, dirs) {
	let filesFound = await Promise.all(
        dirs.map(async dir => {
            const resolved = path.resolve(dir, filename);
            return asyncExists(resolved);
        })
    );

    filesFound = filesFound.filter(exists => exists === true);

    if (filesFound.length === 0)
        throw Error(`File "${filename}" not found in any listed directory: ${dirs.join(', ')}`);

	return filesFound;
}

export async function readAllJsonFiles(fileNames) {
    const fileEntries = await Promise.all(
        fileNames.map(async (filename) => {
            const fileData = await fs.promises.readFile(filename, 'utf-8');
            try {
                return [filename, JSON.parse(fileData)];
            } catch {
                throw `Syntax error in file ${filename}`;
            }
        })
    );

    return Object.fromEntries(fileEntries);
}