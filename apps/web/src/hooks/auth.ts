import { User } from "@rs/shared/models";
import { useContext } from "react";
import { authContext } from "../stores/auth";

export function useUser(): User | null {
    const auth = useContext(authContext);

    if (auth === null) {
        return null;
    }

    return auth;
}
