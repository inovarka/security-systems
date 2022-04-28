import { generetaLargeNumbeRabin } from "./primeNumberGenerator.js"

const min32digitNum = `1${'0'.repeat(31)}`
const max32digitNum = `9${'9'.repeat(31)}`


generetaLargeNumbeRabin(min32digitNum, max32digitNum)