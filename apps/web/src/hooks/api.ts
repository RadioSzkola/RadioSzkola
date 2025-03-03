import { AppError } from "@rs/shared/error";
import axios, { AxiosError } from "axios";
import { SERVER_HOST } from "../const";
import { useEffect, useRef, useState } from "react";

export type APIFetchConfig<Payload = any> = {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
    payload?: Payload;
    timeout?: number;
    withCredentials?: boolean;
    params?: Record<string, string>;
    signal?: AbortSignal;
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
    signal,
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
            signal,
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

export type QueryResult<Response = any, Payload = any> =
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
          error: AppError<Payload>;
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
    retries?: number;
    retryAfter?: number;
    initial?: boolean;
};

export function useAPIQuery<Response, Payload = any>(
    fetchConfig: APIFetchConfig<Payload>,
    { retries = 3, retryAfter = 500, initial = true }: QueryConfig = {
        retries: 3,
        retryAfter: 500,
        initial: true,
    },
): {
    result: QueryResult<Response, Payload>;
    refresh: (refreshConfig?: {
        payload?: Payload;
        params?: Record<string, string>;
    }) => void;
    abort: () => void;
} {
    if (retries < 0) {
        throw new Error("Retries must be a non-negative number");
    }

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<AppError | null>(null);
    const [data, setData] = useState<Response | null>(null);

    const abortController = useRef<AbortController | null>(null);

    const createAbortController = () => {
        abortController.current = new AbortController();
        return abortController.current.signal;
    };

    const abort = () => {
        if (abortController.current) {
            abortController.current.abort();
        }

        abortController.current = null;
    };

    useEffect(() => {
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        };
    }, []);

    const refresh = (
        {
            payload = undefined,
            params = undefined,
        }: {
            payload?: Payload;
            params?: Record<string, string>;
        } = {
            payload: undefined,
            params: undefined,
        },
    ) => {
        setPending(true);
        const signal = createAbortController();

        const call = (retriesLeft: number) => {
            APIFetch<Response, Payload>({
                ...fetchConfig,
                payload: payload ?? fetchConfig.payload,
                params: params ?? fetchConfig.params,
                signal,
            })
                .then(res => {
                    if (res.data) {
                        setData(res.data);
                        setError(null);
                    } else {
                        setError(res.error);
                        setData(null);

                        if (retriesLeft > 0) {
                            setTimeout(() => {
                                call(retriesLeft - 1);
                            }, retryAfter);
                        }
                    }
                })
                .catch(err => {
                    setError({
                        code: "UNKNOWN",
                        message: "An unexepected error (useAPIQuery)",
                        data: err,
                    });
                    setData(null);

                    if (retriesLeft > 0) {
                        setTimeout(() => {
                            call(retriesLeft - 1);
                        }, retryAfter);
                    }
                })
                .finally(() => {
                    setPending(false);
                });
        };

        call(retries);
    };

    useEffect(() => {
        if (initial) {
            setPending(true);
            refresh();
        }
    }, []);

    if (pending && data) {
        return {
            refresh,
            abort,
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
            abort,
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
            abort,
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
            abort,
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
        abort,
        result: {
            status: "setup",
            data: null,
            error: null,
            pending: false,
        },
    };
}
