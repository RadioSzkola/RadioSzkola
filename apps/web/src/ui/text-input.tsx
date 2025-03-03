import { useState } from "react";
import styles from "../styles/text-input.module.css";

export type TextInputProps = {
    id?: string;
    value?: string;
    label?: string;
    variant?: "valid" | "error" | "neutral";
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    type?: "text" | "email" | "password";
    errors?: string[];
    required?: boolean;
};

export default function TextInput({
    id,
    value,
    label,
    variant = "neutral",
    onChange,
    type = "text",
    errors,
    required = false,
}: TextInputProps) {
    const [isInputActive, setIsInputActive] = useState(false);

    return (
        <div className={styles.textInputContainer}>
            <div
                className={
                    styles.textInputWraper +
                    " " +
                    (!variant ? styles.textInputWraper__neutral : "") +
                    " " +
                    (variant === "error" ? styles.textInputWraper__error : "") +
                    " " +
                    (variant === "valid" ? styles.textInputWraper__valid : "")
                }
            >
                <input
                    type={type}
                    id={id}
                    name={id}
                    className={
                        styles.textInput +
                        " " +
                        (variant === "neutral"
                            ? styles.textInput__neutral
                            : "") +
                        " " +
                        (variant === "error" ? styles.textInput__error : "") +
                        " " +
                        (variant === "valid" ? styles.textInput__valid : "")
                    }
                    defaultValue={value}
                    onChange={ev => {
                        if (ev.target.value === "") {
                            setIsInputActive(false);
                        } else {
                            setIsInputActive(true);
                        }

                        if (onChange) {
                            onChange(ev);
                        }
                    }}
                />
                <label
                    className={
                        styles.textInputLabel +
                        " " +
                        (variant === "neutral"
                            ? styles.textInputLabel__neutral
                            : "") +
                        " " +
                        (variant === "error"
                            ? styles.textInputLabel__error
                            : "") +
                        " " +
                        (variant === "valid"
                            ? styles.textInputLabel__valid
                            : "") +
                        " " +
                        (isInputActive
                            ? styles.textInputLabel__active
                            : styles.textInputLabel__hidden)
                    }
                    htmlFor={id}
                >
                    {(required ? "*" : "") + label}
                </label>
            </div>

            {errors ? (
                <div className={styles.textInputErrors}>
                    {errors.map((e, i) => (
                        <span key={e} className={styles.textInputErrorBox}>
                            {e + (i < errors.length - 1 ? ", " : "")}
                        </span>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
