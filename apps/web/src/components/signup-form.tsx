import { useEffect, useState } from "react";
import styles from "../styles/signup-form.module.css";
import Button from "../ui/button";
import EmailInput from "../ui/email-input";
import PasswordInput from "../ui/password-input";
import TextInput from "../ui/text-input";
import { parseBySchema } from "@rs/shared/validation";
import { SignupId, signupIdSchema } from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { useAPIEndpoint } from "../hooks/api";
import { useUser } from "../hooks/auth";

export type SignupFormProps = {
    labelClass?: string;
    errorFieldClass?: string;
};

export default function SignupForm({ errorFieldClass }: SignupFormProps) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [authId, setAuthId] = useState("");
    const [email, setEmail] = useState("");

    const {
        call: apiCall,
        error: apiError,
        pending: apiPending,
        status: apiStatus,
    } = useAPIEndpoint({
        endpoint: "/v1/auth/web/signupid",
        method: "POST",
    });

    const { refresh } = useUser();

    const [error, setError] = useState<AppError<SignupId> | null>(null);
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
                name,
                password,
                schoolId,
                authId,
                email,
            },
            signupIdSchema,
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
        <form onSubmit={handleSubmit} className={styles.signupForm}>
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
                    className={`${styles.signupFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
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
                    className={`${styles.signupFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
                >
                    {error.data.password[0]}
                </span>
            ) : (
                <></>
            )}
            <TextInput
                id="authId"
                label="kod"
                variant={
                    error?.code === "VALIDATION" && error.data.authId
                        ? "error"
                        : "neutral"
                }
                value=""
                onChange={ev => setAuthId(ev.target.value)}
            />
            {error?.code === "VALIDATION" && error.data.authId ? (
                <span
                    className={`${styles.signupFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
                >
                    {error.data.authId[0]}
                </span>
            ) : (
                <></>
            )}
            <TextInput
                id="schoolId"
                label="kod szkoły"
                variant={
                    error?.code === "VALIDATION" && error.data.schoolId
                        ? "error"
                        : "neutral"
                }
                value=""
                onChange={ev => setSchoolId(ev.target.value)}
            />
            {error?.code === "VALIDATION" && error.data.schoolId ? (
                <span
                    className={`${styles.signupFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
                >
                    {error.data.schoolId[0]}
                </span>
            ) : (
                <></>
            )}
            <TextInput
                id="name"
                label="imię i nazwisko"
                variant={
                    error?.code === "VALIDATION" && error.data.name
                        ? "error"
                        : "neutral"
                }
                value=""
                onChange={ev => setName(ev.target.value)}
            />
            {error?.code === "VALIDATION" && error.data.name ? (
                <span
                    className={`${styles.signupFormErrorField} ${errorFieldClass ? errorFieldClass : ""}`}
                >
                    {error.data.name[0]}
                </span>
            ) : (
                <></>
            )}
            <Button size="md" variant="neutral" animated={true} type="submit">
                Zarejestruj się
            </Button>

            {success ? (
                <div className={styles.signupFormSuccessMessage}>Sukces!</div>
            ) : (
                <></>
            )}

            {apiPending ? (
                <div className={styles.signupFormPendingMessage}>
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
                                <div className={styles.signupFormErrorMessage}>
                                    Niepoprawne dane
                                </div>
                            );
                        case "AUTHENTICATION":
                            return (
                                <div className={styles.signupFormErrorMessage}>
                                    Niepoprawne dane
                                </div>
                            );
                        default:
                            console.error({ error });
                            return (
                                <div className={styles.signupFormErrorMessage}>
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
