import { z } from "zod";

export const paginationOptionsSchema = z.object({
    limit: z.number().min(0).max(512),
    offset: z.number().min(0),
});

export type PaginationOptions = z.infer<typeof paginationOptionsSchema>;
