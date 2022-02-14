import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from 'styles/global-styles';
import { theme } from 'styles/theme';

import wrapper from 'modules/configureStore';
import Layout from 'templates/Layout';

import { parseToken } from 'util/parseToken';
import { reIssueTokenAPI } from 'api/auth/api';

import 'styles/globals.css';
import 'styles/font.css';

function MyApp({ Component, pageProps }: AppProps) {
  const verifyToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    //토큰 만료시간 1분전
    const accessTokenTime = parseToken(accessToken!).exp * 1000 - 60000;
    const refreshTokenTime = parseToken(refreshToken!).exp * 1000 - 60000;

    const router = useRouter();

    //refreshToken이 만료되었다면 로그인 페이지로 이동
    if (refreshTokenTime < Date.now()) {
      router.push('/signin');
    }
    //accessToken이 만료되었다면 accessToken 재발급하여 다시 저장
    else if (accessTokenTime < Date.now()) {
      if (accessToken && refreshToken) {
        const newAccessToken = (await reIssueTokenAPI({ accessToken, refreshToken, isUpdated: false })).data
          .accessToken;
        localStorage.setItem('accessToken', newAccessToken);
      }
    }
  };

  return (
    //themeprovider를 이용해서 미리 정의한 테마 타입들을 뷰 단에서 사용
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

// export default wrapper.withRedux(withReduxSaga(MyApp));
export default wrapper.withRedux(MyApp);
