import {calculateSimple, calculatePowerWithMod, calculateModularInverse} from "./calculateBigNums.js"
import { ferma } from "./ferma.js"
import bigInt from "big-integer"

String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash)
};

export const findKeys = (q) => {
    let p = q
    let i = 2
    let h = BigInt(1)
    let big1 = BigInt(1)
    while(true){
        const tempP = calculateSimple(calculateSimple(p).multiplyBy(i)).add(1)
        if(ferma(2, tempP) == 1) {
            p = tempP
            break
        }
        i += 2
    }

    let g;
    while(h >= big1 && h < p) {
        const expression1 = calculateSimple(calculateSimple(p).add(-1)).divideBy(q)
        const possibleG = calculatePowerWithMod(h, expression1, p)
        
        if(calculatePowerWithMod(possibleG, q, p) == 1 && possibleG > big1 && possibleG < p) {
            g = possibleG
            break
        }


        h = calculateSimple(h).add(1)
    }

    const x = BigInt(bigInt.randBetween(0, q))
    const y = calculatePowerWithMod(g, BigInt(x), p)

    return {publicKey: [p, q, g, y],
            privateKey: [p, q, g, x]}
}

export const generateSignature = (text, privateKey) => {
    const p = privateKey[0]
    const q = privateKey[1]
    const g = privateKey[2]
    const x = privateKey[3]

    const digest = text.hashCode()

    const k = BigInt(bigInt.randBetween(0, q))
    const r = calculateSimple(calculatePowerWithMod(g, k, p)).mod(q)
    const i = calculateModularInverse(k, q)
    const s = calculateSimple(calculateSimple(i).multiplyBy(calculateSimple(digest).add(calculateSimple(r).multiplyBy(x)))).mod(q)

    return [r, s]
}

export const verifySignature = (text, signature, publicKey) => {
    const h = text.hashCode()

    const p = publicKey[0]
    const q = publicKey[1]
    const g = publicKey[2]
    const y = publicKey[3]

    const r = signature[0]
    const s = signature[1]

    const w = calculateModularInverse(s, q)

    const u1 = calculateSimple(calculateSimple(h).multiplyBy(w)).mod(q)
    const u2 = calculateSimple(calculateSimple(r).multiplyBy(w)).mod(q)

    const v1 = calculatePowerWithMod(g, u1, p)
    const v2 = calculatePowerWithMod(y, u2, p)

    const v = calculateSimple(calculateSimple(calculateSimple(v1).multiplyBy(v2)).mod(p)).mod(q)

    if(v == r) {
        console.log("The signature has been verified")
        return true
    } else {
        console.log("The signature has been declined\n")
        return false
    }
}