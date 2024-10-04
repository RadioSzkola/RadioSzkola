import crypto from "node:crypto";
import { Algorithm, hash, Options, verify } from "@node-rs/argon2";

export function getPepper(): Buffer {
    // Empty for testing purposes
    return Buffer.from("");
}

export function getSalt(): Buffer {
    return crypto.randomBytes(32);
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

    const passwordHash = await hash(password, {
        ...argon2Options,
        salt: salt,
        secret: pepper,
    });

    return passwordHash;
}

export async function verifyPassword(
    passwordHash: string,
    password: string,
): Promise<boolean> {
    const pepper = getPepper();

    return await verify(passwordHash, password, {
        ...argon2Options,
        secret: pepper,
    });
}
