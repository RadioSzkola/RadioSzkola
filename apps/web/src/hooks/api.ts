import { AppError } from "@rs/shared/error";
import axios, { AxiosError } from "axios";
import { SERVER_HOST } from "../const";
import { useEffect, useState } from "react";

export type APIFetchConfig<Payload = any> = {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
    payload?: Payload;
    timeout: number;
    withCredentials: boolean;
    params: Record<string, string>;
};

function resolveURLParams(URL: string, params: Record<string, string>): string {
    let str = URL;

    for (const [key, value] of Object.entries(params)) {
        str = str.replaceAll(":" + key, value);
    }

    return str;
}

function resolveEndpoint(host: string, endpoint: string): string {
    if (host[-1] === "/" && endpoint[0] === "/") {
        return host + endpoint.slice(1);
    }

    return host + endpoint;
}

export async function APIFetch<Response = any, Payload = any>({
    endpoint,
    method,
    payload,
    timeout = 5000,
    withCredentials = true,
    params = {},
}: APIFetchConfig<Payload>): Promise<
    { data: Response; error: null } | { data: null; error: AppError }
> {
    try {
        const URL = resolveURLParams(
            resolveEndpoint(SERVER_HOST, endpoint),
            params,
        );

        const response = await axios(URL, {
            timeout,
            method,
            data: payload,
            withCredentials,
        });

        return {
            data: response.data,
            error: null,
        };
    } catch (error: AxiosError | unknown) {
        if (error instanceof AxiosError) {
            return {
                data: null,
                error: error.response?.data ?? { code: "UNKNOWN" },
            };
        }

        return {
            data: null,
            error: {
                code: "UNKNOWN",
            },
        };
    }
}

export type QueryStatus = "data" | "error" | "stale" | "pending" | "setup";

export type QueryResult<Response = any> =
    | {
          status: "setup";
          data: null;
          error: null;
          pending: false;
      }
    | {
          status: "pending";
          data: null;
          error: null;
          pending: true;
      }
    | {
          status: "error";
          data: null;
          error: AppError;
          pending: false;
      }
    | {
          status: "data";
          data: Response;
          error: null;
          pending: false;
      }
    | {
          status: "stale";
          data: Response;
          error: null;
          pending: true;
      };

export type QueryConfig = {
    retries: number;
    retryAfter: number;
};

export function useAPIQuery<Response, Payload = any>(
    fetchConfig: APIFetchConfig<Payload>,
    { retries = 3, retryAfter = 500 }: QueryConfig = {
        retries: 3,
        retryAfter: 500,
    },
): {
    result: QueryResult<Response>;
    refresh: (refreshConfig: {
        payload: Payload | null;
        params: Record<string, string> | null;
    }) => void;
} {
    if (retries < 0) {
        throw new Error("Retries must be a positive number.");
    }

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<AppError | null>(null);
    const [data, setData] = useState<Response | null>(null);
    const [retriesLeft, setRetriesLeft] = useState(retries);

    const refresh = (
        {
            payload = null,
            params = null,
        }: {
            payload: Payload | null;
            params: Record<string, string> | null;
        } = {
            payload: null,
            params: null,
        },
    ) => {
        setPending(true);

        APIFetch<Response, Payload>({
            ...fetchConfig,
            payload: payload ?? fetchConfig.payload,
            params: params ?? fetchConfig.params,
        })
            .then(res => {
                if (res.data) {
                    setData(res.data);
                    setError(null);
                } else {
                    setError(res.error);
                    setData(null);
                }
            })
            .catch(err => {
                setError({
                    code: "UNKNOWN",
                    message: "An unexepected error (useAPIQuery)",
                    data: err,
                });
                setData(null);
            })
            .finally(() => {
                setPending(false);
            });
    };

    useEffect(() => {
        setPending(true);
        refresh();
    }, []);

    useEffect(() => {
        if (!error) {
            setRetriesLeft(retries);
            return;
        }

        if (retriesLeft <= 0) {
            setPending(false);
            return;
        }

        const timeout = setTimeout(() => {
            refresh();
            setRetriesLeft(r => r - 1);
        }, retryAfter);

        return () => {
            clearTimeout(timeout);
        };
    }, [error, error?.code]);

    if (pending && data) {
        return {
            refresh,
            result: {
                status: "stale",
                data: data,
                error: null,
                pending: true,
            },
        };
    }

    if (pending) {
        return {
            refresh,
            result: {
                status: "pending",
                data: null,
                error: null,
                pending: true,
            },
        };
    }

    if (error) {
        return {
            refresh,
            result: {
                status: "error",
                data: null,
                error: error,
                pending: false,
            },
        };
    }

    if (data) {
        return {
            refresh,
            result: {
                status: "data",
                data: data,
                error: null,
                pending: false,
            },
        };
    }

    return {
        refresh,
        result: {
            status: "setup",
            data: null,
            error: null,
            pending: false,
        },
    };
}
