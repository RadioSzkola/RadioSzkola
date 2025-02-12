import { useState } from "react";
import styles from "../styles/password-input.module.css";

export type PasswordInputProps = {
    id: string;
    value: string;
    label: string;
    onInputChange?: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
    size: "sm" | "md" | "lg";
    variant: "neutral" | "error" | "ok";
};

export default function PasswordInput({
    id,
    value,
    label,
    onInputChange,
    size,
    variant,
}: PasswordInputProps) {
    const [touched, setTouched] = useState<boolean>(false);

    return (
        <div
            className={`
            ${styles.textInputWraper}
            ${variant === "neutral" ? styles.textInputWraper__neutral : ""}
            ${variant === "error" ? styles.textInputWraper__error : ""}
            ${variant === "ok" ? styles.textInputWraper__ok : ""}
            ${size === "sm" ? styles.textInputWraper__sm : ""}
            ${size === "md" ? styles.textInputWraper__md : ""}
            ${size === "lg" ? styles.textInputWraper__lg : ""}
        `}
        >
            <input
                type="password"
                id={id}
                name={id}
                className={styles.textInput}
                defaultValue={value}
                onKeyDown={ev => {
                    setTouched(true);
                    if (onInputChange) {
                        onInputChange(ev);
                    }
                }}
            />
            <label
                className={`
                ${styles.textInputLabel}
                ${touched ? styles.textInputLabel__touched : styles.textInputLabel__placeholder}
            `}
                htmlFor={id}
            >
                {label}
            </label>
        </div>
    );
}
