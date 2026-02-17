import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Eye, EyeOff, Loader2, Info, XCircle, CheckCircle, X } from 'lucide-react';
import { Head } from '@inertiajs/react';

type FormData = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type PageProps = {
    token: string;
    email: string;
    errors: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ResetPassword() {
    const { token, email, flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm<FormData>({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.error) {
            setErrorMessage(flash.error);
        }
        if (flash?.success) {
            setSuccessMessage(flash.success);
        }
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        post('/password/reset');
    };

    return (
        <AuthLayout>
            <Head>
                <title>Reset Password</title>
            </Head>
            <form onSubmit={submit} className="space-y-5 w-full">
                <div className="text-center space-y-1 pb-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Reset Password</h1>
                    <p className="text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                {/* Info alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                            Your new password must be at least 8 characters long.
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {(errorMessage || Object.keys(errors).length > 0) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => setErrorMessage(null)}
                                    className="float-right text-red-600 hover:text-red-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="text-sm text-red-900 font-medium">
                                    {errorMessage || errors.email || 'Failed to reset password. Please try again.'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => setSuccessMessage(null)}
                                    className="float-right text-green-600 hover:text-green-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="text-sm text-green-900 font-medium">{successMessage}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Email field (readonly) */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        readOnly
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="New password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {passwordVisible ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password field */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {confirmPasswordVisible ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Resetting Password...
                        </span>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}
