import React, {ReactNode, useCallback} from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {useRouter} from 'next/router';
import ThemeSwitcher from './ThemeSwitcher';
import {useTheme} from '../context/ThemeContext';

type Props = {
  children?: ReactNode
  title?: string
  user?: {
    _id: string
    username: string
  }
}

const Layout = ({
                  children,
                  title = 'This is the default title',
                  user
                }: Props) => {
  const router = useRouter();
  const {theme} = useTheme();

  const headerClassName = theme === 'light' ? 'bg-blue-500' : 'bg-gray-800';
  const footerClassName = theme === 'light' ? 'bg-blue-500' : 'bg-gray-800';
  const bodyClassName = theme === 'light' ? 'bg-blue-100' : 'bg-gray-400';

  const handleLogout = useCallback(async () => {
    const response = await fetch('/api/auth/logout');
    const responseData = await response.json();
    console.log(responseData.cookieName);
    if (responseData.ok) {
      // Delete the cookie by setting its value to an empty string and max-age to 0
      document.cookie = `${responseData.cookieName}=; max-age=0; path=/`;

      router.push('/login');
    } else {
      console.error('Logout failed:', response);
    }
  }, [router]);

  const handleLogin = useCallback(async () => {
      await router.push('/login');
    }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>
      <header className={`${headerClassName} text-white py-4`}>
        <nav className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <Link href="/">
              <span className="text-xl font-bold">Home</span>
            </Link>
            <span className="text-gray-300">
                Welcome, {user ? user.username : 'Anonymous'}
            </span>
          </div>
          <div className="flex space-x-4 items-center justify-center md:justify-end">
            <Link href="/calculator">
              <span>Calculator</span>
            </Link>
            <Link href="/about">
              <span>Design Docs</span>
            </Link>
            {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded shadow"
                >
                  Logout
                </button>
              ) :
              <button
                onClick={handleLogin}
                className="bg-red-500 px-4 py-2 rounded shadow"
              >
                Login
              </button>
            }
            <ThemeSwitcher/>
          </div>
        </nav>
      </header>
      <main className={`${bodyClassName} flex justify-center flex-grow container min-w-full py-8 px-4`}>{children}</main>
      <footer className={`${footerClassName} text-white py-4`}>
        <div className="container mx-auto text-center">
          <span>❤️ Best Calculator App Designed Just For You ❤️</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
