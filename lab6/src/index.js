import { generetaLargeNumbeRabin } from "./primeNumberGenerator.js"
import { findKeys, generateSignature, verifySignature } from "./dsa.js"
import { decrypt, decryptByBlocks, encryptByBlocks, generateKey } from "./blockEncryption.js"
import * as fs from "fs"

const min32digitNum = `1${'0'.repeat(31)}`
const max32digitNum = `9${'9'.repeat(31)}`
const fileName = "../testFile"
const encryptedFileName = "../encryptedTestFile"
const fileContent = fs.readFileSync(fileName, "utf-8")

const primeQ = generetaLargeNumbeRabin(min32digitNum, max32digitNum)
const primeP = generetaLargeNumbeRabin(min32digitNum, max32digitNum)

const keysForEnc = generateKey(primeP,primeQ)
const keys = findKeys(primeQ)


const encryptFile = () => {
    const encryptedData = encryptByBlocks(fileContent, keysForEnc.publicKey)
    let encryptedString = encryptedData.map(x => x.join(" ")).join("  ")
    
    const signature = generateSignature(encryptedString, keys.privateKey)   //generated signature
    fs.writeFileSync(encryptedFileName, encryptedString + ` DSA:${signature}`)
}

const getEncryptedFile = (name) => {
    let encryptedString = fs.readFileSync(name, "utf-8")

    const indexOfDsa = encryptedString.lastIndexOf("DSA")
    const receivedSignature = encryptedString.substring(indexOfDsa + 4).split(",")
    encryptedString = encryptedString.substring(0, indexOfDsa - 1)
    return [receivedSignature, encryptedString]
}


const verify = (file, outFilename, signature, dsaPubKey, encPrKey) => {
    const wrongPublicKey = [...keys.publicKey];
    wrongPublicKey[0] = BigInt(24671287643217)
    
    const wrong = verifySignature(file, signature, wrongPublicKey)    //wrong signature
    const right = verifySignature(file, signature, dsaPubKey)     //right signature
    
    if (right) {
        const block = file.split("  ").map(x => x.split(" "))
        fs.writeFileSync(outFilename,decryptByBlocks(block, encPrKey))
        
    }
}
// keys for alreadyEncryptedFile
const encPrKey = [
    3677002155068402872297171119843549241172895914307799034064011347n,
    987909943183918058126075180099837568453841046125412089552708417n
  ]
const dsaPubKey = [
    4685574555054918966682202029417171n,
    52061939500610210740913355882413n,
    1237940039285380274899124224n,
    3007630812920696236462601121552713n
]

const testNewFile = () => {
    encryptFile()
    let [signature, file] = getEncryptedFile(encryptedFileName)
    verify(file, "../decryptedTestFile", signature, keys.publicKey, keysForEnc.privateKey)
}

const testAlreadyEncryptedFile = () => {

    let [signature, file] = getEncryptedFile("../alreadyEncryptedFile")
    verify(file, "../decryptedFile", signature, dsaPubKey, encPrKey)
}

testAlreadyEncryptedFile()
testNewFile()