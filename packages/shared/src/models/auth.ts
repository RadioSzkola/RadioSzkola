import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sessionTable, userTable } from "../schemas/auth";
import { z } from "zod";

export const userRoleSchema = z.enum(["member", "editor", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const createUserSchema = createInsertSchema(userTable, {
    email: s => s.email.email(),
    role: userRoleSchema,
})
    .omit({ id: true, passwordHash: true })
    .extend({
        password: z.string().min(8).max(128),
    });

// dbUserSchema represents a user just returned from the database,
// while userSchema represents a safe and secure version of the user
// that can be passed everywhere
export const dbUserSchema = createSelectSchema(userTable, {
    email: s => s.email.email(),
    role: userRoleSchema,
});
export const userSchema = dbUserSchema.omit({ passwordHash: true });

export type CreateUser = z.infer<typeof createUserSchema>;
export type DbUser = z.infer<typeof dbUserSchema>;
export type User = z.infer<typeof userSchema>;

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
});

export type UserLogin = z.infer<typeof userLoginSchema>;

export const createSessionSchema = createInsertSchema(sessionTable).omit({
    id: true,
});
export const sessionSchema = createSelectSchema(sessionTable);

export type CreateSession = z.infer<typeof createSessionSchema>;
export type Session = z.infer<typeof sessionSchema>;
