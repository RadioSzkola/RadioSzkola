import styles from "../styles/auth-menu.module.css";
import SignupForm from "./signup-form";
import LoginForm from "./login-form";
import Logo from "../ui/logo";

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
                {page === "signup" ? (
                    <SignupForm labelClass={styles.authMenuLabel} />
                ) : (
                    <></>
                )}
                {page === "login" ? (
                    <LoginForm labelClass={styles.authMenuLabel} />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
