import React, { createContext } from "react";

type Theme = "light" | "dark";
type ThemeReducerAction = "toggle" | "set-light" | "set-dark";

type ThemeState = Theme;

export function themeReducer(
    state: ThemeState,
    action: ThemeReducerAction,
): ThemeState {
    switch (action) {
        case "set-dark":
            return "dark";
        case "set-light":
            return "light";
        case "toggle":
            return state === "light" ? "dark" : "light";
        default:
            return state;
    }
}

export const themeContext = createContext<Theme>("light");
export const themeDispatchContext = createContext<
    React.Dispatch<ThemeReducerAction>
>(() => null);
