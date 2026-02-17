import { useForm, Link } from '@inertiajs/react';
import { Building2, ArrowLeft, Loader2, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { FormEvent } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { Checkbox } from '@/components/ui/checkbox';
import { Head } from '@inertiajs/react';

interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    timezone: string;
    is_active: boolean;
}

interface PageProps {
    company: Company;
}

export default function Edit({ company }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        timezone: company.timezone || 'UTC',
        is_active: company.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/companies/${company.id}`);
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
            <Head>
                <title>Edit Company</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <Building2 className="size-5 text-gray-700" />
                                Edit Company
                            </div>
                            <p className="text-sm text-gray-600">
                                Update company information
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
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold">Company Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
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

                                <div className="flex items-start gap-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <Label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                                            Active
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Inactive companies cannot access the system
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
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Company'
                                    )}
                                </Button>
                            </div>
                            </CardContent>
                            </Card>
                        </form>
                    </div>
            </Container>
        </MainLayout>
    );
}
