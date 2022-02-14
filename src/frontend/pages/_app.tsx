import type { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from 'styles/global-styles';
import { theme } from 'styles/theme';

import wrapper from 'modules/configureStore';
import Layout from 'templates/Layout';

import 'styles/globals.css';
import 'styles/font.css';

function MyApp({ Component, pageProps }: AppProps) {
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
