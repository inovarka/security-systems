import { saveFileSystem, updateFileSystem} from "../data/fileSystem.js"
import { startTextEditor } from "../commandLine/startTextEditor.js"
import { createNewDir, createNewFile } from "./objectMakers.js"
import chalk from "chalk"


const findDirectoryInFileSystem = (fileSystem, dirUrl) => {
    let newDirUrl = "homeDir\\"
    let arrayOfDirNames = dirUrl.split("\\").slice(0, -2)
    arrayOfDirNames.shift()
    while (arrayOfDirNames.length != 0) {
        let nextDir = arrayOfDirNames.shift()
        newDirUrl += `${nextDir.name}\\`
        fileSystem = fileSystem.find(obj => obj.name === nextDir)
    }
    return [fileSystem, newDirUrl]
}

export const executeCommand = (user, fileSystem, currentDir, currentDirUrl, command, value = "") => new Promise(async(resolve, reject) => {
    switch(command) {
        case "pwd":
            console.log("\nPath:", currentDirUrl, "\n")
            resolve()
            
            break
        case "ls": {
            let filesAndDirs = currentDir.filesAndDirs
            const filteredDirsAndFiles = filesAndDirs.filter(obj => obj.readRights.includes(user))
            for(let obj of filteredDirsAndFiles) {
                if (obj.type === "directory"){
                    console.log(chalk.red(obj.name)) 
                } else {
                 console.log(chalk.yellow(obj.name))
                }
            }
        }
        resolve()
        break
        case "cd": {
            if (value === "..") {
                resolve(findDirectoryInFileSystem(fileSystem, currentDirUrl))       
            } else {
                let filesAndDirs = currentDir.filesAndDirs
                let directory = filesAndDirs.find(obj => obj.name === value) 
                if(directory !== undefined) {
                    resolve([directory, currentDirUrl + `${directory.name}\\`])
                } else {
                    console.log("The directory does not exit")
                    resolve([currentDir, currentDirUrl])
                }
            }
            break
        }
        case "mkdir": {
            if(currentDir.writeRights.includes(user)) {
                const filesAndDirs = currentDir.filesAndDirs
                const oldDirsAndFiles = currentDir.filesAndDirs
                const newDir = createNewDir(value, user)
                filesAndDirs.push(newDir)
                currentDir.filesAndDirs = filesAndDirs
                // fileSystem = updateFileSystem(fileSystem, oldDirsAndFiles, filesAndDirs)
                saveFileSystem(fileSystem)
            } else {
                console.log(`You don't have rights to edit this directory`)
            }
            resolve([fileSystem, currentDir])
            break
        }
        case "vi": {
            if(currentDir.writeRights.includes(user)) {
                const filesAndDirs = currentDir.filesAndDirs
                const oldDirsAndFiles = currentDir.filesAndDirs
                let getFile, index 
                getFile = filesAndDirs.find((obj, i) => {
                    if (obj.name === value) {
                        index = i
                        return obj
                    }
                })
                let text = (getFile === undefined ? "" : getFile.content)
                text = await startTextEditor(text)
                const newFile = createNewFile(value, text, user)
                if (index !== undefined) {
                    filesAndDirs[index] = newDir
                } else {
                    filesAndDirs.push(newDir)
                }
                currentDir.filesAndDirs = filesAndDirs
                // fileSystem = updateFileSystem(fileSystem, oldDirsAndFiles, filesAndDirs)
                saveFileSystem(fileSystem)
            } else {
                console.log(`You don't have rights to edit this directory`)
            }
            resolve([fileSystem, currentDir])
            break
        }
        case "rm": {
            if(currentDir.writeRights.includes(user)) {
                const filesAndDirs = currentDir.filesAndDirs
                const oldDirsAndFiles = currentDir.filesAndDirs
                const filteredArray = filesAndDirs.filter(obj => obj.name !== value)
                currentDir.filesAndDirs = filteredArray
                // fileSystem = updateFileSystem(fileSystem, oldDirsAndFiles, filesAndDirs)
                saveFileSystem(fileSystem)
            } else {
                console.log(`You don't have rights to edit this directory`)
            }
            resolve([fileSystem, currentDir])
            break
        }
        case "q": {
            saveFileSystem(fileSystem)
            break
        }
        default:

            console.log(`Incorrect command: ${command}`)
            resolve()

            break
    }
})