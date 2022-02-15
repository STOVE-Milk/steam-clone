// import { useRouter } from 'next/router';

import { parseToken } from 'util/parseToken';
import { reIssueTokenAPI } from 'api/auth/api';

export const verifyToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && refreshToken) {
    //토큰 만료시간 1분전
    const accessTokenTime = parseToken(accessToken).exp * 1000 - 60000;
    const refreshTokenTime = parseToken(refreshToken).exp * 1000 - 60000;

    // const router = useRouter();

    //refreshToken이 만료되었다면 로그인 페이지로 이동
    if (refreshTokenTime < Date.now()) {
      // router.push('/signin');
    }

    // //accessToken이 만료되었다면 accessToken 재발급하여 다시 저장
    else if (accessTokenTime < Date.now()) {
      const newAccessToken = (await reIssueTokenAPI({ accessToken, refreshToken, isUpdated: false })).data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);

      //   return false;
    }
    // return true;

    //재발급 후 스토어에 저장
  }
};
