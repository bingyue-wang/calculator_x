// components/Auth/AuthForm.tsx
import React from 'react';
import {useForm} from 'react-hook-form';

interface AuthFormData {
    username: string;
    password: string;
}

interface AuthFormProps {
    buttonText: string;
    onSubmit: (data: AuthFormData) => void | Promise<void>;
    loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({buttonText, onSubmit, loading}) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<AuthFormData>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="username" className="sr-only">
                        Username
                    </label>
                    <input
                        {...register('username', {required: true})}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Username"
                    />
                    {errors.username && <p className="text-red-500 text-xs">Username is required.</p>}
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <input
                        {...register('password', {required: true})}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                    />
                    {errors.password && <p className="text-red-500 text-xs">Password is required.</p>}
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50' : ''}`}
                >
                    {loading ? (
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                            </svg>
                        </span>) : null}
                    {buttonText}
                </button>
            </div>
        </form>
    );
};

export default AuthForm;
