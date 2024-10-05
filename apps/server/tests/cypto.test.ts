import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../src/crypto";
import crypto from "node:crypto";

describe("Hashing and verifying passwords", () => {
    it("Empty password", async () => {
        const password = "";
        const hash = await hashPassword(password);
        const isValid = await verifyPassword(hash, password);

        expect(isValid).toBe(true);
    });
    it("Simple password", async () => {
        const password = "thisisatestpassword";
        const hash = await hashPassword(password);
        const isValid = await verifyPassword(hash, password);

        expect(isValid).toBe(true);
    });
    it("Randomly generated password", async () => {
        const password = crypto.randomBytes(64).toString();
        const hash = await hashPassword(password);
        const isValid = await verifyPassword(hash, password);

        expect(isValid).toBe(true);
    });
});
