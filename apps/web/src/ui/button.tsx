import styles from "../styles/button.module.css";

export type ButtonProps = {
    label?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    type?: "button" | "reset" | "submit";
};

export default function Button({
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
                ${className ? className : ""}
                `}
            onClick={onClick}
            aria-label={label}
        >
            {children}
        </button>
    );
}
