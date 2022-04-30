import {readFileSync, writeFileSync} from 'fs'
import { createRequire } from "module";
export const require = createRequire(import.meta.url);


export const createFileSystem = () => {
    const fileSystemData = require("./fileSystem.json")

    writeFileSync("EncodedData:S", JSON.stringify(fileSystemData))
}

export const loadFileSystem = () => {
    const file = readFileSync("EncodedData:S")
    const json = JSON.parse(file)
    return json
}

export const saveFileSystem = (json) => {
    const jsonString = JSON.stringify(json, null, 2) 
    writeFileSync("./data/fileSystem.json", jsonString)
    writeFileSync("EncodedData:S", jsonString)
}

export const updateFileSystem = (json, oldDir, newDir) => {
    const jsonString = JSON.stringify(json, null, 2);
    const oldDirString = JSON.stringify(oldDir, null, 2)
    const newDirString = JSON.stringify(newDir, null, 2)
    const newJson = jsonString.replace(oldDirString, newDirString)

    return JSON.parse(newJson)
}