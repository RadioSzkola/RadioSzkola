import { useState } from "react";
import styles from "../styles/email-input.module.css";

export type EmailInputProps = {
    id: string;
    value: string;
    label: string;
    onInputChange?: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
    size: "sm" | "md" | "lg";
    variant: "neutral" | "error" | "ok";
    labelClass?: string;
};

export default function EmailInput({
    id,
    value,
    label,
    onInputChange,
    size,
    variant,
    labelClass,
}: EmailInputProps) {
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
                type="email"
                name={id}
                id={id}
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
                    ${labelClass ? labelClass : ""}
                    ${variant === "error" ? "error" : ""}
                `}
                htmlFor={id}
            >
                {label}
            </label>
        </div>
    );
}
