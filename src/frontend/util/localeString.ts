export function localePrice(price: number, region: string) {
  let string = '';

  switch (region) {
    case 'US':
      string = price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      break;
    case 'KR':
      string = price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
      break;
  }

  return string;
}
