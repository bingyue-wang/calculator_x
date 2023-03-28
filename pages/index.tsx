// pages/index.tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Calculator from '../components/Calculator/Calculator';
import {withSessionSsr} from '../lib/withSession';
import Layout from "../components/Layout";

/**
 * Index page component that renders the calculator.
 * @param user
 * @constructor
 */
const IndexPage = ({ user }) => {
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <Layout title="Calculator-x" user={user}>
        <Calculator user={user}/>
    </Layout>
};

/**
 * This function is called on every request to the server.
 * It checks if the user is logged in and if not, redirects to the login page.
 */
export const getServerSideProps = withSessionSsr(
    async function getServerSideProps({ req }) {

        // Get the user from the session
        const user = req.session.user;

        // If the user is not logged in, redirect to the login page
        if (!user) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        // If the user is logged in, return the user object
        return {
            props: {
                user,
            },
        };
    },
);

export default IndexPage;
