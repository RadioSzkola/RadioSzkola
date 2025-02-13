import { useState } from "react";
import styles from "../styles/auth-menu.module.css";

export default function AuthMenu() {
    const [page, setPage] = useState<"signup" | "login" | "logout">("signup");

    return <div className={styles.authMenu}></div>;
}
