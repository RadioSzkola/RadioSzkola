import { createContext } from "react";
import { User } from "@rs/shared/models";

export type AuthState = User | null;
export type AuthReducerAction =
    | {
          type: "unset-user";
      }
    | {
          type: "set-usser";
          user: User;
      };

export function authReducer(
    state: AuthState,
    action: AuthReducerAction,
): AuthState {
    switch (action.type) {
        case "unset-user":
            return null;
        case "set-usser":
            return action.user;
        default:
            return state;
    }
}

export const authContext = createContext<AuthState>(null);
export const authDispatchContext = createContext<
    React.Dispatch<AuthReducerAction>
>(() => null);
