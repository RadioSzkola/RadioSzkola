import {
    SignupId,
    signupIdSchema,
    User,
    UserLogin,
    userLoginSchema,
} from "@rs/shared/models";
import { useContext, useEffect, useState } from "react";
import { authContext, authDispatchContext } from "../stores/auth";
import { QueryResult, useAPIQuery } from "./api";
import { AppError } from "@rs/shared/error";
import { parseBySchema } from "@rs/shared/validation";

export function useUser(): { user: User | null; refreshSession: () => void } {
    const authStore = useContext(authContext);
    const authDispatchStore = useContext(authDispatchContext);

    const userQuery = useAPIQuery<User>(
        {
            endpoint: "/v1/auth/web/me",
            method: "GET",
        },
        {
            initial: !!authStore.user,
        },
    );

    useEffect(() => {
        if (authStore.user) {
            return;
        }

        if (
            userQuery.result.status === "data" ||
            userQuery.result.status === "stale"
        ) {
            authDispatchStore({
                type: "set-user",
                user: userQuery.result.data,
            });
        } else {
            authDispatchStore({ type: "clear-user" });
        }
    }, [userQuery.result.status]);

    const refreshSession = () => {
        userQuery.refresh();
    };

    return {
        user: authStore.user,
        refreshSession,
    };
}

export function useLoginQuery(): {
    login: (loginData: UserLogin) => void;
    abort: () => void;
    result: QueryResult<User, UserLogin>;
} {
    const [validationError, setValidationError] =
        useState<AppError<User> | null>(null);

    const query = useAPIQuery<User, UserLogin>(
        {
            endpoint: "/v1/auth/web/login",
            method: "POST",
        },
        {
            initial: false,
        },
    );

    const login = (loginData: UserLogin) => {
        const { data, error } = parseBySchema(loginData, userLoginSchema);

        if (error) {
            setValidationError({ code: "VALIDATION", data: error });
            return;
        }

        query.refresh({ payload: data });
    };

    if (validationError) {
        return {
            login,
            abort: query.abort,
            result: {
                status: "error",
                data: null,
                pending: false,
                error: validationError,
            },
        };
    }

    return {
        login,
        abort: query.abort,
        result: query.result,
    };
}

export function useSignupIdQuery(): {
    signup: (signupData: SignupId) => void;
    abort: () => void;
    result: QueryResult<User, SignupId>;
} {
    const [validationError, setValidationError] =
        useState<AppError<User> | null>(null);

    const query = useAPIQuery<User, SignupId>(
        {
            endpoint: "/v1/auth/web/signupid",
            method: "POST",
        },
        {
            initial: false,
        },
    );

    const signup = (signupData: SignupId) => {
        const { data, error } = parseBySchema(signupData, signupIdSchema);

        if (error) {
            setValidationError({ code: "VALIDATION", data: error });
            return;
        }

        query.refresh({ payload: data });
    };

    if (validationError) {
        return {
            signup,
            abort: query.abort,
            result: {
                status: "error",
                data: null,
                pending: false,
                error: validationError,
            },
        };
    }

    return {
        signup,
        abort: query.abort,
        result: query.result,
    };
}

export function useLogoutQuery(): {
    logout: () => void;
    abort: () => void;
    result: QueryResult<{ message: string }>;
} {
    const query = useAPIQuery<{ message: string }>(
        {
            endpoint: "/v1/auth/web/logout",
            method: "POST",
        },
        {
            initial: false,
        },
    );

    const logout = () => {
        query.refresh();
    };

    return {
        logout,
        abort: query.abort,
        result: query.result,
    };
}
