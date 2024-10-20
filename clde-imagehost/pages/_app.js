// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Setze den Hellmodus als Standardmodus
    document.documentElement.classList.add('light-mode');
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
