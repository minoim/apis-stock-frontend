import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import NewsCard from './components/NewsCard';
import KeywordCard from './components/KeywordCard';
import Pagination from './components/Pagination';
import { extractKeywords } from './utils/wordAnalyzer';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const handleSearch = async (keyword, page = 1) => {
    if (!keyword) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 키워드가 변경되었을 때만 키워드 분석 실행
      if (currentKeyword !== keyword) {
        const keywordResponse = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&display=100`);
        if (!keywordResponse.ok) {
          throw new Error('검색 중 오류가 발생했습니다.');
        }
        const keywordData = await keywordResponse.json();
        const extractedKeywords = extractKeywords(keywordData.items.map(item => item.title));
        setKeywords(extractedKeywords);
        setCurrentKeyword(keyword);
      }

      // 현재 페이지 데이터 가져오기
      const pageResponse = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&start=${(page-1)*10 + 1}`);
      if (!pageResponse.ok) {
        throw new Error('검색 중 오류가 발생했습니다.');
      }
      const pageData = await pageResponse.json();
      
      setSearchResults(pageData.items);
      setTotalResults(pageData.total);
      setCurrentPage(page);
    } catch (err) {
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
    handleSearch(currentKeyword, newPage);
  };

  const handleKeywordClick = (keyword) => {
    setCurrentPage(1);
    handleSearch(keyword, 1);
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
          href="https://www.youtube.com/@user-stock" 
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
            <KeywordCard 
              keywords={keywords} 
              onKeywordClick={handleKeywordClick}
            />
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