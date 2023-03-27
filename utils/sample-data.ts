import {User} from '../interfaces'
import {ObjectId} from 'mongodb';

/** Dummy user data. */
export const sampleUserData: User[] = [
    {_id: new ObjectId('123alice'), username: 'Alice'},
    {_id: new ObjectId('123bob'), username: 'Bob'},
    {_id: new ObjectId('123caroline'), username: 'Caroline'},
    {_id: new ObjectId('123dave'), username: 'Dave'},
]
