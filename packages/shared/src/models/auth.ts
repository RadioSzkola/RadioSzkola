import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sessionTable, userTable } from "../schemas/auth";
import { z } from "zod";

export const userRoleSchema = z.enum([
    "member", // A standard user of the app
    "creator", // A user able to create content
    "admin", // A local (school) admin
    "systemadmin", // A global admin (all of schools)
]);

export const userPasswordSchema = z.string().min(8).max(128);

export const createUserSchema = createInsertSchema(userTable, {
    email: s => s.email.email(),
    role: userRoleSchema,
})
    .omit({ id: true, passwordHash: true, updatedAt: true, createdAt: true })
    .extend({
        password: userPasswordSchema,
    });

export const updateUserSchema = createInsertSchema(userTable, {
    email: s => s.email.email(),
    role: userRoleSchema,
})
    .omit({ id: true, passwordHash: true, updatedAt: true, createdAt: true })
    .partial();

// dbUserSchema represents a user just returned from the database,
// while userSchema represents a safe and secure version of the user
// that can be passed everywhere
export const dbUserSchema = createSelectSchema(userTable, {
    email: s => s.email.email(),
    role: userRoleSchema,
});

export const userSchema = createSelectSchema(userTable, {
    email: s => s.email.email(),
    role: userRoleSchema,
}).omit({ passwordHash: true });

export const userLoginSchema = z.object({
    email: z.string().email(),
    password: userPasswordSchema,
});

export const createSessionSchema = createInsertSchema(sessionTable).omit({
    id: true,
});
export const sessionSchema = createSelectSchema(sessionTable);

export type UserRole = z.infer<typeof userRoleSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type DbUser = z.infer<typeof dbUserSchema>;
export type User = z.infer<typeof userSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;
export type Session = z.infer<typeof sessionSchema>;
