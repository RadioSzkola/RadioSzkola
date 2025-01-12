import styles from "../styles/switch.module.css";

type ToggleProps = {
    on: boolean;
    size: "sm" | "md" | "lg";
    variant: "neutral" | "inverted";
    onToggle?: () => void;
    offSlot?: React.ReactElement;
    onSlot?: React.ReactElement;
};

export default function Switch({
    on,
    size,
    variant,
    onToggle,
    offSlot,
    onSlot,
}: ToggleProps) {
    return (
        <button
            onClick={onToggle}
            role="switch"
            aria-checked={false}
            tabIndex={0}
            className={`
                ${styles.switch}
                ${size === "sm" ? styles.switch__sm : ""}
                ${size === "md" ? styles.switch__md : ""}
                ${size === "lg" ? styles.switch__lg : ""}
                ${variant === "neutral" ? styles.switch__neutral : ""}
                ${variant === "inverted" ? styles.switch__inverted : ""}
            `}
        >
            <span className={`${styles.switchSlot}`}>{offSlot && offSlot}</span>
            <span className={`${styles.switchSlot}`}>{onSlot && onSlot}</span>
            <span
                className={`
                    ${styles.switchDot}
                    ${on ? styles.switchDot__on : styles.switchDot__off}
                `}
            ></span>
        </button>
    );
}
