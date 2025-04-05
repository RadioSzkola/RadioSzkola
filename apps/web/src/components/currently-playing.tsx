import { SpotifyTrack } from "@rs/shared/models";
import { useAPIQuery } from "../hooks/api";
import styles from "../styles/currently-playing.module.css";
import { useEffect } from "react";

export default function CurrentlyPLaying() {
    const {
        refresh,
        result: { data, error, pending, status },
    } = useAPIQuery<SpotifyTrack>(
        {
            endpoint: "/v1/spotify/currently-playing?schoolId=mickiewicz",
            method: "GET",
        },
        {
            retries: 0,
        },
    );

    useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log({ data, error, pending, status });
    }, [status]);

    return (
        <div className={styles.currentlyPlaying}>
            {data && (
                <>
                    <img
                        className={styles.currentlyPlayingCover}
                        src={data?.item.album.images[0].url}
                    />
                    <div className={styles.currentlyPlayingInfo}>
                        <div className={styles.currentlyPlayingInfoItem}>
                            tytuł: {data?.item.name}
                        </div>
                        <div className={styles.currentlyPlayingInfoItem}>
                            album: {data?.item.album.name}
                        </div>
                        <div className={styles.currentlyPlayingInfoItem}>
                            wykonawca: {data?.item.artists[0].name}
                        </div>
                    </div>
                </>
            )}
            {(error || pending) && (
                <h1 className={styles.currentlyPlayingEmpty}>
                    Jeszcze nic nie gra!
                </h1>
            )}
        </div>
    );
}
