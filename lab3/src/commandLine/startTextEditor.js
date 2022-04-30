import { rl } from "./commandLine.js";

export const startTextEditor = (oldString = "") => new Promise((resolve, reject) => {
    let string = oldString
    rl.question(oldString, (inputLine) => {
        string += inputLine
        resolve(string)
    });
    
})