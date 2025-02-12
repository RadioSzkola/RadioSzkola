import { useEffect, useReducer } from "react";
import {
    themeContext,
    themeReducer,
    themeDispatchContext,
} from "./stores/theme";
import { authReducer, authContext, authDispatchContext } from "./stores/auth";
import { useAPI } from "./hooks/api";
import { User } from "@rs/shared/models";

export type OutletProps = {
    children?: React.ReactElement;
};

export default function Outlet({ children }: OutletProps) {
    const [theme, themeDispatch] = useReducer(themeReducer, "light");
    const [auth, authDispatch] = useReducer(authReducer, null);
    const userQuery = useAPI<User>({
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
        if (userQuery.error) {
            console.error(userQuery.error);
            authDispatch({ type: "unset-user" });
        } else if (userQuery.data) {
            console.log({ user: userQuery.data });
            authDispatch({ type: "set-usser", user: userQuery.data });
        } else {
            console.log(userQuery);
        }
    }, [userQuery.pending]);

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
