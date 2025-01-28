import { z } from "zod";

export const paginationOptionsSchema = z.object({
    limit: z.coerce.number().min(0).max(512).default(50),
    offset: z.coerce.number().min(0).default(0),
});

export type PaginationOptions = z.infer<typeof paginationOptionsSchema>;
