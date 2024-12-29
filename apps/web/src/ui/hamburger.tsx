import styles from "../styles/hamburger.module.css";

export type HamburgerProps = {
    open?: boolean;
    colorInverted?: boolean;
    onClick?: () => void;
    className?: string;
    orientation: "left" | "right";
};

export default function Hamburger({
    open,
    colorInverted,
    className,
    onClick,
    orientation,
}: HamburgerProps) {
    return (
        <button
            onClick={onClick}
            className={`
                ${styles.hamburger}
                ${colorInverted ? styles.hamburgerDash__colorInverted : ""}
                ${orientation === "right" ? styles.hamburger__right : styles.hamburger__left}
            `}
        >
            <span
                className={`
                ${styles.hamburgerDash}
                ${open ? styles.hamburgerDash__width100 : ""}
            `}
            ></span>
            <span
                className={`
                ${styles.hamburgerDash}
                ${open ? styles.hamburgerDash__width70 : ""}
            `}
            ></span>
            <span
                className={`
                ${styles.hamburgerDash}
                ${open ? styles.hamburgerDash__width40 : ""}
            `}
            ></span>
        </button>
    );
}
