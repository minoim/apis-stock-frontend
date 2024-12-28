import React from 'react';
import './KeywordCard.css';

const KeywordCard = ({ keywords, onKeywordClick }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div className="keyword-card">
      <h3>관련 핵심 종목</h3>
      <div className="keyword-list">
        {keywords.map(({ word, count }, index) => (
          <button
            key={index}
            className="keyword-chip"
            onClick={() => onKeywordClick(word)}
          >
            {word}
            <span className="keyword-count">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default KeywordCard; 