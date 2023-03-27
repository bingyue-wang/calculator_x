// pages/api/auth/login.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '../../../lib/withSession';

import bcrypt from 'bcryptjs';
import {connectToDatabase} from "../../../lib/db";
import {LoginResponse, User, UserWithPassword} from "../../../interfaces";

export default withSessionRoute(loginRouteHandler);

/**
 * Logs the user in
 * @param req {NextApiRequest}
 * @param res {NextApiResponse<LoginResponse>}
 * @returns {Promise<void>}
 */
async function loginRouteHandler(req: NextApiRequest, res: NextApiResponse<LoginResponse>): Promise<void> {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({status: 'error', message: 'Method not allowed'});
    }

    // Validate the request body
    const {username, password} = req.body;

    // Check if the user already exists in the users collection
    const {db} = await connectToDatabase();

    // get the user from the database
    const dbUser: UserWithPassword = await db.collection('users').findOne({username});


    // if the user doesn't exist, return an error
    if (!dbUser) {
        return res.status(401).json({status: 'error', message: 'User not found'});
    }

    // Compare the password
    const isPasswordValid: boolean = await bcrypt.compare(password, dbUser.password);

    // If the password is incorrect, return an error
    if (!isPasswordValid) {
        return res.status(401).json({status: 'error', message: 'Invalid credentials'});
    }

    // Log the user in, by setting the user in the session
    const user: User = {
        _id: dbUser._id,
        username: dbUser.username,
    }
    req.session.user = user

    // Save the session
    await req.session.save();

    // Return the user
    return res.status(200)
        .json({status: 'success', message: 'Logged in', user});
}
