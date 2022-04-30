export const createNewDir = (fileName, user) => {
    const newDir = {
        name : fileName,
        type: "directory",
        readRights: ["admin"],
        writeRights: ["admin"],
        filesAndDirs: []
    }

    if (user !== "admin") {
        newDir.readRights.push(user)
        newDir.writeRights.push(user)
    }
    return newDir
}
export const createNewFile = (fileName, contentText, user) => {
    const newFile = {
        name : fileName,
        type: "file",
        readRights: ["admin"],
        writeRights: ["admin"],
        content: contentText
    }

    if (user !== "admin") {
        newFile.readRights.push(user)
        newFile.writeRights.push(user)
    }
    return newFile
}

export const createNewUser = (name, pass, questions) => {
    return {
        userName: name,
        password: pass,
        passwordChangeTime: Date.now(),
        forbidden: false,
        numberOfMistakes: 0,
        questions: questions
    }
}

export const createOperation = (user, command, level, message) => {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    const dateTime = date + ' ' + time
    return {
        userName: user,
        operationName: command,
        levelOfDanger: level,
        date: dateTime,
        message: message
    }
}

export const createIOperationReport = (user, arrayOfOperations) => {
    return {
        userName: user,
        operations: arrayOfOperations
    }
}