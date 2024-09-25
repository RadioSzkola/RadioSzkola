import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Filters from './filtersSelect.jsx';
import '/src/Components/css/SearchBar.css';

const SearchBar = ({ elements, setSearchResults }) => {
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [filteredArray, setFilteredArray] = useState([]);
    const handleSubmit = (e) => e.preventDefault();
    const handleFilterChange = (selectedValue) => {
        setSelectedFilter(selectedValue);
    }

    const handleSearchChange = (e) => {
        const searchQuery = e.target.value.toLowerCase();

        if (parseFloat(selectedFilter) === 0) {
            setFilteredArray(elements.filter(element => element.name.toLowerCase().includes(searchQuery)));
        } else if (parseFloat(selectedFilter) === 1) {
            setFilteredArray(elements.filter(element => element.artist.toLowerCase().includes(searchQuery)));
        } else if (parseFloat(selectedFilter) === 2) {
            setFilteredArray(elements.filter(element => element.album.toLowerCase().includes(searchQuery)));
        }
    }

    useEffect(() => {
        if (selectedFilter === 0) {
            setFilteredArray(elements);
        }
    }, [selectedFilter, elements]);

    useEffect(() => {
        setSearchResults(filteredArray);
    }, [filteredArray, setSearchResults])

    return (
        <form className="SearchBarForm" onSubmit={handleSubmit}>
            <div className="SearchBarContainer">
                <Filters onFilterChange={handleFilterChange} />
                <div className="SearchBarInputContainer">
                    <input type="text" onChange={handleSearchChange} id="search" placeholder="Szukaj..." />
                    <label htmlFor="check" className="SearchBarIcon">
                        <i className="ri-search-line"></i>
                    </label>
                </div>
            </div>
        </form>
    )
}

SearchBar.propTypes = {
    elements: PropTypes.array.isRequired,
    setSearchResults: PropTypes.func.isRequired
}

export default SearchBar;
