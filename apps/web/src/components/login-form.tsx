import { useEffect, useState } from "react";
import styles from "../styles/login-form.module.css";
import Button from "../ui/button";
import EmailInput from "../ui/email-input";
import PasswordInput from "../ui/password-input";
import { parseBySchema } from "@rs/shared/validation";
import { UserLogin, userLoginSchema } from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { useAPIEndpoint } from "../hooks/api";
import { useUser } from "../hooks/auth";

export type LoginFormProps = {
    errorFieldClass?: string;
};

export default function LoginForm({ errorFieldClass }: LoginFormProps) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const {
        call: apiCall,
        error: apiError,
        pending: apiPending,
        status: apiStatus,
    } = useAPIEndpoint({
        endpoint: "/v1/auth/web/login",
        method: "POST",
    });

    const { refresh } = useUser();

    const [error, setError] = useState<AppError<UserLogin> | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [submited, setSubmited] = useState<boolean>(false);

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        if (!error && submited) {
            return;
        }

        setSubmited(false);
        const validation = parseBySchema(
            {
                email,
                password,
            },
            userLoginSchema,
        );

        if (validation.error) {
            setError({
                code: "VALIDATION",
                data: validation.error,
            });

            return;
        }

        apiCall(validation.data);
        setSubmited(true);
    }

    useEffect(() => {
        if (apiStatus === "error") {
            setError(apiError);
            setSuccess(false);
        } else if (apiStatus === "data") {
            setError(null);
            setSuccess(true);
            refresh();
        }
    }, [apiStatus]);

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <EmailInput
                id="email"
                label="email"
                variant={
                    error?.code === "VALIDATION" && error.data.email
                        ? "error"
                        : "neutral"
                }
                value=""
                onChange={ev => setEmail(ev.target.value)}
            />
            {error?.code === "VALIDATION" && error.data.email ? (
                <span
                    className={`${styles.loginFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
                >
                    {error.data.email[0]}
                </span>
            ) : (
                <></>
            )}
            <PasswordInput
                id="password"
                label="hasło"
                variant={
                    error?.code === "VALIDATION" && error.data.password
                        ? "error"
                        : "neutral"
                }
                value=""
                onChange={ev => setPassword(ev.target.value)}
            />
            {error?.code === "VALIDATION" && error.data.password ? (
                <span
                    className={`${styles.loginFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
                >
                    {error.data.password[0]}
                </span>
            ) : (
                <></>
            )}

            <Button size="md" variant="neutral" animated={true} type="submit">
                Zaloguj się
            </Button>

            {success ? (
                <div className={styles.loginFormSuccessMessage}>Sukces!</div>
            ) : (
                <></>
            )}

            {apiPending ? (
                <div className={styles.loginFormPendingMessage}>
                    Ładowanie...
                </div>
            ) : (
                <></>
            )}

            {error ? (
                (() => {
                    switch (error.code) {
                        case "VALIDATION":
                            return <></>;
                        case "DATABASE":
                            return (
                                <div className={styles.loginFormErrorMessage}>
                                    Niepoprawne dane
                                </div>
                            );
                        case "AUTHENTICATION":
                            return (
                                <div className={styles.loginFormErrorMessage}>
                                    Niepoprawne dane
                                </div>
                            );
                        default:
                            console.error({ error });
                            return (
                                <div className={styles.loginFormErrorMessage}>
                                    Straszne rzeczy, straszny błąd!
                                </div>
                            );
                    }
                })()
            ) : (
                <></>
            )}
        </form>
    );
}
