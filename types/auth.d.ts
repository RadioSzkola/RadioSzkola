import type { User as UserModel } from "../utils/models";

// auth.d.ts
declare module "#auth-utils" {
  interface User extends UserModel {
    id: number;
  }
}

export {};
