import { z, ZodErrorMap } from "zod";

export const APIErrorCodeSchema = z.enum(["UNKNOWN", "DATABASE", "VALIDATION"]);
export type APIErrorCode = z.infer<typeof APIErrorCodeSchema>;

export type APIError = (
    | {
          code: typeof APIErrorCodeSchema.Values.UNKNOWN;
          data: any;
      }
    | {
          code: typeof APIErrorCodeSchema.Values.DATABASE;
          data: any;
      }
    | {
          code: typeof APIErrorCodeSchema.Values.VALIDATION;
          data: Record<string, string[]>;
      }
) & {
    message: string;
};

export function createAPIError(
    code: APIErrorCode,
    message: string,
    data: any = null,
): APIError {
    return {
        code,
        message,
        data,
    };
}

export const customZodErrorMap: ZodErrorMap = (error, ctx) => {
    return { message: ctx.defaultError };
};
