import type { AppProps } from 'next/app';
import { NextPage, NextPageContext } from 'next';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from 'styles/global-styles';
import { theme } from 'styles/theme';

import wrapper from 'modules/configureStore';
import Layout from 'templates/Layout';

import 'styles/globals.css';
import 'styles/font.css';

// interface IAppProps {
//   Component: NextPage;
//   ctx: NextPageContext;
// }

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

// 여기서 실행 안됨 일단은
// MyApp.getInitialProps = async ({ Component, ctx }: IAppProps) => {
//   let pageProps = {};

//   // 실행하고자 하는 component에 getInitialprops가 있으면 실행하여 props를 받아올 수 있다.
//   if (Component.getInitialProps) {
//     pageProps = await Component.getInitialProps(ctx);
//   }

//   return {
//     pageProps,
//   };
// };

// export default wrapper.withRedux(withReduxSaga(MyApp));
export default wrapper.withRedux(MyApp);
