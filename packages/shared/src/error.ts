import { ZodErrorMap } from "zod";

export type ApiErrorCode = "VALIDATION" | "UNKNOWN" | "DATABASE" | "AUTH";

export type ApiError<T = any> =
    | {
          code: "VALIDATION";
          data: {
              [P in T extends any ? keyof T : never]?: string[] | undefined;
          };
          message?: string;
      }
    | {
          code: "UNKNOWN";
          data?: any;
          message?: string;
      }
    | {
          code: "DATABASE";
          data?: any;
          message?: string;
      }
    | {
          code: "AUTHENTICATION";
          data?: any;
          message?: string;
      }
    | {
          code: "AUTHORIZATION";
          data?: any;
          message?: string;
      };

export const customZodErrorMap: ZodErrorMap = (error, ctx) => {
    return { message: ctx.defaultError };
};
