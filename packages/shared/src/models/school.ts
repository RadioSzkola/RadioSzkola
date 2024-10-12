import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { schoolTable } from "../schemas/school";
import { z } from "zod";

export const schoolSchema = createSelectSchema(schoolTable);
export const createSchoolSchema = createInsertSchema(schoolTable).omit({
    id: true,
    updatedAt: true,
    createdAt: true,
});

export const updateSchoolSchema = createInsertSchema(schoolTable)
    .omit({
        id: true,
        updatedAt: true,
        createdAt: true,
    })
    .partial();

export type School = z.infer<typeof schoolSchema>;
export type CreateSchool = z.infer<typeof createSchoolSchema>;
export type UpdateSchool = z.infer<typeof updateSchoolSchema>;
