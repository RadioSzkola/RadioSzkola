import { z } from "zod";

export type ApiResponse<T = any> =
    | {
          data: T;
          message?: string;
      }
    | {
          data?: T;
          message: string;
      };

export const paginationOptionsSchema = z.object({
    limit: z.number().min(0).max(512),
    offset: z.number().min(0),
});

export type PaginationOptions = z.infer<typeof paginationOptionsSchema>;
