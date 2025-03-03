import { useEffect, useReducer } from "react";
import {
    themeContext,
    themeReducer,
    themeDispatchContext,
} from "./stores/theme";
import { authReducer, authContext, authDispatchContext } from "./stores/auth";
import { useAPIQuery } from "./hooks/api";
import { User } from "@rs/shared/models";

export type OutletProps = {
    children?: React.ReactElement;
};

export default function Outlet({ children }: OutletProps) {
    const [theme, themeDispatch] = useReducer(themeReducer, "light");
    const [auth, authDispatch] = useReducer(authReducer, null);

    const userEndpoint = useAPIQuery<User>({
        endpoint: "/v1/auth/web/me",
        method: "GET",
    });

    useEffect(() => {
        if (theme === "dark") {
            document.querySelector("html")?.classList.add("dark");
        } else {
            document.querySelector("html")?.classList.remove("dark");
        }
    }, [theme]);

    useEffect(() => {
        userEndpoint.call();
    }, []);

    useEffect(() => {
        if (userEndpoint.error) {
            authDispatch({ type: "unset-user" });
        } else if (userEndpoint.data) {
            authDispatch({ type: "set-usser", user: userEndpoint.data });
        }
    }, [userEndpoint.status]);

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
