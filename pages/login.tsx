// pages/login.tsx
import {useState} from 'react';
import AuthForm from '../components/Auth/AuthForm';
import {useRouter} from 'next/router';
import {withSessionSsr} from "../lib/withSession";

/**
 * This page is only accessible if the user is not logged in. If the user is logged in, they will be redirected to the home page.
 * @constructor
 * @return {JSX.Element}
 * @return {JSX.Element} return - The login page
 */
const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onLogin = async (data: { username: string; password: string }) => {
        setLoading(true);

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        setLoading(false);

        if (response.ok) {
            await router.push('/');
        } else {
            const error = await response.json();
            alert(error.message);
        }
    }

    const enterAsAnonymous = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                <AuthForm buttonText="Log in" onSubmit={onLogin} loading={loading}/>
                <div className="text-center">
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </a>
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <button
                          onClick={enterAsAnonymous}
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            enter anonymously
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

      // Get the user from the session
      const user = req?.session?.user;

      // If the user is logged in, redirect to the index page
      if (user) {
          return {
              redirect: {
                  destination: '/',
                  permanent: false,
              },
          };
      }

      // If the user is not logged in, show the login page
      return {
          props: { user: user || null },
      };
  },
);

export default LoginPage;
