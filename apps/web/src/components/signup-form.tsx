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

export default function SignupForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [authId, setAuthId] = useState("");
    const [email, setEmail] = useState("");

    const signupIdEndpoint = useAPIEndpoint({
        endpoint: "/v1/auth/web/signupid",
        method: "POST",
    });
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

        signupIdEndpoint.call(validation.data);
        setSubmited(true);
    }

    useEffect(() => {
        if (!error && submited) {
            setSuccess(true);
        }

        console.log({ error });
    }, [error]);

    return (
        <form onSubmit={handleSubmit} className={styles.signupForm}>
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
            />
            {error?.code === "VALIDATION" && error.data.email ? (
                <span className={styles.signupFormErrorField}>
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
            />
            {error?.code === "VALIDATION" && error.data.password ? (
                <span className={styles.signupFormErrorField}>
                    {error.data.password[0]}
                </span>
            ) : (
                <></>
            )}
            <TextInput
                id="authId"
                label="kod"
                size="md"
                variant={
                    error?.code === "VALIDATION" && error.data.authId
                        ? "error"
                        : "neutral"
                }
                value=""
                onInputChange={ev => setAuthId(ev.currentTarget.value)}
            />
            {error?.code === "VALIDATION" && error.data.authId ? (
                <span className={styles.signupFormErrorField}>
                    {error.data.authId[0]}
                </span>
            ) : (
                <></>
            )}
            <TextInput
                id="schoolId"
                label="kod szkoły"
                size="md"
                variant={
                    error?.code === "VALIDATION" && error.data.schoolId
                        ? "error"
                        : "neutral"
                }
                value=""
                onInputChange={ev => setSchoolId(ev.currentTarget.value)}
            />
            {error?.code === "VALIDATION" && error.data.schoolId ? (
                <span className={styles.signupFormErrorField}>
                    {error.data.schoolId[0]}
                </span>
            ) : (
                <></>
            )}
            <TextInput
                id="name"
                label="imię i nazwisko"
                size="md"
                variant={
                    error?.code === "VALIDATION" && error.data.name
                        ? "error"
                        : "neutral"
                }
                value=""
                onInputChange={ev => setName(ev.currentTarget.value)}
            />
            {error?.code === "VALIDATION" && error.data.name ? (
                <span className={styles.signupFormErrorField}>
                    {error.data.name[0]}
                </span>
            ) : (
                <></>
            )}
            <Button size="md" variant="neutral" animated={true} type="submit">
                Zarejestruj się
            </Button>
        </form>
    );
}
