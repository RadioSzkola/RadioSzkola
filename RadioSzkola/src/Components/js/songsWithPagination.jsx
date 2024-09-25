import Item from "./items.jsx";
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';
import { getElements } from './axios.jsx';
import '/src/Components/css/pagination.css';
import '/src/Components/css/ListPage.css';

const ListPage = ({ searchResults, loaded, elements, number }) => {
  const [loadingText, setLoadingText] = useState('Ładuję');
  const [pageNumber, setPageNumber] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [previousPageCount, setPreviousPageCount] = useState(0);
  const [data, setData] = useState([]);

  const resultsPerPage = 9;
  const pagesVisited = pageNumber * resultsPerPage;
  const refreshData = async () => {
    try {
      const get = await getElements();
      setData(get);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 15000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(prevText => {
        if (prevText === 'Ładuję...') {
          return 'Ładuję'
        } else {
          return `${prevText}.`
        }
      })
    }, 270)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setFilteredResults(searchResults);
    setPageNumber(previousPageCount);
  }, [searchResults, previousPageCount]);

  useEffect(() => {
    setPageNumber(prevPage => {
      if (prevPage >= Math.ceil(searchResults.length / resultsPerPage)) {
        return 0;
      } else {
        return prevPage;
      }
    });
  }, [searchResults]);

  useEffect(() => {
    if (number === 1) {
      setPageNumber(previousPageCount);
    };
  }, [number, previousPageCount]);

  const results = filteredResults
    .slice(pagesVisited, pagesVisited + resultsPerPage)
    .map(item => <Item key={item.song_id} item={item} elements={elements} refresh={data} />)

  const pageCount = Math.ceil(filteredResults.length / resultsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
    setPreviousPageCount(selected);
  };

  let content;

  if (results && results.length && loaded === true) {
    content = results;
  } else if (results && loaded === false) {
    content = <article className="PlaylistSectionLoadingText"><p>{loadingText}</p></article>;
  } else if (!(results && results.length) && loaded === true) {
    content = <article className="PlaylistSectionSongsNotFound"><p style={{textAlign: "center"}}>Nie znaleziono utworów lub występuje problem połączenia z serwerem.</p></article>
    
  }

  return (
    <>
      {filteredResults.length !== 0 && (
        <div className="PlaylistSectionGridThreeColumns">{content}</div>
      )}
      {filteredResults.length === 0 && (
        <div className="PlaylistSectionGridThreeColumns PlaylistSectionSongsNotFoundMarginFix">{content}</div>
      )}
      {filteredResults.length !== 0 && (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"PaginationContainer"}
          previousClassName={"PaginationPreviousPage"}
          nextClassName={"PaginationNextPage"}
          activeClassName={"PaginationActiveButton"}
          disabledClassName={"PaginationDisabledButton"}
          initialPage={previousPageCount}  
        />
    )}
    </>
  )
}

ListPage.propTypes = {
  searchResults: PropTypes.array,
  loaded: PropTypes.bool,
  elements: PropTypes.array,
  number: PropTypes.number
}

export default ListPage;
