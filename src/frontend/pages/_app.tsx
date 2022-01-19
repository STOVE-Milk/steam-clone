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
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

// const wrapper = createWrapper(store);
// export default wrapper.withRedux(MyApp);
export default wrapper.withRedux(MyApp);
