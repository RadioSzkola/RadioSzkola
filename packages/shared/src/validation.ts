import { ZodSchema } from "zod";
import { customZodErrorMap } from "./error";

export function parse<T>(
    data: any,
    schema: ZodSchema<T>,
): { data: null; error: Record<string, string[]> } | { data: T; error: null } {
    const {
        success,
        data: out,
        error,
    } = schema.safeParse(data, { errorMap: customZodErrorMap });

    if (!success) {
        return {
            data: null,
            error: error.flatten().fieldErrors as Record<string, string[]>,
        };
    }

    return { data: out, error: null };
}
