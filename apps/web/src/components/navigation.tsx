import { useEffect, useState } from "react";
import Hamburger from "../ui/hamburger";

import styles from "../styles/navigation.module.css";
import Modal from "../ui/modal";
import ThemeSwitch from "./theme-switch";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../ui/logo";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMenuOpen(open => !open);
    const closeMobileMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 760) {
                closeMobileMenu();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className={styles.nav}>
            <Logo />
            <ul className={styles.desktopLinks}>
                <li className={styles.desktopLinksItem}>
                    <a href="#playlista" className={styles.desktopLinksLink}>
                        Playlista
                    </a>
                </li>
                <li className={styles.desktopLinksItem}>
                    <a href="#informacje" className={styles.desktopLinksLink}>
                        Informacje
                    </a>
                </li>

                <li className={styles.desktopLinksItem}>
                    <a
                        href="http://2loraciborz.pl/"
                        className={styles.desktopLinksLink}
                    >
                        Szkoła
                    </a>
                </li>
                <li className={styles.desktopLinksItem}>
                    <a href="#" className={styles.desktopLinksLink}>
                        Zaloguj się
                    </a>
                </li>
            </ul>
            <div className={styles.desktopOnly}>
                <ThemeSwitch />
            </div>
            <Hamburger
                orientation="right"
                open={isMenuOpen}
                onClick={toggleMobileMenu}
                hiddenOnDesktop
            />
            <Modal open={isMenuOpen}>
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuBar}>
                        <ThemeSwitch />
                        <button
                            className={styles.mobileMenuBarClose}
                            onClick={toggleMobileMenu}
                        >
                            <Icon icon="ic:round-close" />
                        </button>
                    </div>
                    <ul className={styles.mobileLinks}>
                        <li className={styles.mobileLinksItem}>
                            <a
                                onClick={closeMobileMenu}
                                href="#playlista"
                                className={styles.mobileLinksLink}
                            >
                                Playlista
                            </a>
                        </li>
                        <li className={styles.mobileLinksItem}>
                            <a
                                onClick={closeMobileMenu}
                                href="#informacje"
                                className={styles.mobileLinksLink}
                            >
                                Informacje
                            </a>
                        </li>

                        <li className={styles.mobileLinksItem}>
                            <a
                                onClick={closeMobileMenu}
                                href="http://2loraciborz.pl/"
                                className={styles.mobileLinksLink}
                            >
                                Szkoła
                            </a>
                        </li>
                        <li className={styles.mobileLinksItem}>
                            <a
                                onClick={closeMobileMenu}
                                href="#"
                                className={styles.mobileLinksLink}
                            >
                                Zaloguj się
                            </a>
                        </li>
                    </ul>
                </div>
            </Modal>
        </nav>
    );
}
