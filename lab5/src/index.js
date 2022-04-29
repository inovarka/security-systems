import { generetaLargeNumbeRabin } from "./primeNumberGenerator.js"
import { findKeys, generateSignature, verifySignature } from "./dsa.js"
import * as fs from "fs"

const min32digitNum = `1${'0'.repeat(31)}`
const max32digitNum = `9${'9'.repeat(31)}`
const fileName = "../fileTest"
const fileContent = fs.readFileSync(fileName, "utf-8")

const primeQ = generetaLargeNumbeRabin(min32digitNum, max32digitNum)
const keys = findKeys(primeQ)

const signature = generateSignature(fileContent, keys.privateKey)   //generated signature

console.log(`Private key: ${keys.privateKey}`)
console.log(`Public key: ${keys.publicKey}`)
console.log(`Signature: ${signature}`)

const wrongPublicKey = [...keys.publicKey];
wrongPublicKey[0] = BigInt(24671287643217)

verifySignature(fileContent, signature, wrongPublicKey)    //wrong signature
verifySignature(fileContent, signature, keys.publicKey)     //right signature