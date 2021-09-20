import fs from "fs";
import path from "path";

export function allFilesInDir(dir) {
    let files = fs.readdirSync(dir);
  
    files = files.map(file => path.join(dir, file));
    files = files.filter(file => {
        const stat = fs.statSync(file);
        return stat.isFile();
    });
    
    return files;
}