import bigInt from "big-integer"
import { calculateSimple } from "./calculateBigNums.js"
import {ferma} from "./ferma.js"

export const generetaLargeNumbeRabin = (rangeMin, rangeMax) => {
    const big1 = BigInt(1)

    const a = 2
    const Pmax = bigInt.randBetween(rangeMin, rangeMax)
    const k = Math.log2(calculateSimple(Pmax).divideBy(2).toString()).toFixed(2);

    const p = BigInt(2 * Math.pow(2, k))
    let p1 = p + BigInt(1)
    let p2 = p - BigInt(1)

    while (true) {
        if(ferma(a, p1) == big1) {
            console.log(`p1 is prime: ${p1}`)
            break
        }
        
        if(ferma(a, p2) == big1) {
            
            console.log(`p2 is prime: ${p2}`)
            break
        }

        p1 = calculateSimple(p1).add(2)
        p2 = calculateSimple(p2).add(-2)
        console.log("No prime numbers \n")
        
    }
}