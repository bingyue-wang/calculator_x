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
    res.setHeader('Set-Cookie', 'calculator-x-session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=lax; Secure; HttpOnly');
    res.send({ ok: true, cookieName: 'calculator-x-session' });
}


