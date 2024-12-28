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
  const [lastSearchKeyword, setLastSearchKeyword] = useState('');

  const handleSearch = async (keyword, page = 1, isNewSearch = true) => {
    if (!keyword) return;
    
    setLoading(true);
    setError(null);

    try {
      // 새로운 검색일 경우에만 전체 결과를 가져와서 키워드 분석
      if (isNewSearch) {
        const fullResponse = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&page=1&display=100`);
        if (!fullResponse.ok) {
          throw new Error('검색 중 오류가 발생했습니다.');
        }
        const fullData = await fullResponse.json();
        const extractedKeywords = extractKeywords(fullData.items.map(item => item.title));
        setKeywords(extractedKeywords);
        setLastSearchKeyword(keyword);
      }

      // 현재 페이지의 결과를 가져오기
      const response = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
      if (!response.ok) {
        throw new Error('검색 중 오류가 발생했습니다.');
      }
      const data = await response.json();
      
      setSearchResults(data.items);
      setTotalResults(data.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
      if (isNewSearch) {
        setKeywords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    handleSearch(lastSearchKeyword, newPage, false);
  };

  const handleKeywordClick = (keyword) => {
    handleSearch(keyword, 1, true);
  };

  const handleNewSearch = (keyword) => {
    handleSearch(keyword, 1, true);
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
          <SearchBar onSearch={handleNewSearch} />
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