import crypto from "node:crypto";
import { Algorithm, hash, Options, verify } from "@node-rs/argon2";

export function getPepper(): string {
    // Empty for testing purposes
    return "";
}

export function getSalt(): string {
    const buf = crypto.randomBytes(32);
    return buf.toString("base64");
}

export const argon2Options: Options = {
    // Optimized for hashing password and protection agaist side-channels attacks
    // https://argon2.online/
    algorithm: Algorithm.Argon2i,

    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
};

export async function hashPassword(password: string): Promise<string> {
    const pepper = getPepper();
    const salt = getSalt();
    const passwordHash = await hash(pepper + salt + password, argon2Options);

    if (!argon2Options.algorithm) {
        throw Error("crypto::hashPassword -> Wrong algorithm code");
    }

    return argon2Options.algorithm.toString() + "$" + salt + "$" + passwordHash;
}

export async function verifyPassword(
    passwordHash: string,
    password: string,
): Promise<boolean> {
    const [algoCode, salt, hashValue] = passwordHash.split("$");
    const pepper = getPepper();

    if (
        algoCode !== Algorithm.Argon2d.toString() ||
        algoCode !== Algorithm.Argon2i.toString() ||
        algoCode !== Algorithm.Argon2id.toString()
    ) {
        throw Error("crypto::verifyPassword -> Wrong algorithm code");
    }
    return await verify(hashValue, pepper + salt + password, {
        ...argon2Options,
        algorithm: parseInt(algoCode),
    });
}
