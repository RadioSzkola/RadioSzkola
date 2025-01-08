import { createSelectSchema } from "drizzle-zod";
import { authIdTable } from "../schemas";
import { z } from "zod";

export const authIdSchema = createSelectSchema(authIdTable);

export const createAuthIdSchema = createSelectSchema(authIdTable).omit({
    createdAt: true,
    updatedAt: true,
    expiresAt: true,
    inUse: true,
});

export const updateAuthIdSchema = createSelectSchema(authIdTable).omit({
    createdAt: true,
    updatedAt: true,
});

export type AuthId = z.infer<typeof authIdSchema>;
export type CreateAuthId = z.infer<typeof createAuthIdSchema>;
export type UpdateAuthId = z.infer<typeof updateAuthIdSchema>;
