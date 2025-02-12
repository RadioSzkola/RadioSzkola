import { useState } from "react";
import styles from "../styles/signup-form.module.css";
import Button from "../ui/button";
import EmailInput from "../ui/email-input";
import PasswordInput from "../ui/password-input";
import TextInput from "../ui/text-input";

export default function SignupForm() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [authId, setAuthId] = useState("");
    const [email, setEmail] = useState("");

    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        console.log(ev);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.signupForm}>
            <EmailInput
                id="email"
                label="email"
                size="md"
                variant="neutral"
                value=""
                onInputChange={ev => setEmail(ev.currentTarget.value)}
            />
            <PasswordInput
                id="password"
                label="password"
                size="md"
                variant="neutral"
                value=""
                onInputChange={ev => setPassword(ev.currentTarget.value)}
            />
            <TextInput
                id="schoolId"
                label="schoolId"
                size="md"
                variant="neutral"
                value=""
                onInputChange={ev => setSchoolId(ev.currentTarget.value)}
            />
            <TextInput
                id="name"
                label="name"
                size="md"
                variant="neutral"
                value=""
                onInputChange={ev => setName(ev.currentTarget.value)}
            />
            <Button size="md" variant="neutral" animated={true} type="submit">
                Zarejestruj się
            </Button>
        </form>
    );
}
