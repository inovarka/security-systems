export const createNewDir = (fileName, user) => {
    const newDir = {
        name : fileName,
        type: "file",
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