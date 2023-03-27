// pages/login.tsx
import {useState} from 'react';
import AuthForm from '../components/Auth/AuthForm';
import {useRouter} from 'next/router';

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
            router.push('/');
        } else {
            const error = await response.json();
            alert(error.message);
        }
    }

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
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
