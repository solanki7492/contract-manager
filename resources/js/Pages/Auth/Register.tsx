import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Eye, EyeOff, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertIcon, AlertContent, AlertDescription } from '@/components/ui/alert';
import { Head } from '@inertiajs/react';

type FormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
};

type PageProps = {
    errors: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Register() {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
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
        post('/register');
    };

    return (
        <AuthLayout>
            <Head>
                <title>Register</title>
            </Head>
            <form onSubmit={submit} className="space-y-5 w-full">
                <div className="text-center space-y-1 pb-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Sign Up</h1>
                </div>

                {/* Error message */}
                {(errorMessage || Object.keys(errors).length > 0) && (
                    <Alert
                        variant="destructive"
                        appearance="light"
                        size="md"
                        close
                        onClose={() => setErrorMessage(null)}
                    >
                        <AlertIcon>
                            <XCircle />
                        </AlertIcon>

                        <AlertContent>
                            <AlertDescription>
                                {errorMessage || 'Please fix the errors below and try again.'}
                            </AlertDescription>
                        </AlertContent>
                    </Alert>
                )}

                {/* Success message */}
                {successMessage && (
                    <Alert
                        variant="success"
                        appearance="light"
                        size="md"
                        close
                        onClose={() => setSuccessMessage(null)}
                    >
                        <AlertIcon>
                            <CheckCircle />
                        </AlertIcon>

                        <AlertContent>
                            <AlertDescription>
                                {successMessage}
                            </AlertDescription>
                        </AlertContent>
                    </Alert>
                )}

                {/* Name field */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        variant="lg"
                        required
                        autoFocus
                        aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        variant="lg"
                        required
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                {/* Password field */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            variant="lg"
                            className="pr-10"
                            required
                            aria-invalid={!!errors.password}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute right-0 top-0 h-full px-3"
                        >
                            {passwordVisible ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                {/* Confirm Password field */}
                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <div className="relative">
                        <Input
                            id="password_confirmation"
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            variant="lg"
                            className="pr-10"
                            required
                            aria-invalid={!!errors.password_confirmation}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            className="absolute right-0 top-0 h-full px-3"
                        >
                            {confirmPasswordVisible ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                    {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                </div>

                {/* Terms and conditions */}
                <div>
                    <label className="flex items-start gap-2 cursor-pointer">
                        <Checkbox
                            checked={data.terms}
                            onCheckedChange={(checked) => setData('terms', checked as boolean)}
                        />
                        <span className="text-sm">
                            I agree to the{' '}
                            <Button variant="dim" mode="link" size="sm" asChild>
                                <a href="/terms">Terms of Service</a>
                            </Button>{' '}
                            and{' '}
                            <Button variant="dim" mode="link" size="sm" asChild>
                                <a href="/privacy">Privacy Policy</a>
                            </Button>
                        </span>
                    </label>
                    {errors.terms && <p className="text-sm text-destructive">{errors.terms}</p>}
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    disabled={processing}
                    variant="primary"
                    size="lg"
                    className="w-full"
                >
                    {processing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </Button>

                {/* Sign in link */}
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Button variant="dim" mode="link" size="sm" asChild>
                        <Link href="/login">Sign In</Link>
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
