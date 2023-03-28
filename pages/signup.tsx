// pages/signup.tsx
import { useState } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import { useRouter } from 'next/router';
import {withSessionSsr} from "../lib/withSession";

/**
 * Signup page component that renders the signup form and handles the signup logic.
 * It also redirects the user to the login page if the signup was successful.
 * @constructor
 */
const SignupPage = () => {
    // Get the router object
    const router = useRouter();

    // State to keep track of the loading state
    const [loading, setLoading] = useState(false);

    // Handle the signup logic and redirect the user to the login page if the signup was successful
    const onSignup = async (data: { username: string; password: string }) => {
        // Set the loading state to true
        setLoading(true);

        // Send the signup request to the API
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Set the loading state to false after the request is finished
        setLoading(false);

        // If the signup was successful, redirect the user to the login page
        if (response.ok) {
            router.push('/');
        } else {
            // Otherwise, show an error message
            const error = await response.json();
            alert(error.message);
        }
    };

    // Render the signup form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                <AuthForm buttonText="Sign up" onSubmit={onSignup} loading={loading} />
            </div>
        </div>
    );
};

/**
 * This function is called on the server side before the page is rendered.
 * It is used to check if the user is logged in. If the user is logged in, the user is redirected to the home page.
 */
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

        // If the user is not logged in, show the signup page
        return {
            props: {},
        };
    },
);

export default SignupPage;
