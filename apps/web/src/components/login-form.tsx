import { useEffect, useState } from "react";
import styles from "../styles/login-form.module.css";
import Button from "../ui/button";
import EmailInput from "../ui/email-input";
import PasswordInput from "../ui/password-input";
import { parseBySchema } from "@rs/shared/validation";
import { UserLogin, userLoginSchema } from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { useAPIEndpoint } from "../hooks/api";

export type LoginFormProps = {
    labelClass?: string;
    errorFieldClass?: string;
};

export default function LoginForm({
    labelClass,
    errorFieldClass,
}: LoginFormProps) {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const loginEndpoint = useAPIEndpoint({
        endpoint: "/v1/auth/web/login",
        method: "POST",
    });

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

        loginEndpoint.call(validation.data);
        setSubmited(true);
    }

    useEffect(() => {
        if (!error && submited) {
            setSuccess(true);
        }

        console.log({ loginEndpoint });
    }, [loginEndpoint.status]);

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <EmailInput
                id="email"
                label="email"
                size="md"
                variant={
                    error?.code === "VALIDATION" && error.data.email
                        ? "error"
                        : "neutral"
                }
                value=""
                onInputChange={ev => setEmail(ev.currentTarget.value)}
                labelClass={labelClass}
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
                size="md"
                variant={
                    error?.code === "VALIDATION" && error.data.password
                        ? "error"
                        : "neutral"
                }
                value=""
                onInputChange={ev => setPassword(ev.currentTarget.value)}
                labelClass={labelClass}
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
            <Button size="md" variant="neutral" animated={true} type="submit">
                Zaloguj się
            </Button>
        </form>
    );
}
