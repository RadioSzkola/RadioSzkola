import { useEffect, useReducer } from "react";
import {
    themeContext,
    themeReducer,
    themeDispatchContext,
} from "./stores/theme";
import { authReducer, authContext, authDispatchContext } from "./stores/auth";

export type OutletProps = {
    children?: React.ReactElement;
};

export default function Outlet({ children }: OutletProps) {
    const [theme, themeDispatch] = useReducer(themeReducer, "light");
    const [auth, authDispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        if (theme === "dark") {
            document.querySelector("html")?.classList.add("dark");
        } else {
            document.querySelector("html")?.classList.remove("dark");
        }
    }, [theme]);

    return (
        <authContext.Provider value={auth}>
            <authDispatchContext.Provider value={authDispatch}>
                <themeContext.Provider value={theme}>
                    <themeDispatchContext.Provider value={themeDispatch}>
                        {children}
                    </themeDispatchContext.Provider>
                </themeContext.Provider>
            </authDispatchContext.Provider>
        </authContext.Provider>
    );
}
