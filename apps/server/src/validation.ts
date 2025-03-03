import { AppError } from "@rs/shared/error";
import { parseBySchema } from "@rs/shared/validation";
import { Schema } from "zod";

export function useValidation<T>(
    data: any,
    schema: Schema<T>,
):
    | {
          data: T;
          error: null;
          statusCode: null;
      }
    | {
          data: null;
          error: AppError<T>;
          statusCode: ResponseInit;
      } {
    const { data: validData, error } = parseBySchema(data, schema);

    if (error) {
        return {
            data: null,
            error: {
                code: "VALIDATION",
                data: error,
            },
            statusCode: 400 as ResponseInit,
        };
    }

    return {
        data: validData as T,
        error: null,
        statusCode: null,
    };
}
