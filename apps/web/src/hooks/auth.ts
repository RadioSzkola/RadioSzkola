import { User } from "@rs/shared/models";
import { useContext, useEffect } from "react";
import { authContext, authDispatchContext } from "../stores/auth";
import { useAPIQuery } from "./api";

export function useUser(): { user: User | null; refresh: () => void } {
    const auth = useContext(authContext);
    const authDispatch = useContext(authDispatchContext);

    const userEndpoint = useAPIQuery<User>({
        endpoint: "/v1/auth/web/me",
        method: "GET",
    });

    useEffect(() => {
        if (userEndpoint.error) {
            authDispatch({ type: "unset-user" });
        } else if (userEndpoint.data) {
            authDispatch({ type: "set-usser", user: userEndpoint.data });
        }
    }, [userEndpoint.status]);

    const refresh = () => {
        userEndpoint.call();
    };

    return {
        user: auth,
        refresh,
    };
}
