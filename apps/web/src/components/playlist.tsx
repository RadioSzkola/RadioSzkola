import styles from "../styles/playlist.module.css";
import SearchBar from "../ui/search-bar";

export type PlaylistProps = {};

export default function Playlist({}: PlaylistProps) {
    return (
        <div className={styles.playlist} id="playlista">
            <a
                href="https://open.spotify.com/playlist/6kG5IPJjb2xyu0mouhET7B?si=2c503a1faf56490d"
                target="_blank"
                rel="noopener noreferrer"
            >
                <h1 className={styles.playlistHeader}>Playlista</h1>
            </a>
            <SearchBar
                searchCategories={[
                    { value: "artist", text: "artysta" },
                    { value: "album", text: "album" },
                    { value: "genre", text: "gatunek" },
                ]}
                defaultSearchCategory="album"
                defaultSearchTerm=""
            />
        </div>
    );
}
