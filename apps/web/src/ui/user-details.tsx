import { User } from "@rs/shared/models";
import styles from "../styles/user-details.module.css";

export type UserDetailsProps = {
    user: User;
};

export default function UserDetails({ user }: UserDetailsProps) {
    return (
        <div className={styles.userDetail}>
            <h2 className={styles.userDetailTitle}>Dane użytkownika</h2>
            <div className={styles.userDetailItem}>
                <span className={styles.userDetailLabel}>Imię:</span>
                <span className={styles.userDetailValue}>{user.name}</span>
            </div>
            <div className={styles.userDetailItem}>
                <span className={styles.userDetailLabel}>Email:</span>
                <span className={styles.userDetailValue}>{user.email}</span>
            </div>
            <div className={styles.userDetailItem}>
                <span className={styles.userDetailLabel}>Rola:</span>
                <span className={styles.userDetailValue}>{user.role}</span>
            </div>
            <div className={styles.userDetailItem}>
                <span className={styles.userDetailLabel}>ID Szkoły:</span>
                <span className={styles.userDetailValue}>{user.schoolId}</span>
            </div>
            <div className={styles.userDetailItem}>
                <span className={styles.userDetailLabel}>Stworzony:</span>
                <span className={styles.userDetailValue}>
                    {new Date(user.createdAt).toLocaleString()}
                </span>
            </div>
            <div className={styles.userDetailItem}>
                <span className={styles.userDetailLabel}>Zaktualizowany:</span>
                <span className={styles.userDetailValue}>
                    {new Date(user.updatedAt).toLocaleString()}
                </span>
            </div>
        </div>
    );
}
