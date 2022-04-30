import * as readline from 'readline'
import { executeCommand } from '../commands/commands.js'
import { getNewUserName, getNewUserPassword, checkPassword } from './regAndAuth.js';
import { adminCommands } from '../commands/adminCommands.js';
import { addOperation } from '../commands/operations.js';
export const rl = readline.createInterface(process.stdin, process.stdout)


readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}
rl._writeToOutput = function _writeToOutput(stringToWrite) {

    if (rl.stdoutMuted) {
        rl.output.write("*");
    }
    else
        rl.output.write(stringToWrite);
};

export const getCommands = (currUser, fileSystem, currentDirUrl, currentDir = null) => {
    rl.stdoutMuted = false
    
    if (currentDir == null) {
        currentDir = fileSystem
    }

    rl.question(currentDirUrl, async(command) => {
        command = command.split(" ")
        if (command[0] === "mkdir" || command[0] === "rm" || command[0] == "vi") {
            if(command.length == 1) {
                addOperation(fileSystem, currUser, command[0], 0, "Wrong number of arguments")
            } else {
                [fileSystem, currentDir] = await executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0], command[1])
            }
        } else if (command[0] === "cd"){
            if(command.length == 1) {
                addOperation(fileSystem, currUser, command[0], 0, "Wrong number of arguments")
            } else {
                [currentDir, currentDirUrl] = await executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0], command[1])
            }
        } else if (command[0] === "reguser") {
            if (currUser != "admin") {
                addOperation(fileSystem, currUser, command[0], 2, "Access denied. Only administrator is allowed to use the command")
            } else {
                let newUserName = await getNewUserName()
                let newUserPassword = await checkPassword()
                fileSystem = await adminCommands(fileSystem, command[0], newUserName, newUserPassword)
            }
        } else if(command[0] === "prntoprep") {
            if (currUser != "admin") {
                addOperation(fileSystem, currUser, command[0], 2,"Access denied. Only administrator is allowed to use the command")
            } else {
                await adminCommands(fileSystem, command[0])
            }
        } else {
            await executeCommand(currUser, fileSystem, currentDir, currentDirUrl, command[0])
        }
        getCommands(currUser, fileSystem, currentDirUrl, currentDir)
    })



}