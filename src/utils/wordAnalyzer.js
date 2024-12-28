// 불용어 리스트 (필터링할 일반적인 단어들)
const stopWords = [
  '주가', '특징주', '상승', '하락', '급등', '급락', '기업', '종목', '관련주', '테마주',
  '주식', '증시', '시장', '투자', '매수', '매도', '거래', '체결', '호가', '시세',
  '및', '등', '로', '더', '것', '이', '가', '은', '는', '을', '를', '에', '의'
];

// 주식 종목명 추출 함수
export const extractKeywords = (titles) => {
  // 모든 제목을 하나의 문자열로 합치기
  const combinedText = titles.join(' ');
  
  // 한글 단어 추출 (2글자 이상)
  const words = combinedText.match(/[가-힣]{2,}/g) || [];
  
  // 단어 빈도수 계산
  const wordCount = words.reduce((acc, word) => {
    // 불용어가 아닌 경우에만 카운트
    if (!stopWords.includes(word)) {
      acc[word] = (acc[word] || 0) + 1;
    }
    return acc;
  }, {});
  
  // 빈도수 기준으로 정렬하여 상위 5개 추출
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => ({
      word,
      count
    }));
}; 