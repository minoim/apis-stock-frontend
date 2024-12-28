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
  const [allItems, setAllItems] = useState([]);

  const handleSearch = async (keyword, page = 1, isNewSearch = true) => {
    if (!keyword) return;
    
    setLoading(true);
    setError(null);

    try {
      if (isNewSearch) {
        const fullResponse = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${encodeURIComponent(keyword)}&page=1&display=100`);
        if (!fullResponse.ok) {
          throw new Error('검색 중 오류가 발생했습니다.');
        }
        const fullData = await fullResponse.json();
        setAllItems(fullData.items);
        setTotalResults(fullData.total);
        
        const extractedKeywords = extractKeywords(fullData.items.map(item => item.title));
        setKeywords(extractedKeywords);
        setLastSearchKeyword(keyword);
        
        setSearchResults(fullData.items.slice(0, 10));
        setCurrentPage(1);
      } else {
        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        setSearchResults(allItems.slice(startIndex, endIndex));
        setCurrentPage(page);
      }
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
      if (isNewSearch) {
        setKeywords([]);
        setAllItems([]);
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
              totalResults={Math.min(allItems.length, totalResults)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;