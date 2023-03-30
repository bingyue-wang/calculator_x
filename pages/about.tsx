import Layout from '../components/Layout';
import {withSessionSsr} from '../lib/withSession';

/**
 * About page component.
 * @param user
 * @constructor
 */
const AboutPage = ({user}) => (
  <Layout title="About | Next.js + TypeScript Example" user={user}>
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-6">Design Document: Calculator
        Web App</h1>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
        <p className="mb-4">The calculator web app is a full-stack application
          built using React, Next.js, and MongoDB. Users can sign up, sign in,
          perform calculations, and view their calculation history.</p>

        <h2 className="text-2xl font-semibold mb-4">2. Main Components</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li><b>Frontend</b>: React and Next.js</li>
          <li><b>Backend</b>: Next.js API routes and MongoDB</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">3. Features</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li>User authentication (signup and signin)</li>
          <li>Calculator with basic and advanced operations</li>
          <li>Calculation history</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">4. Functionality</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li>User signup and signin</li>
          <li>Calculator component
            <ul className="list-disc list-inside pl-6">
              <li>Input and display of numbers and operations</li>
              <li>Handling of operations and advanced operations
                <ul className="list-disc list-inside pl-6">
                  <li>Basic operations: ['+', '-', '×', '÷']</li>
                  <li>Advanced operations: ['%', '√', '^', 'mod']</li>
                </ul>
              </li>
              <li>Calculation of results</li>
              <li>Handling of calculation history</li>
            </ul>
          </li>
          <li>Calculation history
            <ul className="list-disc list-inside pl-6">
              <li>Fetching history from the API</li>
              <li>Displaying history</li>
              <li>Deleting history items</li>
            </ul>
          </li>
        </ol>


        <h2 className="text-2xl font-semibold mb-4">5. User Interface</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li>Signup and signin forms</li>
          <li>Calculator
            <ul className="list-disc list-inside pl-6">
              <li>Display for input and result</li>
              <li>Buttons for numbers, basic operations, and advanced
                operations
              </li>
            </ul>
          </li>
          <li>Calculation history
            <ul className="list-disc list-inside pl-6">
              <li>List of previous calculations with expressions and results
              </li>
              <li>Option to delete individual history items</li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="bg-white shadow-md rounded p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">6. API Endpoints</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li>User authentication
            <ul className="list-disc list-inside pl-6">
              <li>Signup: <code>/api/auth/signup</code></li>
              <li>Signin: <code>/api/auth/signin</code></li>
            </ul>
          </li>
          <li>Calculation history
            <ul className="list-disc list-inside pl-6">
              <li>Fetch history: <code>/api/history</code> (GET)</li>
              <li>Add history item: <code>/api/history</code> (POST)</li>
              <li>Delete history item: <code>/api/history</code> (DELETE)</li>
            </ul>
          </li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">7. Dependencies</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li>React</li>
          <li>Next.js</li>
          <li>MongoDB</li>
          <li>Tailwind CSS</li>
          <li>Decimal.js</li>
        </ol>

        <h2 className="text-2xl font-semibold mb-4">8. Future Enhancements</h2>
        <ol className="list-decimal list-outside pl-6 mb-4">
          <li>Clean up Calculator.tsx, covert it to smaller components</li>
          <li>Adding more advanced operations</li>
          <li>Allowing users to share calculation history with others</li>
        </ol>
      </div>
    </div>
  </Layout>
);

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
      props: {user},
    };
  },
);

export default AboutPage;
