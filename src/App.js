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

  const handleSearch = async (keyword, page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5001/api/news/search?keyword=${keyword}&page=${page}`);
      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNews(data.items);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('검색 ��류:', error);
      setError(error.message || '뉴스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    handleSearch(document.querySelector('.search-input').value, page);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>주식 종목 검색기</h1>
        <a 
          href="https://contents.premium.naver.com/apishive/apishive56" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="youtube-link"
        >
          주식매매의 정석 채널 바로가기
        </a>
        <SearchBar onSearch={handleSearch} />
      </header>
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