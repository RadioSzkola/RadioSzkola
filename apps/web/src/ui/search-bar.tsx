import styles from "../styles/search-bar.module.css";
import { Icon } from "@iconify/react";

export type SearchCategory = {
    value: string;
    text: string;
};

export type SearchBarProps = {
    searchTerm: string;
    searchCategory: string;
    searchCategories: SearchCategory[];
    onInputChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange?: (ev: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SearchBar({
    searchTerm,
    searchCategory,
    searchCategories,
    onInputChange,
    onSelectChange,
}: SearchBarProps) {
    return (
        <div className={styles.searchBar}>
            <div className={styles.searchSelectWraper}>
                <select
                    id="search-category"
                    className={styles.searchSelect}
                    value={searchCategory}
                    onChange={onSelectChange}
                    aria-label="Search category"
                >
                    {searchCategories.map(({ value, text }) => (
                        <option key={value + text} value={value}>
                            {text}
                        </option>
                    ))}
                </select>
            </div>
            <input
                id="search-input"
                type="text"
                placeholder="Szukaj..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={onInputChange}
                aria-label="Search input"
            />

            <button className={styles.searchButton} aria-label="Search button">
                <Icon className={styles.searchButtonIcon} icon="mdi:magnify" />
            </button>
        </div>
    );
}
