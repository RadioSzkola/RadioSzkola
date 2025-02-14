import { SpotifyTrack } from "@rs/shared/models";
import { useAPIEndpoint } from "../hooks/api";
import styles from "../styles/currently-playing.module.css";
import { useEffect } from "react";

export default function CurrentlyPLaying() {
    const { call, data, error, pending, status } = useAPIEndpoint<SpotifyTrack>(
        {
            endpoint: "/v1/spotify/currently-playing?schoolId=mickiewicz",
            method: "GET",
        },
    );

    useEffect(() => {
        const interval = setInterval(() => {
            call();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log({ data, error, pending, status });
    }, [status]);

    return <div className={styles.currentlyPlaying}></div>;
}
