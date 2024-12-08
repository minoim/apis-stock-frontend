import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0
  });

  const handleSearch = async (keyword, page = 1) => {
    setHasSearched(true);
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/news/search?keyword=${keyword}&page=${page}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = await response.json();
      setSearchResults(data.items);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(data.total / 10),
        totalItems: data.total
      });
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>관심 종목 검색기</h1>
        <a 
          href="https://contents.premium.naver.com/apishive/apishive56" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="youtube-link"
        >
          주식매매의 정석 채널 바로가기
        </a>
      </header>
      <SearchBar onSearch={handleSearch} />
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
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
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