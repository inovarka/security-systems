import bigInt from "big-integer"
import Big from "big-js"
import { calculatePowerWithMod, calculateSimple } from "./calculateBigNums.js"

const alpha = Array.from(Array(58)).map((e, i) => i + 65)
const alphabet = alpha.map((x) => String.fromCharCode(x))

alphabet.splice(26,6)
alphabet.push(" ")

const gcd = (a, b) => {
    if (!b) {
        return a;
    }
  
    return gcd(b, calculateSimple(a).mod(b));
}

export const generateKey = (p, q) => {
    const n = calculateSimple(p).multiplyBy(q)

    const f = calculateSimple(calculateSimple(p).add(-1)).multiplyBy(calculateSimple(q).add(-1))


    let e = 65537
    while(gcd(n, e) != 1) {
        e = bigInt.randBetween(0, f);
    } 

    let k = 1, d;
    while (true) {
        const numerator = calculateSimple(calculateSimple(k).multiplyBy(f)).add(1)

        if (calculateSimple(numerator).mod(e) == 0) {
            d = calculateSimple(numerator).divideBy(e)
            break
        }
        k++
    } 

    return {publicKey: [n, e],
            privateKey: [n, d]}
}

const encrypt = (block, key) => {
    const n = BigInt(key[0])
    const e = BigInt(key[1])
    

    let encryptedArray = []
    for(let i = 0; i < block.length; i++) {
        encryptedArray.push(calculatePowerWithMod(BigInt(alphabet.indexOf(block[i]) + 1), e, n))
    }
    return encryptedArray
}

export const decrypt = (block, key) => {
    const n = BigInt(key[0])
    const d = BigInt(key[1])
    const decryptedArray = []
    for(let i = 0; i < block.length; i++) {
        const decryptedLetter = calculatePowerWithMod(BigInt(block[i]), d, n)
        decryptedArray.push(alphabet[Number(decryptedLetter) - 1])
    }

    return decryptedArray.join("")

}

export const encryptByBlocks = (text, key) => {
    const splitText = text.split("")
    const blocks = []
    for(let i = 0; i < text.length; i += 8) {
        blocks.push(splitText.slice(i, i + 8))
    }
    const encryptedBlocks = blocks.map(x => encrypt(x, key))
    return encryptedBlocks
}

export const decryptByBlocks = (blocks, key) => {
    const decryptedBlocks = blocks.map(x => decrypt(x, key))
    return decryptedBlocks.join("")
}
