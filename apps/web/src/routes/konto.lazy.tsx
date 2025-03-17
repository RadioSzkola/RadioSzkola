import { createLazyFileRoute } from "@tanstack/react-router";
import { useUser } from "../hooks/auth";
import styles from "../styles/account-route.module.css";
import UserDetails from "../ui/user-details";

export const Route = createLazyFileRoute("/konto")({
    component: RouteComponent,
});

function RouteComponent() {
    const { user } = useUser();

    return (
        <div className={styles.accountRoute}>
            {user ? (
                <UserDetails user={user} />
            ) : (
                <h1>Nie jesteś zalogowana/y</h1>
            )}
        </div>
    );
}
