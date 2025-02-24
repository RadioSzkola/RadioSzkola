import { useEffect, useState } from "react";
import styles from "../styles/logout-form.module.css";
import Button from "../ui/button";
import { AppError } from "@rs/shared/error";
import { useAPIEndpoint } from "../hooks/api";
import { useUser } from "../hooks/auth";

export default function LogoutForm() {
    const {
        call: apiCall,
        data: apiData,
        error: apiError,
        pending: apiPending,
        status: apiStatus,
    } = useAPIEndpoint({
        endpoint: "/v1/auth/web/logout",
        method: "POST",
    });

    const { refresh } = useUser();

    const [error, setError] = useState<AppError | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [submited, setSubmited] = useState<boolean>(false);

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        if (!error && submited) {
            return;
        }

        setSubmited(false);
        apiCall();
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
        <form onSubmit={handleSubmit} className={styles.logoutForm}>
            <Button size="md" variant="neutral" animated={true} type="submit">
                Wyloguj się
            </Button>

            {success ? (
                <div className={styles.logoutFormSuccessMessage}>Sukces!</div>
            ) : (
                <></>
            )}

            {apiPending ? (
                <div className={styles.logoutFormPendingMessage}>
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
                                <div className={styles.logoutFormErrorMessage}>
                                    Niepoprawne dane
                                </div>
                            );
                        case "AUTHENTICATION":
                            return (
                                <div className={styles.logoutFormErrorMessage}>
                                    Niepoprawne dane
                                </div>
                            );
                        default:
                            console.error({ error });
                            return (
                                <div className={styles.logoutFormErrorMessage}>
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
