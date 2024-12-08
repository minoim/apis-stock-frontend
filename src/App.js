import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import NewsList from './components/NewsList';
import Pagination from './components/Pagination';
import { FaBug } from 'react-icons/fa';
import './styles/main.css';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = async (keyword, page = 1) => {
    setHasSearched(true);
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5001/api/news/search?keyword=${keyword}&page=${page}`);
      if (!response.ok) {
        throw new Error('API 요청에 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSearchResults(data.items);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('검색 오류:', error);
    } finally {
      setLoading(false);
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
      <main>
        {loading ? (
          <div className="loading">검색 중...</div>
        ) : (
          <>
            <div className="news-container">
              {hasSearched && searchResults.length === 0 ? (
                <div className="no-results">검색 결과가 없습니다.</div>
              ) : (
                searchResults.map((news, index) => (
                  <NewsCard key={index} news={news} />
                ))
              )}
            </div>
            {searchResults.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => handleSearch(searchResults[0].keyword, page)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App; 