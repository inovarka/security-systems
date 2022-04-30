import { createIOperationReport, createOperation } from "./objectMakers.js"
import { saveFileSystem } from "../data/fileSystem.js"

export const addOperation = (fileSystem, user, command, level, errorMessage) => {
    console.log(errorMessage)
    const operationsFile = fileSystem.filesAndDirs[0]
    const operations = operationsFile.operations
    const newOperation = createOperation(user, command, level, errorMessage)
    operations.push(newOperation)
    saveFileSystem(fileSystem)
}

export const operationsReport = (fileSystem) => {
    const arrayOfUsersOperations = []
    const operationsLog = fileSystem.filesAndDirs.find(obj => obj.name == "operationsLog")
    const operations = operationsLog.operations
    const allUsers = fileSystem.filesAndDirs.find(obj => obj.name == "logBook").content

    for(const user of allUsers){
        const userName = user.userName
        if(userName == "admin") continue
        const usersOperations = operations.filter(log => log.userName === userName)
        arrayOfUsersOperations.push(createIOperationReport(userName, usersOperations))
    }

    operationsLog.report = arrayOfUsersOperations
    operations.length = 0
    saveFileSystem(fileSystem)
}