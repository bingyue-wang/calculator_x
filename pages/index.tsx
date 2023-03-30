// pages/index.tsx
import {withSessionSsr} from '../lib/withSession';
import Layout from '../components/Layout';
import Link from 'next/link';
import React from 'react';

/**
 * Index page component that renders the calculator.
 * @param user
 * @constructor
 */
const IndexPage = ({user}) => {

  return (
    <Layout title="Calculator-x" user={user}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
          {user ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Hi {user.username}!</h2>
              <div className="mb-4">
                You are logged in, enjoy your full access to the calculator app! your
                calculation history will be save in database.
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Hi Anonymous User!</h2>
              <div className="mb-4">
                You are not logged in, you can use the calculator without saving your
                history to database.
              </div>
            </div>
          )}
          <div className="flex flex-col items-center">
            <Link
              href={"/calculator"}
              className="py-2 px-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 mb-2"
            >
              <span>Go to Calculator</span>
            </Link>
            <Link
              href={"/about"}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
            >
              <span>Check the docs</span>
            </Link>
          </div>
        </div>
      </div>

    </Layout>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({req}) {
    // Get the user from the session
    const user = req?.session?.user;

    // Pass the user object to the IndexPage component
    return {
      props: {user: user || null},
    };
  }
);

export default IndexPage;
