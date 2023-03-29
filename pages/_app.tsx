// entrance of the app

import {useEffect} from 'react';
import {useRouter} from 'next/router';
import '../styles/global.css';
import {ThemeProvider} from '../context/ThemeContext';

function App({Component, pageProps}) {
  const router = useRouter();

  useEffect(() => {
    const logCurrentPath = async () => {
      console.log('>>: ', router.pathname);
    };

    logCurrentPath();
  }, [router.pathname]);

  return <ThemeProvider>
    <Component {...pageProps} />
  </ThemeProvider>;
}

export default App;

