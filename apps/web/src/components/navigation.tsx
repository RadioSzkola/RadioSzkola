import { useContext, useEffect, useState } from "react";
import Hamburger from "../ui/hamburger";

import styles from "../styles/navigation.module.css";
import Modal from "../ui/modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import Logo from "../ui/logo";
import AuthMenu from "./auth-menu";
import { authContext } from "../stores/auth";

export default function Navigation() {
    const user = useContext(authContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    const openMobileMenu = () => {
        setIsMenuOpen(true);
    };

    const openLogin = () => {
        setIsMenuOpen(false);
        setIsLoginOpen(true);
    };

    const closeLogin = () => {
        setIsLoginOpen(false);
    };

    const openSignup = () => {
        setIsMenuOpen(false);
        setIsSignupOpen(true);
    };

    const closeSignup = () => {
        setIsSignupOpen(false);
    };

    const openLogout = () => {
        setIsMenuOpen(false);
        setIsLogoutOpen(true);
    };

    const closeLogout = () => {
        setIsMenuOpen(false);
        setIsLogoutOpen(false);
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
                {user ? (
                    <li className={styles.desktopLinksItem}>
                        <button
                            className={styles.desktopLinksLink}
                            onClick={openLogout}
                        >
                            Wyloguj się
                        </button>
                    </li>
                ) : (
                    <>
                        <li className={styles.desktopLinksItem}>
                            <button
                                className={styles.desktopLinksLink}
                                onClick={openLogin}
                            >
                                Zaloguj się
                            </button>
                        </li>
                        <li className={styles.desktopLinksItem}>
                            <button
                                className={styles.desktopLinksLink}
                                onClick={openSignup}
                            >
                                Zarejestruj się
                            </button>
                        </li>
                    </>
                )}
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
                        {user ? (
                            <li className={styles.mobileLinksItem}>
                                <a
                                    onClick={openLogout}
                                    href="#"
                                    className={styles.mobileLinksLink}
                                >
                                    Wyloguj się
                                </a>
                            </li>
                        ) : (
                            <>
                                <li className={styles.mobileLinksItem}>
                                    <a
                                        onClick={openLogin}
                                        href="#"
                                        className={styles.mobileLinksLink}
                                    >
                                        Zaloguj się
                                    </a>
                                </li>
                                <li className={styles.mobileLinksItem}>
                                    <a
                                        onClick={openSignup}
                                        href="#"
                                        className={styles.mobileLinksLink}
                                    >
                                        Zarejestruj się
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </Modal>
            <Modal
                open={isLoginOpen || isSignupOpen || isLogoutOpen}
                onOverlayClick={() => {
                    closeLogin();
                    closeLogout();
                    closeSignup();
                }}
            >
                {isLoginOpen ? <AuthMenu page="login" /> : <></>}
                {isSignupOpen ? <AuthMenu page="signup" /> : <></>}
                {isLogoutOpen ? <AuthMenu page="logout" /> : <></>}
            </Modal>
        </nav>
    );
}
