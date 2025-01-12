import { useState } from "react";
import styles from "../styles/playlist.module.css";
import SearchBar from "../ui/search-bar";

export type PlaylistProps = {};

export type SearchCategory = "artist" | "album" | "genre";

export default function Playlist({}: PlaylistProps) {
    const [searchCategory, setSearchCategory] =
        useState<SearchCategory>("artist");
    const [searchTerm, setSearchTerm] = useState<string>("");

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
                searchCategory={searchCategory}
                searchTerm={searchTerm}
                onSelectChange={ev =>
                    setSearchCategory(ev.target.value as SearchCategory)
                }
                onInputChange={ev => setSearchTerm(ev.target.value)}
            />
        </div>
    );
}
