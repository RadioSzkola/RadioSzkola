import React, { useEffect, useState } from "react";
import styles from "../styles/auth-form.module.css";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import { useLoginQuery, useUser } from "../hooks/auth";
import { QueryStatus } from "../hooks/api";

export type LoginFormProps = {
    setStatus?: React.Dispatch<React.SetStateAction<QueryStatus>>;
};

export default function LoginForm({
    setStatus: externalSetStatus,
}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        login,
        result: { data, error, pending, status },
    } = useLoginQuery();

    const { refreshSession } = useUser();

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        login({ email, password });
    }

    useEffect(() => {
        if (externalSetStatus) {
            externalSetStatus(status);
        }

        if (status === "data") {
            console.log("Logged in", data);
            refreshSession();
        }

        console.log({ status, error, pending, data });
    }, [status]);

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <TextInput
                required
                type="email"
                id="email"
                label="email"
                variant={
                    error?.code === "VALIDATION" && error.data.email
                        ? "error"
                        : "neutral"
                }
                errors={
                    error?.code === "VALIDATION" && error.data.email
                        ? error.data.email
                        : undefined
                }
                onChange={ev => setEmail(ev.target.value)}
            />
            <TextInput
                required
                type="password"
                id="password"
                label="hasło"
                variant={
                    error?.code === "VALIDATION" && error.data.password
                        ? "error"
                        : "neutral"
                }
                errors={
                    error?.code === "VALIDATION" && error.data.password
                        ? error.data.password
                        : undefined
                }
                onChange={ev => setPassword(ev.target.value)}
            />
            <Button type="submit">Zaloguj się!</Button>
        </form>
    );
}
