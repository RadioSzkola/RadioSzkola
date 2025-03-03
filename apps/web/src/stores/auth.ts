import { createContext } from "react";
import { User } from "@rs/shared/models";

export type AuthState = {
    user: User | null;
};
export type AuthReducerAction =
    | {
          type: "clear-user";
      }
    | {
          type: "set-user";
          user: User;
      };

export function authReducer(
    state: AuthState,
    action: AuthReducerAction,
): AuthState {
    switch (action.type) {
        case "clear-user":
            return { ...state, user: null };
        case "set-user":
            return { ...state, user: action.user };
        default:
            return state;
    }
}

export const authContext = createContext<AuthState>({ user: null });
export const authDispatchContext = createContext<
    React.Dispatch<AuthReducerAction>
>(() => null);
