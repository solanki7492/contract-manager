import { useForm, Link } from '@inertiajs/react';
import { Building2, ArrowLeft, Loader2, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { FormEvent } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/common/container';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        timezone: 'UTC',
        user_name: '',
        user_email: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/companies');
    };

    const timezones = [
        'UTC',
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Asia/Dubai',
        'Australia/Sydney',
    ];

    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <Building2 className="size-5 text-gray-700" />
                                Create New Company
                            </div>
                            <p className="text-sm text-gray-600">
                                Create a new company and its first admin user
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/companies">
                                    <ArrowLeft className="size-4" />
                                    Back to Companies
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Company Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Company Information */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Building2 className="size-4" />
                                    Company Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Company Name <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`pl-10 h-10 ${errors.name ? 'border-red-500' : ''}`}
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Company Email
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`pl-10 h-10 ${errors.email ? 'border-red-500' : ''}`}
                                                    placeholder="company@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Phone
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="phone"
                                                    type="text"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className={`pl-10 h-10 ${errors.phone ? 'border-red-500' : ''}`}
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Address
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <textarea
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                rows={3}
                                                className={`w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Enter company address"
                                            />
                                        </div>
                                        {errors.address && <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="timezone" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Timezone <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                            <select
                                                id="timezone"
                                                value={data.timezone}
                                                onChange={(e) => setData('timezone', e.target.value)}
                                                className={`w-full h-10 pl-10 pr-4 py-2 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.timezone ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                {timezones.map((tz) => (
                                                    <option key={tz} value={tz}>
                                                        {tz}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.timezone && <p className="mt-1.5 text-xs text-red-600">{errors.timezone}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin User Information */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <User className="size-4" />
                                    Admin User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <div>
                                            <Label htmlFor="user_name" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Admin Name <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="user_name"
                                                    type="text"
                                                    value={data.user_name}
                                                    onChange={(e) => setData('user_name', e.target.value)}
                                                    className={`pl-10 h-10 ${errors.user_name ? 'border-red-500' : ''}`}
                                                    placeholder="Enter admin name"
                                                    required
                                                />
                                            </div>
                                            {errors.user_name && <p className="mt-1.5 text-xs text-red-600">{errors.user_name}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="user_email" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Admin Email <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    id="user_email"
                                                    type="email"
                                                    value={data.user_email}
                                                    onChange={(e) => setData('user_email', e.target.value)}
                                                    className={`pl-10 h-10 ${errors.user_email ? 'border-red-500' : ''}`}
                                                    placeholder="admin@company.com"
                                                    required
                                                />
                                            </div>
                                            {errors.user_email && <p className="mt-1.5 text-xs text-red-600">{errors.user_email}</p>}
                                            <p className="mt-1.5 text-xs text-gray-500">
                                                A temporary password will be generated and sent to this email
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5">
                            <Button type="submit" disabled={processing} size="sm">
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Company'
                                )}
                            </Button>
                            <Button type="button" variant="outline" size="sm" asChild>
                                <Link href="/companies">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </MainLayout>
    );
}
