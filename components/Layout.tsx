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


  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout');
    router.push('/login');
  }, [router]);

  const handleLogin = useCallback(async () => {
      await fetch('/api/auth/login');
      router.push('/login');
    }
    , [router]);

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
            <Link href="/about">
              <span>About</span>
            </Link>
            <Link href="/users">
              <span>Users List</span>
            </Link>
            <a href="/api/users">Users API</a>
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
      <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <span>❤️ Best Calculator App Designed Just For You ❤️</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
