import React, { useEffect } from "react";
import styles from "../styles/auth-form.module.css";
import Button from "../ui/button";
import { useLogoutQuery, useUser } from "../hooks/auth";
import { QueryStatus } from "../hooks/api";

export type LogoutFormProps = {
    setStatus?: React.Dispatch<React.SetStateAction<QueryStatus>>;
};

export default function LogoutForm({
    setStatus: externalSetStatus,
}: LogoutFormProps) {
    const {
        logout,
        result: { data, error, pending, status },
    } = useLogoutQuery();

    const { refreshSession } = useUser();

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        logout();
    }

    useEffect(() => {
        if (externalSetStatus) {
            externalSetStatus(status);
        }

        if (status === "data") {
            console.log("Logged out", data);
            refreshSession();
        }

        console.log({ status, error, pending, data });
    }, [status]);

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Button type="submit">Wyloguj się!</Button>
        </form>
    );
}
