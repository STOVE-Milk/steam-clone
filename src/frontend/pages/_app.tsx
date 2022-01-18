import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import withRedux, { createWrapper } from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from 'styles/global-styles';
import { theme } from 'styles/theme';

import configureStore from 'modules/configureStore';
import Layout from 'templates/Layout';

import 'styles/globals.css';
import 'styles/font.css';

const store = configureStore();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

// const wrapper = createWrapper(store);
// export default wrapper.withRedux(MyApp);
export default MyApp;
