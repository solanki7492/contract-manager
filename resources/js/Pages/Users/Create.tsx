import MainLayout from '../../Layouts/MainLayout';
import { useForm, Link, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';

interface Company {
    id: number;
    name: string;
}

interface CreateUserProps {
    companies?: Company[];
}

interface PageProps {
    auth?: {
        user?: {
            role?: string;
        };
    };
    [key: string]: any;
}

export default function CreateUser({ companies }: CreateUserProps) {
    const page = usePage<PageProps>();
    const isSuperAdmin = page.props.auth?.user?.role === 'superadmin';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'user',
        company_id: companies && companies.length > 0 ? companies[0].id.toString() : '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <UserPlus className="size-5 text-gray-700" />
                                Create New User
                            </div>
                            <p className="text-sm text-gray-600">
                                Add a new user to your company
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/users">
                                    <ArrowLeft className="size-4" />
                                    Back to Users
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* User Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold">User Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    {/* Name */}
                                    <div className="w-full">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Full Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter user's full name"
                                            className="h-10"
                                            required
                                        />
                                        {errors.name && <div className="mt-1.5 text-xs text-red-600">{errors.name}</div>}
                                    </div>

                                    {/* Email */}
                                    <div className="w-full">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter user's email address"
                                            className="h-10"
                                            required
                                        />
                                        {errors.email && <div className="mt-1.5 text-xs text-red-600">{errors.email}</div>}
                                        <p className="mt-1.5 text-xs text-gray-500">
                                            A temporary password will be sent to this email address
                                        </p>
                                    </div>

                                    {/* Company - Only for Superadmin */}
                                    {isSuperAdmin && companies && companies.length > 0 && (
                                        <div className="w-full">
                                            <Label htmlFor="company_id" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Company <span className="text-red-500">*</span>
                                            </Label>
                                            <select
                                                id="company_id"
                                                value={data.company_id}
                                                onChange={(e) => setData('company_id', e.target.value)}
                                                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Select a company</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.company_id && <div className="mt-1.5 text-xs text-red-600">{errors.company_id}</div>}
                                            <p className="mt-1.5 text-xs text-gray-500">
                                                Select which company this user belongs to
                                            </p>
                                        </div>
                                    )}

                                    {/* Role */}
                                    <div className="w-full">
                                        <Label htmlFor="role" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Role <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="user">User</option>
                                            <option value="company_admin">Company Admin</option>
                                        </select>
                                        {errors.role && <div className="mt-1.5 text-xs text-red-600">{errors.role}</div>}
                                        <p className="mt-1.5 text-xs text-gray-500">
                                            Company Admins can manage users and settings
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5">
                            <Button
                                type="submit"
                                disabled={processing}
                                size="sm"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create User'
                                )}
                            </Button>
                            <Button type="button" variant="outline" size="sm" asChild>
                                <Link href="/users">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </MainLayout>
    );
}
