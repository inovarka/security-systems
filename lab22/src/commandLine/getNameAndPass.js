import * as readline from 'readline'
import { rl } from './commandLine.js'
import { timeToChangePassword } from '../index.js'

export const getName = () => new Promise((resolve, reject) => {
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    rl.question("Enter your username: ", userName => {
        resolve(userName)
    });  
})

export const getPassword = () => new Promise((resolve, reject) => {
    const question = "Enter your password: "
    
    rl.question(question, pw => {
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        resolve(pw)
    });
    rl.stdoutMuted = true
})

export const checkPasswordAuthenticity = (time) => {
    rl.stdoutMuted = false
    const timeToChangePasswordInMS = 1000 * 60 * 60 * 24 * timeToChangePassword;
    if (time + timeToChangePasswordInMS > Date.now()) {
        return true
    } else {
        rl.question("The password is too old. It is time to change it", () => {})
        return false
    }
    
}