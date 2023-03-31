// lib/withSession.ts

import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from "next";

// This is the secret used to encrypt the session cookie
const sessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: "calculator-x-session",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: false,
    },
};

// This function wraps the handler function with the withIronSession function and adds the session to the context object of the handler function (for API routes)
export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

// This function wraps the handler function with the withIronSession function and adds the session to the context object of the handler function (for SSR)
export function withSessionSsr<
    P extends { [key: string]: unknown } = { [key: string]: unknown },
    >(
    handler: (
        context: GetServerSidePropsContext,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, sessionOptions);
}
