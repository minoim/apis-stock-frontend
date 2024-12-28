import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalResults, onPageChange }) => {
  console.log('Pagination props:', { currentPage, totalResults }); // 디버깅용

  const totalPages = Math.ceil(totalResults / 10);
  
  const handlePrevClick = () => {
    if (currentPage > 1) {
      console.log('이전 페이지로 이동:', currentPage - 1); // 디버깅용
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      console.log('다음 페이지로 이동:', currentPage + 1); // 디버깅용
      onPageChange(currentPage + 1);
    }
  };

  if (totalResults === 0) return null;

  return (
    <div className="pagination">
      <button 
        onClick={handlePrevClick} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        이전
      </button>
      <span className="page-info">
        {currentPage} / {totalPages}
      </span>
      <button 
        onClick={handleNextClick}
        disabled={currentPage >= totalPages}
        className="pagination-button"
      >
        다음
      </button>
    </div>
  );
};

export default Pagination; 