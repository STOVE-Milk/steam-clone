// 현재 지역에 맞게 가격 단위 변환
export function localePrice(price: number, region: string, type?: string) {
  let string = '';

  if (price == 0) {
    if (type == 'charge') {
      return '잔액이 없습니다';
    } else {
      return '무료';
    }
  }

  switch (region) {
    case 'US':
      string = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      break;
    case 'KR':
      if (price) {
        // toLocaleString: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString
        string = price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
      }
      break;
  }

  return string;
}
