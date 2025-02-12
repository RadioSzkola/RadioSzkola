import { AppError } from "@rs/shared/error";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { SERVER_HOST } from "../const";
import { useEffect, useState } from "react";

export type APICallProps = {
    endpoint: string;
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT";
    axiosRequestConfig?: AxiosRequestConfig;
};

export async function fetchAPI<T>({
    endpoint,
    method,
    axiosRequestConfig,
}: APICallProps): Promise<
    { data: T; error: null } | { data: null; error: AppError }
> {
    try {
        const response = await axios(SERVER_HOST + endpoint, {
            timeout: 5000,
            ...axiosRequestConfig,
            method,
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

export function useAPI<T>(fetchProps: APICallProps):
    | {
          data: T;
          error: null;
          pending: false;
          call: () => void;
      }
    | {
          data: null;
          error: null;
          pending: true;
          call: () => void;
      }
    | {
          data: null;
          error: AppError;
          pending: false;
          call: () => void;
      } {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AppError | null>(null);
    const [pending, setPending] = useState<boolean>(true);
    const [initial, setInitial] = useState<boolean>(true);

    const call = () => {
        if (pending && !initial) {
            console.error("Cannot call API if another call is pending");
            return;
        }

        setPending(true);
        fetchAPI<T>(fetchProps)
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

                console.error(e);
                setData(null);
                setError(e);
            })
            .finally(() => {
                setPending(false);
            });
    };

    useEffect(() => {
        call();
        setInitial(false);
    }, []);

    if (error) {
        return {
            data: null,
            error: error,
            pending: false,
            call,
        };
    }

    if (data) {
        return {
            data: data,
            error: null,
            pending: false,
            call,
        };
    }

    return {
        data: null,
        error: null,
        pending: true,
        call,
    };
}
