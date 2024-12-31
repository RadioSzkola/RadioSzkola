import { useState } from "react";
import Hamburger from "../ui/hamburger";

import styles from "../styles/navigation.module.css";
import Modal from "../ui/modal";
import ThemeSwitch from "./theme-switch";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleHamburgerClick = () => {
        setIsMenuOpen(open => !open);
    };

    return (
        <nav className={styles.nav}>
            <Hamburger
                orientation="right"
                open={isMenuOpen}
                onClick={handleHamburgerClick}
                hiddenOnDesktop
            />
            <Modal open={isMenuOpen}>
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuBar}>
                        <ThemeSwitch />
                        <button
                            className={styles.mobileMenuBarX}
                            onClick={handleHamburgerClick}
                        >
                            X
                        </button>
                    </div>
                    <ul></ul>
                </div>
            </Modal>
        </nav>
    );
}
