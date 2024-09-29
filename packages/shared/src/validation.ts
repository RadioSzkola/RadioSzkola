import { ZodSchema } from "zod";
import { customZodErrorMap } from "./error";

export function parse<T>(
    data: any,
    schema: ZodSchema<T>,
): [null, Record<string, string[]>] | [T, null] {
    const {
        success,
        data: out,
        error,
    } = schema.safeParse(data, { errorMap: customZodErrorMap });

    if (!success) {
        return [null, error.flatten().fieldErrors as Record<string, string[]>];
    }

    return [out, null];
}
