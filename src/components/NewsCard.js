import React from 'react';

function NewsCard({ news }) {
  // HTML 태그 제거 함수
  const removeHtmlTags = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '');
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="news-card">
      <h3>
        <a href={news.link} target="_blank" rel="noopener noreferrer">
          {removeHtmlTags(news.title)}
        </a>
      </h3>
      <p>{removeHtmlTags(news.description)}</p>
      <div className="news-meta">
        <span>{formatDate(news.pubDate)}</span>
      </div>
    </div>
  );
}

export default NewsCard;