import fs from "fs";
import { fileURLToPath } from 'url';

const asyncFilter = async (arr, predicate) => Promise.all(arr.map(predicate))
    .then((results) => arr.filter((_v, index) => results[index]));

async function asyncExists(file, write = false) {
    return await fs.promises.access(file, write ? fs.constants.W_OK : fs.constants.F_OK)
    .then(() => true, () => false);
}

export async function allFilesInDir(dirUrl) {
    let files = await fs.promises.readdir(dirUrl);
  
    files = files.map(file => new Url(file, dirUrl));
    files = asyncFilter(files, async (file) => {
        const stat = await fs.promises.stat(file);
        return stat.isFile();
    });

    files = files.map(file => fileURLToPath(file));

    return files;
}

export async function getFileSize(mediaFile) {
    return await fs.promises.stat(mediaFile).then(res => res.size);
}

export async function resolveFileInDirs(filename, dirUrls) {
    let filesFound = await Promise.all(
        dirUrls.map(async dirUrl => {
            const fileUrl = new Url(filename, dirUrl);
            return asyncExists(fileUrl).then(exists => {
                if (exists) {
                    return fileUrl;
                } else {
                    return null;
                }
            });
        })
    );

    filesFound = filesFound.filter(resolved => resolved !== null);

    if (filesFound.length === 0)
        throw Error(`File "${filename}" not found in any listed directory: ${dirs.join(', ')}`);

    filesFound = filesFound.map(file => fileURLToPath(file));

    return filesFound;
}

export async function readAllJsonFiles(fileNames) {
    const fileEntries = await Promise.all(
        fileNames.map(async (filename) => {
            try {
                const fileData = await fs.promises.readFile(filename, 'utf-8').then(file => JSON.parse(file));
                return [filename, fileData];
            } catch {
                throw `Syntax error in file ${filename}`;
            }
        })
    );

    return Object.fromEntries(fileEntries);
}