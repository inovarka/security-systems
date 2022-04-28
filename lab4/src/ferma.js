import { calculatePowerWithMod, calculateSimple } from "./calculateBigNums.js";

export const ferma = (a, p) => {
    const bigA = BigInt(a)
    const bigP = BigInt(p)

    if(calculateSimple(a).mod(p) == 0) {
        throw new Error("a cannot be divisible by p")
    }

    const calculatedPower = calculatePowerWithMod(bigA, calculateSimple(p).add(-1), bigP)
    console.log(`Calculated power = ${calculatedPower}`)

    return calculatedPower
}