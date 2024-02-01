import GlobalStyles from "./../components/GlobalStyles";
import { ThemeProvider } from "next-themes";


function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
