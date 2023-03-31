// pages/api/logout.ts

import {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '../../../lib/withSession';

export default withSessionRoute(logoutRouteHandler);

/**
 * Logs the user out
 * @param req {NextApiRequest}
 * @param res {NextApiResponse}
 */
async function logoutRouteHandler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    // destroy the session on the server
    req.session.destroy();
    // destroy the session on the client
    res.setHeader('Set-Cookie', `calculator-x-session=; Domain=calculator-x.vercel.app; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure; HttpOnly`);
    res.send({ ok: true, cookieName: 'calculator-x-session' });
}


