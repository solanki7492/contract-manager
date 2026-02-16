import { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Eye, EyeOff, Loader2, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertIcon, AlertContent, AlertDescription } from '@/components/ui/alert';

type FormData = {
    email: string;
    password: string;
    remember: boolean;
};

type PageProps = {
    errors: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Login() {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm<FormData>({
        email: '',
        password: '',
        remember: true,
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
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
        post('/login');
    };

    return (
        <AuthLayout>
            <form onSubmit={submit} className="space-y-5 w-full">
                <div className="text-center space-y-1 pb-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Sign In</h1>
                    <p className="text-sm text-gray-600">
                        Welcome back! Log in with your credentials.
                    </p>
                </div>

                {/* Demo credentials alert */}
                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-900">
                            Use <strong>demo@kt.com</strong> username and{' '}
                            <strong>demo123</strong> password for demo access.
                        </div>
                    </div>
                </div> */}

                {/* Error message */}
                {(errorMessage || errors.email || errors.password) && (
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
                            {errorMessage || errors.email || errors.password || 
                            'Authentication failed. Please try again.'}
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
                        autoFocus
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
                            placeholder="Your password"
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

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', checked as boolean)}
                        />
                        <span className="text-sm">Remember me</span>
                    </label>
                    <Button
                        variant="dim"
                        mode="link"
                        size="sm"
                        asChild
                    >
                        <a href="/password/reset">Forgot Password?</a>
                    </Button>
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
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                {/* Sign up link */}
                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Button variant="dim" mode="link" size="sm" asChild>
                        <a href="/register">Sign Up</a>
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
