import React, { useState, useEffect } from 'react';

function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 로컬 스토리지에서 오늘 날짜의 방문자 수 가져오기
    const today = new Date().toLocaleDateString();
    const storedData = JSON.parse(localStorage.getItem('visitorCount') || '{}');
    
    if (storedData.date === today) {
      setCount(storedData.count);
    } else {
      // 새로운 날짜라면 카운트 초기화
      localStorage.setItem('visitorCount', JSON.stringify({ date: today, count: 1 }));
      setCount(1);
    }
  }, []);

  return (
    <div className="visitor-counter">
      오늘의 방문자: {count}
    </div>
  );
}

export default VisitorCounter;