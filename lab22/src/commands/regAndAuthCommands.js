import { createNewUser } from "./objectMakers.js"
import { updateFileSystem, saveFileSystem } from "../data/fileSystem.js"

const randomlyGetQuestions = (fileSystem) => {
    const controlQuestions = fileSystem.filesAndDirs.find(obj => obj.name == "ask.txt").content
    console.log(controlQuestions.length)
    const arrayOfQuestions = []
    while (arrayOfQuestions.length != 3) {
        const indexOfQuestion = Math.floor(Math.random()*controlQuestions.length)
        if(!arrayOfQuestions.includes(indexOfQuestion)) arrayOfQuestions.push(indexOfQuestion)
    }
    return arrayOfQuestions
}

export const regAndAuthCommands = (fileSystem, command, userName, password) => new Promise ((resolve, reject) =>{
    switch(command){
        case "reguser":{
            const logBook = fileSystem.filesAndDirs.find(obj => obj.name == "logBook")
            if (logBook.content.length < 8) {
                logBook.content.push(createNewUser(userName, password, randomlyGetQuestions(fileSystem)))
                fileSystem.readRights.push(userName)
                fileSystem.writeRights.push(userName)
                fileSystem.filesAndDirs.find(disk => disk.name === "C").readRights.push(userName)
                fileSystem.filesAndDirs.find(disk => disk.name === "C").writeRights.push(userName)
                fileSystem.filesAndDirs.find(disk => disk.name === "D").readRights.push(userName)
                fileSystem.filesAndDirs.find(disk => disk.name === "D").writeRights.push(userName)
                saveFileSystem(fileSystem)
                resolve(fileSystem)
            } else {
                console.log("Impossible to register a new user as the total number of users cannot exceed 8.")
                resolve(fileSystem)
            }
        }

        break
    }
})