import { SpotifyTrack } from "@rs/shared/models";
import { useAPIEndpoint } from "../hooks/api";
import styles from "../styles/currently-playing.module.css";
import { useEffect } from "react";

export default function CurrentlyPLaying() {
    const currentlyPlayingEndpoint = useAPIEndpoint<SpotifyTrack>({
        endpoint: "/v1/spotify/currently-playing?schoolId=mickiewicz",
        method: "GET",
    });

    useEffect(() => {
        const interval = setInterval(() => {
            currentlyPlayingEndpoint.call();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log(currentlyPlayingEndpoint);
    }, [currentlyPlayingEndpoint.status]);

    return <div className={styles.currentlyPlaying}></div>;
}
