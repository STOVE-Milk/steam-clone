export function parseToken(jwtToken: string | null) {
  if (jwtToken == null) return 'no token';
  //[refer]: jwt decode하는 코드 | 출처: https://archijude.tistory.com/432
  const base64Payload = jwtToken.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
  const payload = Buffer.from(base64Payload, 'base64');
  const result = JSON.parse(payload.toString());
  return result;
}
