import React, { useEffect, useState } from "react";
import styles from "../styles/auth-form.module.css";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import { useSignupIdQuery, useUser } from "../hooks/auth";
import { QueryStatus } from "../hooks/api";

export type SignupFormProps = {
    setStatus?: React.Dispatch<React.SetStateAction<QueryStatus>>;
};

export default function SignupForm({
    setStatus: externalSetStatus,
}: SignupFormProps) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [schoolId] = useState("mickiewicz");
    const [authId, setAuthId] = useState("");
    const [email, setEmail] = useState("");

    const {
        signup,
        result: { data, error, pending, status },
    } = useSignupIdQuery();

    const { refreshSession } = useUser();

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();

        signup({ name, email, authId, password, schoolId });
    }

    useEffect(() => {
        if (externalSetStatus) {
            externalSetStatus(status);
        }

        if (status === "data") {
            console.log("Signed up", data);
            refreshSession();
        }

        console.log({ status, error, pending, data });
    }, [status]);

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <TextInput
                required
                type="text"
                id="name"
                label="imię"
                variant={
                    error?.code === "VALIDATION" && error.data.name
                        ? "error"
                        : "neutral"
                }
                errors={
                    error?.code === "VALIDATION" && error.data.name
                        ? error.data.name
                        : undefined
                }
                onChange={ev => setName(ev.target.value)}
            />
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
            <TextInput
                required
                type="text"
                id="schoolId"
                label="identyfikator szkoły"
                variant={
                    error?.code === "VALIDATION" && error.data.authId
                        ? "error"
                        : "neutral"
                }
                errors={
                    error?.code === "VALIDATION" && error.data.authId
                        ? error.data.authId
                        : undefined
                }
                onChange={ev => setAuthId(ev.target.value)}
            />
            <Button type="submit">Zarejestruj się!</Button>
        </form>
    );
}
