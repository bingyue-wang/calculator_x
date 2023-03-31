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
    console.log('api, Logging out...');
    req.session.destroy();
    console.log('api, Logged out successfully!');
    res.send({ ok: true });
}
