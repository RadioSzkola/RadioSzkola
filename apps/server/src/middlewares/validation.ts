import { ApiError } from "@rs/shared/error";
import { PaginationOptions, paginationOptionsSchema } from "@rs/shared/models";
import { parseBySchema } from "@rs/shared/validation";
import { validator } from "hono/validator";
import type { ZodSchema } from "zod";

export const bodySchemaValidator = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "json", T>("json", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<ApiError>({
                code: "VALIDATION",
                message: "body",
                data: error,
            });
        }

        return data as T;
    });

export const querySchemaValidator = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "query", T>("query", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<ApiError>({
                code: "VALIDATION",
                message: "query",
                data: error,
            });
        }

        return data as T;
    });

export const paginationOptionsValidator = validator<
    unknown,
    string,
    string,
    "query",
    PaginationOptions
>("query", (value, c) => {
    let limit = value.limit ?? 128;
    let offset = value.offset ?? 0;

    const { data, error } = parseBySchema(
        { limit, offset },
        paginationOptionsSchema,
    );

    if (error) {
        return c.json<ApiError>({
            code: "VALIDATION",
            message: "pagination query",
            data: error,
        });
    }

    return data;
});

export const paramsSchemaValidator = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "param", T>("param", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<ApiError>({
                code: "VALIDATION",
                message: "param",
                data: error,
            });
        }

        return data as T;
    });
