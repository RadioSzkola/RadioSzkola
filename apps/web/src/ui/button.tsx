import styles from "../styles/button.module.css";

export type ButtonProps = {
    size: "sm" | "md" | "lg";
    variant: "neutral" | "inverted" | "primary" | "secondary";
    animated?: boolean;
    label?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    type?: "button" | "reset" | "submit";
};

export default function Button({
    size,
    variant,
    animated,
    label,
    onClick,
    children,
    className,
    type,
}: ButtonProps) {
    return (
        <button
            type={type ?? "button"}
            className={`
                ${styles.button}
                ${size === "sm" ? styles.button__sm : ""}
                ${size === "md" ? styles.button__md : ""}
                ${size === "lg" ? styles.button__lg : ""}
                ${variant === "neutral" ? styles.button__neutral : ""}
                ${variant === "inverted" ? styles.button__inverted : ""}
                ${variant === "primary" ? styles.button__primary : ""}
                ${variant === "secondary" ? styles.button__secondary : ""}
                ${animated ? styles.button__animated : ""}
                ${className ? className : ""}
                `}
            onClick={onClick}
            aria-label={label}
        >
            {children}
        </button>
    );
}
