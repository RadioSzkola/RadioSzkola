import { createFileRoute } from "@tanstack/react-router";
import Button from "../../ui/button";
import { SERVER_HOST } from "../../const";
import styles from "../../styles/admin-spotify-route.module.css";

export const Route = createFileRoute("/admin/spotify")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className={styles.adminSpotifyRoute}>
            <a href={SERVER_HOST + "/v1/spotify/init"}>
                <Button>Połącz się ze spotify</Button>
            </a>
        </div>
    );
}
