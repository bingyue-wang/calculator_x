// pages/index.tsx
import Calculator from '../components/Calculator/Calculator';
import {withSessionSsr} from '../lib/withSession';
import Layout from "../components/Layout";

/**
 * Index page component that renders the calculator.
 * @param user
 * @constructor
 */
const IndexPage = ({ user }) => {

    return (
      <Layout title="Calculator-x" user={user}>
          {user ? (
            <Calculator user={user} />
          ) : (
            <div>Please log in to access the calculator</div>
          )}
      </Layout>
    );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
      // Get the user from the session
      const user = req?.session?.user;

      // Pass the user object to the IndexPage component
      return {
          props: { user: user || null },
      };
  }
);

export default IndexPage;
