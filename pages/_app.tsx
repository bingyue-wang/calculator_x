// entrance of the app

import {useEffect} from "react";
import {useRouter} from "next/router";
// import {connectToDatabase} from "../lib/db";

/**
 * This is the entrance of the app, it is called every time a page is loaded,
 * so we can check if the user is authenticated here, and redirect to the login page if not.
 * @param Component
 * @param pageProps
 * @constructor
 */
function App({Component, pageProps}) {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            // const {client, db} = await connectToDatabase();
            // const session = JSON.parse(localStorage.getItem("session"));
            // const users = await db.collection("users").find().toArray();
            // const isAuthenticated = users.some(
            //     (user) =>
            //         user.username === session?.username && user.password === session?.password
            // );
            //
            // if (!isAuthenticated && router.pathname !== "/login") {
            //     router.push("/login");
            // } else if (isAuthenticated && router.pathname === "/login") {
            //     router.push("/");
            // }
        };

        checkAuth();
    }, [router.pathname]);

    return <Component {...pageProps} />;
}

export default App;

