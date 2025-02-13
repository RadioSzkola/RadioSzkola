import { useEffect, useState } from "react";
import styles from "../styles/logout-form.module.css";
import Button from "../ui/button";
import EmailInput from "../ui/email-input";
import PasswordInput from "../ui/password-input";
import { parseBySchema } from "@rs/shared/validation";
import { UserLogin, userLoginSchema } from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { useAPIEndpoint } from "../hooks/api";

export default function LogoutForm() {
    const logoutEndpoint = useAPIEndpoint({
        endpoint: "/v1/auth/web/logout",
        method: "POST",
    });

    const [error, setError] = useState<AppError | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [submited, setSubmited] = useState<boolean>(false);

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setSubmited(false);
        logoutEndpoint.call();
        setSubmited(true);
    }

    useEffect(() => {
        if (!error && submited) {
            setSuccess(true);
        }

        if (logoutEndpoint.error) {
            setError(logoutEndpoint.error);
            setSuccess(false);
            console.error({ error });
        } else if (logoutEndpoint.data) {
            setError(null);
            setSuccess(true);
        } else {
            setError(null);
            setSuccess(false);
        }

        console.log({ loginEndpoint: logoutEndpoint });
    }, [logoutEndpoint.status]);

    return (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <Button size="md" variant="neutral" animated={true} type="submit">
                Wyloguj się
            </Button>
        </form>
    );
}
