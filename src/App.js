import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0
  });

  useEffect(() => {
    // 페이지 로드시 방문자 수 증가 및 조회
    const updateVisitorCount = async () => {
      try {
        const response = await fetch('https://apis-stock-backend.onrender.com/api/visitors/count', {
          method: 'POST',
        });
        const data = await response.json();
        setVisitorCount(data.count);
      } catch (error) {
        console.error('방문자 수 업데이트 실패:', error);
      }
    };
    updateVisitorCount();
  }, []);

  const handleSearch = async (keyword, page = 1) => {
    setHasSearched(true);
    try {
      setLoading(true);
      const response = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${keyword}&page=${page}`, {
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
      <div className="visitor-count">
        오늘의 방문자: {visitorCount}
      </div>
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