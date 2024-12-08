import React from 'react';

function NewsList({ news }) {
  if (!news || news.length === 0) {
    return <div className="no-results">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="news-list">
      {news.map((item, index) => (
        <div key={index} className="news-item">
          <h3>
            <a href={item.link} target="_blank" rel="noopener noreferrer" 
               dangerouslySetInnerHTML={{ __html: item.title }}>
            </a>
          </h3>
          <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
          <span className="news-date">{new Date(item.pubDate).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}

export default NewsList; 