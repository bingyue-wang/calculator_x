// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

import { ObjectId } from 'mongodb';

export type User = {
    _id: ObjectId
    username: string
}

export interface UserWithPassword extends User {
    password: string;
}

export type SignupResponse = {
    status: 'success';
    message: string;
    user: User;
} | {
    status: 'error';
    message: string;
};

export type LoginResponse = {
    status: 'success';
    message: string;
    user: User;
} | {
    status: 'error';
    message: string;
};
