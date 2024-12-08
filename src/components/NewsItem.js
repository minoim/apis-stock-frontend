import React from 'react';

function NewsItem({ news }) {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="news-item">
      <h3 dangerouslySetInnerHTML={{ __html: news.title }}></h3>
      <p dangerouslySetInnerHTML={{ __html: news.description }}></p>
      <div className="news-meta">
        <a 
          href={news.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="read-more"
        >
          자세히 보기
        </a>
        <span>{formatDate(news.pubDate)}</span>
      </div>
    </div>
  );
}

export default NewsItem; 