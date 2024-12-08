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
      setSearchResults(data.items);
    } catch (error) {
      console.error('검색 오류:', error);
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
            {searchResults.map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 