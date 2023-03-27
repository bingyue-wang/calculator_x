// pages/api/auth/signup.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {withSessionRoute} from '../../../lib/withSession';
import bcrypt from 'bcryptjs';
import {connectToDatabase} from "../../../lib/db";
import {SignupResponse, User, UserWithPassword} from "../../../interfaces";

export default withSessionRoute(signupHandler);

/**
 * Creates a new user and logs them in.
 * @param req {NextApiRequest}
 * @param res {NextApiResponse<SignupResponse>}
 * @returns {Promise<void>}
 */
async function signupHandler(req: NextApiRequest, res: NextApiResponse<SignupResponse>): Promise<void> {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({status: 'error', message: 'Method not allowed'});
    }

    // Validate the request body
    const {username, password} = req.body;

    // Check if the user already exists
    const {db} = await connectToDatabase();

    const existingUser: UserWithPassword = await db.collection('users').findOne({username});

    // If the user already exists, return an error
    if (existingUser) {
        return res.status(422).json({status: 'error', message: 'User already exists'});
    }

    // Hash the password
    const hashedPassword: string = await bcrypt.hash(password, 12);

    // Create a new user
    const result = await db.collection('users').insertOne({username, password: hashedPassword});

    const user: User = {
        _id: result.insertedId,
        username,
    }
    // Set the user in the session
    req.session.user = user

    // Save the session
    await req.session.save();

    // Return the user
    return res.status(201).json({status: 'success', message: 'User created', user});
}
