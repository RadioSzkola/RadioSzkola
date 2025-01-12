import { signupSchema } from "@rs/shared/models";
import { parseBySchema } from "@rs/shared/validation";
import { Icon } from "@iconify/react";
import styles from "../styles/signup.module.css";
import { useState, useEffect } from "react";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [schoolId, setSchoolId] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState("");
    const [visibility, setVisibility] = useState(false);
    const [signUpOrIn, setSignUpOrIn] = useState(1);

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
    };

    return (
        <div
            className={`${styles.signVisibilityContainer} ${styles.signVisibilityContainerHidden}`}
            id="signup-container"
        >
            <div className={styles.signContainer}>
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
                {signUpOrIn === 1 ? (
                    <form
                        onSubmit={e => handleSubmit(e)}
                        className={styles.signUpForm}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <div className={styles.passwordContainer}>
                            <input
                                type={
                                    passwordVisibility === "password"
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Hasło"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <input
                                type="checkbox"
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
                        </div>
                        <input
                            type="text"
                            placeholder="ID użytkownika"
                            value={schoolId}
                            onChange={e => setSchoolId(e.target.value)}
                            required
                        />
                        <label htmlFor="showPassword">Pokaż hasło</label>
                        <button type="submit">Zarejestruj się</button>
                    </form>
                ) : (
                    <form
                        onSubmit={e => handleSubmit(e)}
                        className={styles.signInForm}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type={
                                passwordVisibility === "password"
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Hasło"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="showPassword">Pokaż hasło</label>
                        <input
                            type="text"
                            placeholder="ID użytkownika"
                            value={schoolId}
                            onChange={e => setSchoolId(e.target.value)}
                            required
                        />
                        <button type="submit">Zaloguj się</button>
                    </form>
                )}
                <span>
                    Nie masz konta? <button>Zarejestruj się!</button>
                </span>
            </div>
        </div>
    );
}
