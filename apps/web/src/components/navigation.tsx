import { useState } from "react";
import Hamburger from "../ui/hamburger";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleHamburgerClick = () => {
        setIsMenuOpen(open => !open);
    };

    return (
        <nav>
            <Hamburger
                orientation="right"
                open={isMenuOpen}
                onClick={handleHamburgerClick}
            />
        </nav>
    );
}
