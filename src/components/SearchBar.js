import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch, shouldReset }) {
  const [keyword, setKeyword] = useState('');

  // shouldReset이 변경될 때 검색어 초기화
  useEffect(() => {
    if (shouldReset) {
      setKeyword('');
    }
  }, [shouldReset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="알고싶은 종목의 키워드를 입력 하세요"
        className="search-input"
      />
      <button type="submit" className="search-button">검색</button>
    </form>
  );
}

export default SearchBar; 