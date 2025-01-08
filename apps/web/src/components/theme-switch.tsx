import { Icon } from "@iconify/react/dist/iconify.js";
import styles from "../styles/theme-switch.module.css";
import { useContext, useState } from "react";
import { themeContext, themeDispatchContext } from "../stores/theme";
import Switch from "../ui/switch";

export default function ThemeSwitch() {
    const theme = useContext(themeContext);
    const themeDispatch = useContext(themeDispatchContext);
    const [toggleOn, setToggleOn] = useState(theme == "light" ? false : true);

    const handleThemeToggle = () => {
        themeDispatch("toggle");
        setToggleOn(t => !t);
    };

    return (
        <Switch
            size="md"
            variant="neutral"
            on={toggleOn}
            onToggle={handleThemeToggle}
            offSlot={
                <Icon
                    className={styles.themeSwitchIcon}
                    icon={"solar:sun-bold"}
                />
            }
            onSlot={
                <Icon
                    className={styles.themeSwitchIcon}
                    icon={"solar:moon-bold"}
                />
            }
        />
    );
}
