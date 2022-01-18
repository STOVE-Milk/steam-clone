import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/global-styles';
import { theme } from 'styles/theme';

import configureStore from 'modules/configureStore';
import Layout from 'templates/Layout';

import 'styles/globals.css';

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

export default MyApp;
