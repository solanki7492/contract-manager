import { useForm } from '@inertiajs/react';
import { Building2, ArrowLeft, Loader2, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { FormEvent } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/companies">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Companies
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="w-7 h-7 text-blue-600" />
                        Create New Company
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Create a new company and its first admin user
                    </p>
                </div>

                {/* Form */}
                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Company Information Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="name">Company Name *</Label>
                                        <div className="relative mt-1">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Company Email</Label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                                placeholder="company@example.com"
                                            />
                                        </div>
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <div className="relative mt-1">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="phone"
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <div className="relative mt-1">
                                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <textarea
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                rows={3}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Enter company address"
                                            />
                                        </div>
                                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="timezone">Timezone *</Label>
                                        <div className="relative mt-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                            <select
                                                id="timezone"
                                                value={data.timezone}
                                                onChange={(e) => setData('timezone', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.timezone ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                {timezones.map((tz) => (
                                                    <option key={tz} value={tz}>
                                                        {tz}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.timezone && <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t"></div>

                            {/* First User Information Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">First Admin User</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="user_name">User Name *</Label>
                                        <div className="relative mt-1">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="user_name"
                                                type="text"
                                                value={data.user_name}
                                                onChange={(e) => setData('user_name', e.target.value)}
                                                className={`pl-10 ${errors.user_name ? 'border-red-500' : ''}`}
                                                placeholder="Enter user name"
                                            />
                                        </div>
                                        {errors.user_name && <p className="mt-1 text-sm text-red-600">{errors.user_name}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="user_email">User Email *</Label>
                                        <div className="relative mt-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                id="user_email"
                                                type="email"
                                                value={data.user_email}
                                                onChange={(e) => setData('user_email', e.target.value)}
                                                className={`pl-10 ${errors.user_email ? 'border-red-500' : ''}`}
                                                placeholder="user@example.com"
                                            />
                                        </div>
                                        {errors.user_email && <p className="mt-1 text-sm text-red-600">{errors.user_email}</p>}
                                        <p className="mt-1 text-xs text-gray-500">
                                            A temporary password will be generated and sent to this email
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/companies">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Company'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
