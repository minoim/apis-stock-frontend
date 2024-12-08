import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          className="pagination-button"
        >
          이전
        </button>
      )}
      
      <span className="pagination-info">
        {currentPage} / {totalPages}
      </span>
      
      {currentPage < totalPages && (
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          className="pagination-button"
        >
          다음
        </button>
      )}
    </div>
  );
}

export default Pagination; 