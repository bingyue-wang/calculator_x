import React, {ReactNode, useCallback} from 'react'
import Link from 'next/link'
import Head from 'next/head'
import {useRouter} from "next/router";

type Props = {
    children?: ReactNode
    title?: string
}

const Layout = ({children, title = 'This is the default title'}: Props) => {
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        await fetch('/api/auth/logout');
        router.push('/login');
    }, [router]);

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8"/>
                <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            </Head>
            <header>
                <nav>
                    <Link href="/">Home</Link> | <Link href="/about">About</Link> |{' '}
                    <Link href="/users">Users List</Link> |{' '}
                    <a href="/api/users">Users API</a>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </header>
            {children}
            <footer>
                <hr/>
                <span>I'm here to stay (Footer)</span>
            </footer>
        </div>
    );
};

export default Layout;
