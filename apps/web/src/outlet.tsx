import { useEffect, useReducer } from "react";
import {
    themeContext,
    themeReducer,
    themeDispatchContext,
} from "./stores/theme";

export type OutletProps = {
    children?: React.ReactElement;
};

export default function Outlet({ children }: OutletProps) {
    const [theme, themeDispatch] = useReducer(themeReducer, "light");

    useEffect(() => {
        if (theme === "dark") {
            document.querySelector("html")?.classList.add("dark");

            //document
            //   .querySelectorAll("*")
            //  .forEach(el => el.classList.add("dark"));
        } else {
            document.querySelector("html")?.classList.remove("dark");

            //document
            //  .querySelectorAll("*")
            //.forEach(el => el.classList.remove("dark"));
        }
    }, [theme]);

    return (
        <themeContext.Provider value={theme}>
            <themeDispatchContext.Provider value={themeDispatch}>
                {children}
            </themeDispatchContext.Provider>
        </themeContext.Provider>
    );
}
