import type { AppProps } from 'next/app';
// import 'styles/globals.css'
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/global-styles';
import { theme } from 'styles/theme';
import Layout from 'components/Layout';

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

export default MyApp;
