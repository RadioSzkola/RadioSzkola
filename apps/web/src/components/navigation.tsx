import { useEffect, useState } from "react";
import Hamburger from "../ui/hamburger";

import signUpStyles from "../styles/signup.module.css";
import styles from "../styles/navigation.module.css";
import Modal from "../ui/modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../ui/logo";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const closeMobileMenu = () => {
        setIsAuthOpen(false);
        setIsMenuOpen(false);
    };
    const openMobileMenu = () => {
        setIsAuthOpen(false);
        setIsMenuOpen(true);
    };

    const closeAuth = () => {
        setIsMenuOpen(false);
        setIsAuthOpen(false);
    };

    const openAuth = () => {
        setIsMenuOpen(false);
        setIsAuthOpen(true);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 760) {
                closeMobileMenu();
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLoginClick = () => {
        document
            .getElementById("signup-container")
            ?.classList.remove(signUpStyles.signVisibilityContainerHidden);
    };

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
                    <button
                        className={styles.desktopLinksLink}
                        onClick={handleLoginClick}
                    >
                        Zaloguj się
                    </button>
                </li>
            </ul>
            <Hamburger
                orientation="right"
                open={isMenuOpen}
                onClick={openMobileMenu}
                hiddenOnDesktop
            />
            <Modal open={isMenuOpen} onOverlayClick={closeMobileMenu}>
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuBar}>
                        <button
                            className={styles.mobileMenuBarClose}
                            onClick={closeMobileMenu}
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
