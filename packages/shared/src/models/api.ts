export type ApiResponse<T = any> =
    | {
          data: T;
          message?: string;
      }
    | {
          data?: T;
          message: string;
      };
