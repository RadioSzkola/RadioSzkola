import ImgLogoLight from "../img/logo-light.png";
import ImgLogoDark from "../img/logo-dark.png";
import styles from "../styles/logo.module.css";

import { useContext } from "react";
import { themeContext } from "../stores/theme";

export default function Logo() {
    const theme = useContext(themeContext);

    return (
        <div className={styles.logo}>
            {theme === "light" ? (
                <img
                    src={ImgLogoLight}
                    alt="jasne logo"
                    className={styles.logoImg}
                />
            ) : (
                <img
                    src={ImgLogoDark}
                    alt="ciemne logo"
                    className={styles.logoImg}
                />
            )}
        </div>
    );
}
