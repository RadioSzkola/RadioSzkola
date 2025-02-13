import ImgLogoLight from "../img/logo-light.png";
import ImgLogoDark from "../img/logo-dark.png";
import styles from "../styles/logo.module.css";

import { useContext } from "react";
import { Theme, themeContext } from "../stores/theme";

export type LogoProps = {
    theme?: Theme;
    imgClass?: string;
};

export default function Logo({ theme: providedTheme, imgClass }: LogoProps) {
    const theme = providedTheme ? providedTheme : useContext(themeContext);

    return (
        <div className={styles.logo}>
            {theme === "light" ? (
                <img
                    src={ImgLogoLight}
                    alt="jasne logo"
                    className={`${styles.logoImg} ${imgClass ? imgClass : ""}`}
                />
            ) : (
                <img
                    src={ImgLogoDark}
                    alt="ciemne logo"
                    className={`${styles.logoImg} ${imgClass ? imgClass : ""}`}
                />
            )}
        </div>
    );
}
