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
      // start 파라미터 계산 (1부터 시작)
      const start = ((page - 1) * 10) + 1;
      
      // API 호출
      const response = await fetch(
        `https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&start=${start}&display=10`
      );

      if (!response.ok) {
        throw new Error('검색 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      
      // 검색 결과 확인
      if (!data.items || data.items.length === 0) {
        throw new Error('검색 결과가 없습니다.');
      }

      // 검색 결과 업데이트
      setSearchResults(data.items);
      setTotalResults(data.total);
      setCurrentPage(page);

      // 첫 검색 또는 키워드가 변경된 경우에만 키워드 분석
      if (currentKeyword !== keyword) {
        const extractedKeywords = extractKeywords(data.items.map(item => item.title));
        setKeywords(extractedKeywords);
        setCurrentKeyword(keyword);
      }

    } catch (err) {
      console.error('검색 오류:', err);
      setError(err.message);
      setSearchResults([]);
      if (currentKeyword !== keyword) {
        setKeywords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    console.log('페이지 변경:', newPage, '키워드:', currentKeyword);
    handleSearch(currentKeyword, newPage);
  };

  // 키워드 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    console.log('키워드 클릭:', keyword);
    setCurrentPage(1);
    handleSearch(keyword, 1);
  };

  // 초기 방문자 수 기록
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
          <SearchBar onSearch={(keyword) => handleSearch(keyword, 1)} />
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