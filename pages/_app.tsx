// entrance of the app

import {useEffect} from "react";
import {useRouter} from "next/router";
import '../styles/global.css'

function App({Component, pageProps}) {
    const router = useRouter();

    useEffect(() => {
        const logCurrentPath = async () => {
            console.log('>>: ',router.pathname);
        };

        logCurrentPath();
    }, [router.pathname]);

    return <Component {...pageProps} />
}

export default App;

