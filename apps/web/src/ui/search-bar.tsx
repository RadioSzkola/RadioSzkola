import styles from "../styles/search-bar.module.css";
import { Icon } from "@iconify/react";

export type SearchCategory = {
    value: string;
    text: string;
};

export type SearchBarProps = {
    defaultSearchTerm: string;
    defaultSearchCategory: string;
    searchCategories: SearchCategory[];
    onInputChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectChange?: (ev: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SearchBar({
    defaultSearchTerm: searchTerm,
    defaultSearchCategory: searchCategory,
    searchCategories,
    onInputChange,
    onSelectChange,
}: SearchBarProps) {
    return (
        <div className={styles.searchBar}>
            <label htmlFor="search-input" className="sr-only">
                Search
            </label>
            <input
                id="search-input"
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={onInputChange}
                aria-label="Search input"
            />
            <label htmlFor="search-category" className="sr-only">
                Category
            </label>
            <select
                id="search-category"
                className={styles.searchSelect}
                value={searchCategory}
                onChange={onSelectChange}
                aria-label="Search category"
            >
                {searchCategories.map(({ value, text }) => (
                    <option value={value}>{text}</option>
                ))}
            </select>
            <button className={styles.searchButton} aria-label="Search button">
                <Icon className={styles.searchButtonIcon} icon="mdi:magnify" />
            </button>
        </div>
    );
}
