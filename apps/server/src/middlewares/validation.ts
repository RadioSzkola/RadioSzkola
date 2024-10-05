import { ApiError } from "@rs/shared/error";
import { parseBySchema } from "@rs/shared/validation";
import { validator } from "hono/validator";
import type { ZodSchema } from "zod";

export const jsonSchemaValidator = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "json", T>("json", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<ApiError>({
                code: "VALIDATION",
                data: error,
            });
        }

        return data as T;
    });
