import { Icon } from "@iconify/react/dist/iconify.js";
import styles from "../styles/theme-switch.module.css";
import { useContext } from "react";
import { themeContext, themeDispatchContext } from "../stores/theme";

export default function ThemeSwitch() {
    const theme = useContext(themeContext);
    const themeDispatch = useContext(themeDispatchContext);

    const handleThemeToggle = () => {
        themeDispatch("toggle");
    };

    return (
        <button
            onClick={handleThemeToggle}
            className={styles.themeSwitch}
            role="switch"
            aria-checked="false"
            tabIndex={0}
        >
            <Icon className={styles.themeSwitchIcon} icon="" />
            <Icon className={styles.themeSwitchIcon} icon="" />
            <span className={styles.themeSwitchTrigger}></span>
        </button>
    );
}
