import { ZodErrorMap } from "zod";

export type AppErrorCode = "VALIDATION" | "UNKNOWN" | "DATABASE" | "AUTH";

export type AppError<T = any> =
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
      }
    | {
          code: "FETCH";
          data: AppError;
          message?: string;
      };

export const customZodErrorMap: ZodErrorMap = (error, ctx) => {
    console.log(error.code);
    return { message: ctx.defaultError };
};
