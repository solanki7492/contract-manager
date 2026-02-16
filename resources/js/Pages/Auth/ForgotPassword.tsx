import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Loader2, Info, XCircle, CheckCircle, X, ArrowLeft } from 'lucide-react';

type FormData = {
    email: string;
};

type PageProps = {
    errors: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ForgotPassword() {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm<FormData>({
        email: '',
    });

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
        post('/password/email');
    };

    return (
        <AuthLayout>
            <form onSubmit={submit} className="space-y-5 w-full">
                <div className="text-center space-y-1 pb-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Forgot Password</h1>
                    <p className="text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Info alert */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                            You will receive an email with instructions to reset your password.
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {(errorMessage || errors.email) && (
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
                                    {errorMessage || errors.email || 'Failed to send reset link. Please try again.'}
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

                {/* Email field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        autoFocus
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                            Sending...
                        </span>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>

                {/* Back to login link */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Sign In
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
