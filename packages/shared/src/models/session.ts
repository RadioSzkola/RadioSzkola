import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sessionTable } from "../schemas";
import { z } from "zod";

export const createSessionSchema = createInsertSchema(sessionTable).omit({
    id: true,
});
export const sessionSchema = createSelectSchema(sessionTable);

export type CreateSession = z.infer<typeof createSessionSchema>;
export type Session = z.infer<typeof sessionSchema>;
