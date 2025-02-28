import styles from "../styles/auth-menu.module.css";
import SignupForm from "./signup-form";
import LoginForm from "./login-form";
import Logo from "../ui/logo";
import LogoutForm from "./logout-form";

export type AuthMenuProps = {
    page: "signup" | "login" | "logout";
};

export default function AuthMenu({ page }: AuthMenuProps) {
    return (
        <div className={styles.authMenu}>
            <div className={styles.authMenuBlackbox}>
                <Logo theme="light" imgClass={styles.authMenuLogoImg} />
            </div>
            <div className={styles.authMenuForm}>
                {page === "signup" ? <SignupForm /> : <></>}
                {page === "login" ? <LoginForm /> : <></>}
                {page === "logout" ? <LogoutForm /> : <></>}
            </div>
        </div>
    );
}
