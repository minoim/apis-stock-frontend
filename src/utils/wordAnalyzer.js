// 불용어 리스트 (필터링할 일반적인 단어들)
const stopWords = [
  // 일반적인 서술어
  '주가', '특징주', '상승', '하락', '급등', '급락', '상한가', '하한가',
  '매수', '매도', '거래', '체결', '호가', '시세', '추천', '전망',
  
  // 일반적인 분류어
  '기업', '종목', '관련주', '테마주', '섹터', '업종', '그룹', '지수',
  
  // 시장 용어
  '코스피', '코스닥', '증시', '시장', '거래소', '주식', '증권',
  
  // 수식어
  '신규', '기존', '최초', '최대', '최소', '주요', '핵심', '유력',
  
  // 일반 동사/형용사
  '되다', '하다', '이다', '있다', '없다', '진행', '예정', '검토',
  
  // 조사/접속사
  '및', '등', '로', '더', '것', '이', '가', '은', '는', '을', '를', '에', '의'
];

// 종목명일 가능성이 높은 패턴을 찾는 함수
const extractStockName = (text) => {
  // 특수문자로 분리
  const parts = text.split(/[,\s\[\]\(\)\/]/);
  
  // 각 부분에서 종목명 후보 추출
  return parts
    .map(part => {
      // 특수문자 및 불필요한 문자 제거
      const cleaned = part
        .replace(/[^가-힣a-zA-Z0-9]/g, '')  // 한글, 영문, 숫자만 남김
        .replace(/주식회사|주가|테마|업종|시장|특징주/g, ''); // 불필요한 접미사 제거
      
      // 2글자 이상이고 불용어가 아닌 경우만 반환
      if (cleaned.length >= 2 && !stopWords.includes(cleaned)) {
        return cleaned;
      }
      return null;
    })
    .filter(Boolean);  // null 제거
};

export const extractKeywords = (titles) => {
  // 종목명 카운트를 위한 객체
  const stockCount = {};
  
  titles.forEach(title => {
    // 제목에서 종목명 후보들 추출
    const stockNames = extractStockName(title);
    
    // 첫 번째로 등장하는 단어에 가중치 부여
    if (stockNames.length > 0) {
      const firstStock = stockNames[0];
      stockCount[firstStock] = (stockCount[firstStock] || 0) + 2; // 첫 단어는 가중치 2
      
      // 나머지 단어들도 카운트
      stockNames.slice(1).forEach(stock => {
        stockCount[stock] = (stockCount[stock] || 0) + 1;
      });
    }
  });

  // 빈도수 기준으로 정렬하여 상위 5개 추출
  return Object.entries(stockCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => ({
      word,
      count: Math.floor(count / 2), // 가중치 적용된 카운트를 실제 출현 횟수로 조정
      percentage: Math.round((count / (titles.length * 2)) * 100)
    }));
}; 