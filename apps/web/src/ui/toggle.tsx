import styles from "../styles/toggle.module.css";

type ToggleProps = {
    on: boolean;
    onToggle?: () => void;
    offSlot?: React.ReactElement;
    onSlot?: React.ReactElement;
    rootClass?: string;
    rootClassOn?: string;
    rootClassOff?: string;
};

export default function Toggle({
    on,
    onToggle,
    offSlot,
    onSlot,
    rootClass,
    rootClassOn,
    rootClassOff,
}: ToggleProps) {
    return (
        <button
            onClick={onToggle}
            role="switch"
            aria-checked={false}
            tabIndex={0}
            className={`
                ${styles.toggle}
                ${rootClass ? rootClass : ""}
                ${on ? styles.toggle__on : styles.toggle__off}
                ${on ? rootClassOn : rootClassOff}
            `}
        >
            <span className={`${styles.slot}`}>{offSlot && offSlot}</span>
            <span className={`${styles.slot}`}>{onSlot && onSlot}</span>
            <span
                className={`
                    ${styles.toggleSwitch}
                    ${on ? styles.toggleSwitch__on : styles.toggleSwitch__off}
                `}
            ></span>
        </button>
    );
}
