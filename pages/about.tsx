import Link from 'next/link'
import Layout from '../components/Layout'
import {withSessionSsr} from '../lib/withSession';

/**
 * About page component.
 * @param user
 * @constructor
 */
const AboutPage = ({user}) => (
  <Layout title="About | Next.js + TypeScript Example" user={user}>
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <Link href="/">Go home</Link>
    </p>
  </Layout>
)

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({req}) {

    // Get the user from the session
    const user = req?.session?.user;

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: { user },
    };
  },
);

export default AboutPage
