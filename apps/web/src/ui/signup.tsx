import { signupSchema } from "@rs/shared/models";
import { parseBySchema } from "@rs/shared/validation";
import { Icon } from "@iconify/react";
import styles from "../styles/signup.module.css";
import { useState, useEffect } from "react";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState<
        "password" | "text"
    >("text");
    const [signUpOrIn, setSignUpOrIn] = useState<0 | 1>(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data, error } = parseBySchema(
            {
                email: email,
                password: password,
                schoolId: schoolId,
            },
            signupSchema,
        );

        if (error) {
            console.log(error);
        } else if (data) {
            console.log("email: ", data.email);
            console.log("password: ", data.password);
            console.log("schoolId: ", data.schoolId);
            console.log(data);
        }
    };

    const handleClose = async (e: React.FormEvent) => {
        e.preventDefault();
        document
            .getElementById("signup-container")
            ?.classList.add(styles.signVisibilityContainerHidden);

        setEmail("");
        setPassword("");
        setSchoolId("");
        setPasswordVisibility("text");
    };

    const handleSignUpOrIn = async () => {
        setSignUpOrIn(prevState => (prevState === 0 ? 1 : 0));
    };

    return (
        <div
            className={`${styles.signVisibilityContainer} ${styles.signVisibilityContainerHidden}`}
            id="signup-container"
        >
            <div className={styles.signContainer}>
                <div className={styles.signUpperSection}>
                    <h4 className={styles.signTitle}>
                        {signUpOrIn === 1 ? "Zarejestruj się" : "Zaloguj się"}
                    </h4>
                    <button
                        className={styles.signUpClose}
                        onClick={e => handleClose(e)}
                    >
                        <Icon
                            icon="material-symbols:close"
                            width="24"
                            height="24"
                        />
                    </button>
                </div>
                {signUpOrIn === 1 ? (
                    <form
                        onSubmit={e => handleSubmit(e)}
                        className={styles.signForm}
                    >
                        <input
                            type="email"
                            className={styles.signEmailInput}
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className={styles.signSchoolIdInput}
                            placeholder="ID użytkownika"
                            value={schoolId}
                            onChange={e => setSchoolId(e.target.value)}
                            required
                        />
                        <div className={styles.passwordContainer}>
                            <input
                                type={
                                    passwordVisibility === "password"
                                        ? "text"
                                        : "password"
                                }
                                className={styles.signPasswordInput}
                                placeholder="Hasło"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="checkbox"
                                className={styles.showPasswordCheckbox}
                                id="showPassword"
                                checked={passwordVisibility === "password"}
                                onChange={() =>
                                    setPasswordVisibility(
                                        passwordVisibility === "password"
                                            ? "text"
                                            : "password",
                                    )
                                }
                            />
                            <label
                                htmlFor="showPassword"
                                className={styles.showPasswordCheckboxLabel}
                            >
                                {passwordVisibility === "text"
                                    ? "Pokaż"
                                    : "Ukryj"}{" "}
                                hasło
                            </label>
                        </div>
                        <button
                            type="submit"
                            id="signUp"
                            className={styles.signButton}
                        >
                            Zarejestruj się
                        </button>
                    </form>
                ) : (
                    <form
                        onSubmit={e => handleSubmit(e)}
                        className={styles.signForm}
                    >
                        <input
                            type="email"
                            className={styles.signEmailInput}
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            className={styles.signSchoolIdInput}
                            placeholder="ID użytkownika"
                            value={schoolId}
                            onChange={e => setSchoolId(e.target.value)}
                            required
                        />
                        <div className={styles.passwordContainer}>
                            <input
                                type={
                                    passwordVisibility === "password"
                                        ? "text"
                                        : "password"
                                }
                                className={styles.signPasswordInput}
                                placeholder="Hasło"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="checkbox"
                                className={styles.showPasswordCheckbox}
                                id="showPassword"
                                checked={passwordVisibility === "password"}
                                onChange={() =>
                                    setPasswordVisibility(
                                        passwordVisibility === "password"
                                            ? "text"
                                            : "password",
                                    )
                                }
                            />
                            <label
                                htmlFor="showPassword"
                                className={styles.showPasswordCheckboxLabel}
                            >
                                {passwordVisibility === "text"
                                    ? "Pokaż"
                                    : "Ukryj"}{" "}
                                hasło
                            </label>
                        </div>
                        <button
                            type="submit"
                            id="signIn"
                            className={styles.signButton}
                        >
                            Zaloguj się
                        </button>
                    </form>
                )}
                {signUpOrIn === 1 ? (
                    <span className={styles.toggleSignUpIn}>
                        Nie masz konta?{" "}
                        <button
                            className={styles.toggleSignUpInButton}
                            onClick={handleSignUpOrIn}
                        >
                            Zaloguj się!
                        </button>
                    </span>
                ) : (
                    <span className={styles.toggleSignUpIn}>
                        Nie masz konta?{" "}
                        <button
                            className={styles.toggleSignUpInButton}
                            onClick={handleSignUpOrIn}
                        >
                            Zarejestruj się!
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
}
