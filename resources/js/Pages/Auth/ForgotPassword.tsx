import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AuthLayout from '../../Layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Head } from '@inertiajs/react';

type FormData = {
    email: string;
};

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<FormData>({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/password/email');
    };

    return (
        <AuthLayout>
            <Head>
                <title>Forgot Password</title>
            </Head>
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Info Alert */}
                            <Alert className="bg-blue-50 text-blue-900 border-blue-200">
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    You will receive an email with instructions to reset your password.
                                </AlertDescription>
                            </Alert>

                            {/* Success Alert */}
                            {recentlySuccessful && (
                                <Alert className="bg-green-50 text-green-900 border-green-200">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Reset link sent! Check your email for instructions.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Error Alert */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {errors.email || 'Failed to send reset link. Please try again.'}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Your email"
                                    required
                                    autoFocus
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Reset Link
                            </Button>

                            {/* Back to login link */}
                            <div className="text-center pt-2">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Sign In
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
