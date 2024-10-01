import { ZodSchema } from "zod";
import { customZodErrorMap } from "./error";

export function parseBySchema<T>(
    data: any,
    schema: ZodSchema<T>,
):
    | {
          data: null;
          error: {
              [P in T extends any ? keyof T : never]?: string[] | undefined;
          };
      }
    | {
          data: T;
          error: null;
      } {
    const {
        success,
        data: out,
        error,
    } = schema.safeParse(data, { errorMap: customZodErrorMap });

    if (!success) {
        return {
            data: null,
            error: error.flatten().fieldErrors,
        };
    }

    return { data: out, error: null };
}
