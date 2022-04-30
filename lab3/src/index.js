import { getCommands, rl} from "./commandLine/commandLine.js"
import { getName, getPassword, checkPasswordAuthenticity } from "./commandLine/getNameAndPass.js"
import { loadFileSystem, createFileSystem, saveFileSystem } from "./data/fileSystem.js"
import { askQuestion } from "./commandLine/questions.js"
import { operationsReport, addOperation } from "./commands/operations.js"

export const minPasswordLength = 4
export const maxNumberOfUser = 8
export const timeToChangePassword = 4
export const maxNumberOfFails = 4
let userFound = null

const main = async () => {
    createFileSystem()
    let fileSystem = loadFileSystem()
    let isWaiting = false
    const logbookUsers= fileSystem.filesAndDirs.find(obj => obj.name == "logBook").content
    

    while(userFound === null) {
        const name = await getName()
        const password = await getPassword()
        let userObject = logbookUsers.find(user => user.userName === name)
        if(userObject != undefined && userObject.password != password) {
            addOperation(fileSystem, name, null, 1, "Access denied. Wrong password")
            continue
        }
        if(userObject !== undefined && (userObject.userName == "admin" || await checkPasswordAuthenticity(userObject.passwordChangeTime))) {
            if(userObject.forbidden) {
                addOperation(fileSystem, name, null, 3, "Access denied. You have had too many mistakes proving to be the owner of the account. Ask the admin to register you again")
                process.exit(0)
            }
            userFound = name
            saveFileSystem(fileSystem)
            console.log("success")
        }
    }

    if(userFound != "admin") {
        setInterval(async () => {
            fileSystem = loadFileSystem()
            if(!isWaiting) {
                isWaiting = true
                rl.write('\r')
                await askQuestion(userFound, fileSystem)
                getCommands(userFound, fileSystem, "homeDir\\")
                isWaiting = false
            } else {
                addOperation(fileSystem, userFound, null, 3, "\nYou have been answering for too long")
                process.exit(0)
            }
        }, 1000  *60 * 5)
        isWaiting = true
        await askQuestion(userFound, fileSystem)
        getCommands(userFound, fileSystem, "homeDir\\")
    } else {
        setInterval(() => {
            fileSystem = loadFileSystem()
            operationsReport(fileSystem)
        }, 1000 * 60 * 60 * 24)
        getCommands(userFound, fileSystem, "homeDir\\")
        
    }

}

main()