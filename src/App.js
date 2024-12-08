import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import NewsList from './components/NewsList';
import Pagination from './components/Pagination';
import { FaBug } from 'react-icons/fa';
import './styles/main.css';

function App() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (keyword) => {
    try {
      const response = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${keyword}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setNews(data.items);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('검색 오류:', error);
      setError(error.message || '뉴스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    handleSearch(document.querySelector('.search-input').value, page);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title-container">
          <h1>
            <FaBug className="bee-icon" />
            Apis의 종목 검색기
          </h1>
          <a 
            href="https://www.youtube.com/@user-gl5yp9cx8n" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="channel-button"
          >
            주식매매의 정석 채널 바로가기
          </a>
        </div>
      </div>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <div className="loading">검색 중...</div>}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && !error && (
        <>
          <NewsList news={news} />
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App; 