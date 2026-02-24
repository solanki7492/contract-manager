import { useForm, Link } from '@inertiajs/react';
import { Building2, ArrowLeft, Loader2, Phone, Globe } from 'lucide-react';
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
    phone: string | null;
    timezone: string;
    is_active: boolean;
}

interface PageProps {
    company: Company;
}

export default function Edit({ company }: PageProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || '',
        phone: company.phone || '',
        timezone: company.timezone || 'UTC',
        is_active: company.is_active,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/companies/${company.id}`);
    };

    const getFormattedTimezones = () => {
        const zones = (Intl as any).supportedValuesOf('timeZone');
        const now = new Date();

        return zones.map((tz: string) => {
            const dtf = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'longOffset',
            });

            const parts = dtf.formatToParts(now);
            const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value || '';

            // offsetPart example: "GMT-06:00"
            const cleanOffset = offsetPart.replace('GMT', 'UTC');

            return {
                value: tz,
                label: `(${cleanOffset}) ${tz.replace(/_/g, ' ')}`,
                offset: cleanOffset,
            };
        }).sort((a: { offset: string }, b: { offset: string }) => {
            return a.offset.localeCompare(b.offset);
        });
    };

    const timezones = getFormattedTimezones();

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
                                        <Label htmlFor="timezone">Timezone *</Label>
                                        <div className="relative mt-1">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                            <select
                                                id="timezone"
                                                value={data.timezone}
                                                onChange={(e) => setData('timezone', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.timezone ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                {timezones.map((tz: any) => (
                                                    <option key={tz.value} value={tz.value}>
                                                        {tz.label}
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
