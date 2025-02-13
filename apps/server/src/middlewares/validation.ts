import { AppError } from "@rs/shared/error";
import { PaginationOptions, paginationOptionsSchema } from "@rs/shared/models";
import { parseBySchema } from "@rs/shared/validation";
import { validator } from "hono/validator";
import type { ZodSchema } from "zod";

export const bodyValidatorMiddleware = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "json", T>("json", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<AppError>({
                code: "VALIDATION",
                message: "body",
                data: error,
            });
        }

        return data as T;
    });

export const queryValidatorMiddleware = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "query", T>("query", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<AppError>({
                code: "VALIDATION",
                message: "query",
                data: error,
            });
        }

        return data as T;
    });

export const paramsValidatorMiddleware = <T>(schema: ZodSchema<T>) =>
    validator<unknown, string, string, "param", T>("param", (value, c) => {
        const { data, error } = parseBySchema(value, schema);

        if (error) {
            return c.json<AppError>({
                code: "VALIDATION",
                message: "param",
                data: error,
            });
        }

        return data as T;
    });
