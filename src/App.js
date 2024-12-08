import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import NewsCard from './components/NewsCard';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const response = await fetch(`https://apis-stock-backend.onrender.com/api/news/search?keyword=${keyword}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = await response.json();
      // 검색 결과가 있는 경우에만 설정
      if (data && data.items) {
        setSearchResults(data.items);
      } else {
        setSearchResults([]); // 결과가 없으면 빈 배열로 설정
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]); // 에러 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock News Finder</h1>
        <SearchBar onSearch={handleSearch} />
      </header>
      <main>
        {loading ? (
          <div className="loading">검색 중...</div>
        ) : (
          <div className="news-container">
            {searchResults.length > 0 ? (
              searchResults.map((news, index) => (
                <NewsCard key={index} news={news} />
              ))
            ) : (
              <div className="no-results">검색 결과가 없습니다.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 