import { AppError } from "@rs/shared/error";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SERVER_HOST } from "../const";
import { useState } from "react";

export type APICallProps = {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
    body?: any;
    axiosRequestConfig?: AxiosRequestConfig;
};

export async function fetchFromAPI<T>({
    endpoint,
    method,
    body,
    axiosRequestConfig,
}: APICallProps): Promise<
    { data: T; error: null } | { data: null; error: AppError }
> {
    try {
        const response = await axios(SERVER_HOST + endpoint, {
            timeout: 5000,
            method,
            data: body,
            withCredentials: true,
            ...axiosRequestConfig,
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

export type UseAPIEndpointStatus = "data" | "error" | "stale" | "pending";

export function useAPIEndpoint<T>(fetchProps: APICallProps):
    | {
          data: T;
          error: null;
          pending: false;
          call: (data?: unknown) => void;
          status: "data";
      }
    | {
          data: null;
          error: null;
          pending: true;
          call: (data?: unknown) => void;
          status: "pending";
      }
    | {
          data: null;
          error: AppError;
          pending: false;
          call: (data?: unknown) => void;
          status: "error";
      }
    | {
          data: null;
          error: null;
          pending: false;
          call: (data?: unknown) => void;
          status: "stale";
      } {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AppError | null>(null);
    const [pending, setPending] = useState<boolean>(false);

    const call = (data?: unknown) => {
        if (pending) {
            console.error("Cannot call API if another call is pending");
            return;
        }

        setPending(true);

        const promise =
            data === null
                ? fetchFromAPI<T>(fetchProps)
                : fetchFromAPI<T>({ ...fetchProps, body: data });

        promise
            .then(response => {
                if (response.error) {
                    setData(null);
                    setError(response.error);
                } else {
                    setData(response.data);
                    setError(null);
                }
            })
            .catch(reason => {
                const e: AppError = {
                    code: "UNKNOWN",
                    data: reason,
                };

                setData(null);
                setError(e);
            })
            .finally(() => {
                setPending(false);
            });
    };

    if (error) {
        return {
            data: null,
            error: error,
            pending: false,
            call,
            status: "error",
        };
    }

    if (data) {
        return {
            data: data,
            error: null,
            pending: false,
            call,
            status: "data",
        };
    }

    if (pending) {
        return {
            data: null,
            error: null,
            pending: pending,
            call,
            status: "pending",
        };
    }

    return {
        data: null,
        error: null,
        pending: false,
        call,
        status: "stale",
    };
}
