import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState(null);
  const [keywords, setKeywords] = useState([]);

  const handleSearch = async (keyword, page = 1) => {
    if (!keyword) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (currentKeyword !== keyword) {
        console.log('새로운 키워드 검색:', keyword);
        const keywordResponse = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&display=100&start=1`);
        if (!keywordResponse.ok) {
          throw new Error('검색 중 오류가 발생했습니다.');
        }
        const keywordData = await keywordResponse.json();
        console.log('키워드 분석용 데이터:', keywordData);
        
        const extractedKeywords = extractKeywords(keywordData.items.map(item => item.title));
        setKeywords(extractedKeywords);
        setCurrentKeyword(keyword);
      }

      const startIndex = (page - 1) * 10 + 1;
      console.log('페이지 요청:', page, 'startIndex:', startIndex);
      console.log('사용 키워드:', currentKeyword || keyword);
      
      const pageUrl = `https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(currentKeyword || keyword)}&display=10&start=${startIndex}`;
      console.log('요청 URL:', pageUrl);
      
      const pageResponse = await fetch(pageUrl);
      if (!pageResponse.ok) {
        throw new Error('검색 중 오류가 발생했습니다.');
      }
      
      const pageData = await pageResponse.json();
      console.log('페이지 데이터:', pageData);
      
      if (pageData.items && pageData.items.length > 0) {
        setSearchResults(pageData.items);
        setTotalResults(pageData.total);
        setCurrentPage(page);
      } else {
        throw new Error('검색 결과가 없습니다.');
      }
    } catch (err) {
      console.error('에러 발생:', err);
      setError(err.message);
      setSearchResults([]);
      if (currentKeyword !== keyword) {
        setKeywords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(document.querySelector('input').value, newPage);
  };

  useEffect(() => {
    const recordVisit = async () => {
      try {
        await fetch('https://apis-stock-backend.onrender.com/api/visitors/count', {
          method: 'POST'
        });
      } catch (error) {
        console.error('방문자 수 기록 실패:', error);
      }
    };

    recordVisit();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <a 
          href="https://contents.premium.naver.com/apishive/apishive56" 
          target="_blank" 
          rel="noopener noreferrer"
          className="youtube-link"
        >
          주식매매의 정석 채널 바로가기
        </a>
      </header>
      <main className="App-main">
        <div className="search-container">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {loading && <div className="loading">검색 중...</div>}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && searchResults.length > 0 && (
          <>
            <div className="results-container">
              {searchResults.map((news, index) => (
                <NewsCard key={index} news={news} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalResults={totalResults}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;