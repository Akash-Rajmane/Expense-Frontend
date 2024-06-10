import React from 'react';
import Dropdown from '../Form/Dropdown';
import "./Pagination.css";

const Pagination = ({ currentPage, setCurrentPage, nextPage, prevPage, lastPage, perPage, perPageChangeHandler, hasPrevPage, hasNextPage }) => {

  const prevPageHandler = () => {
    if (hasPrevPage) {
      setCurrentPage(prevPage);
    }
  }

  const nextPageHandler = () => {
    if (hasNextPage) {
      setCurrentPage(nextPage);
    }
  }

  const firstPageHandler = () => {
    setCurrentPage(1);
  }

  const lastPageHandler = () => {
    setCurrentPage(lastPage);
  }

  return (
    <div className="pagination">
      {(currentPage > 2) && <button aria-label="first page" className="pgBtn" onClick={firstPageHandler} title='first page'>&#x226A;</button>}
      {hasPrevPage && <button aria-label="previous page" className="pgBtn" onClick={prevPageHandler}>{prevPage}</button>}
      <button aria-label="current page" className="currPgBtn">
        {currentPage}
      </button>
      {hasNextPage && <button aria-label="next page" className="pgBtn" onClick={nextPageHandler}>{nextPage}</button>}
      {(currentPage < lastPage - 1) && <button aria-label="last page" className="pgBtn" onClick={lastPageHandler} title={`${lastPage} (last page)`}>&#x226B;</button>}
      <Dropdown
        label={"rows per page"}
        value={perPage}
        options={[5, 10, 25, 50, 100]}
        onChangeHandler={perPageChangeHandler}
        showLabelInSameRow={true}
        selectedOption={perPage}
      />
    </div>
  )
}

export default Pagination;
