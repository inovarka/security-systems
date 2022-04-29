import * as readline from "readline";
import { regAndAuthCommands } from "../commands/regAndAuthCommands.js";
import { rl } from "./commandLine.js";
import { minPasswordLength } from "../index.js";

export const getNewUserName = () => new Promise((resolve, reject) => {
    rl.question("Enter a new user's username: ", userName => {
        resolve(userName)
    }); 
})

export const getNewUserPassword = () => new Promise((resolve, reject) => {
    const question = "Enter your password: "
    
    rl.question(question, pw => {
        readline.cursorTo(process.stdout, 0, 0)
        readline.clearScreenDown(process.stdout)
        resolve(pw)
    });
    rl.stdoutMuted = true
})

export const checkPassword = () =>  new Promise(async(resolve, reject) => {
    let goodPassword = false
    let newUserPassword
    while(!goodPassword) {
        newUserPassword = await getNewUserPassword()
        if(newUserPassword.length >= minPasswordLength) goodPassword = true
    }
    resolve(newUserPassword)
})