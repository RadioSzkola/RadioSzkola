import { createLazyFileRoute } from "@tanstack/react-router";
import { useUser } from "../hooks/auth";
import styles from "../styles/account-route.module.css";

export const Route = createLazyFileRoute("/konto")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useUser();

    return (
        <div className={styles.accountRoute}>
            {user ? (
                <pre>{JSON.stringify(user, null, 4)}</pre>
            ) : (
                <h1>Nie jesteś zalogowana/y</h1>
            )}
        </div>
    );
}
