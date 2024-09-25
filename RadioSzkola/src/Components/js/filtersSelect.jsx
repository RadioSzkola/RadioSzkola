import PropTypes from 'prop-types';
import '/src/Components/css/filtersSelect.css';

const Filters = ({ onFilterChange }) => {

    const handleFilterChange = (e) => {
        const selectedValue = e.target.value;
        onFilterChange(selectedValue);
    }
    return (
        <select name="filters" id="filters" className="SearchBoxFilters" onChange={handleFilterChange}>
            <option className="SearchBoxFilter" value="0">Utwór</option>
            <option className="SearchBoxFilter" value="1">Artysta</option>
            <option className="SearchBoxFilter" value="2">Album</option>
        </select>
    )
}

Filters.propTypes = {
    onFilterChange: PropTypes.func.isRequired
}

export default Filters;