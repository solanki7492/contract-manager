import MainLayout from '../../Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { ArrowLeft, Users, Mail, Phone, Building2, FileText } from 'lucide-react';

export default function CreateContact() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        organization: '',
        notes: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/contacts');
    };

    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <Users className="size-5 text-gray-700" />
                                Create New Contact
                            </div>
                            <p className="text-sm text-gray-600">
                                Add a new contact to your address book
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/contacts">
                                    <ArrowLeft className="size-4" />
                                    Back to Contacts
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    {/* Name */}
                                    <div className="w-full">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Full Name <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Users className="size-4 text-gray-400" />
                                            </div>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter full name"
                                                className="h-10 pl-10"
                                                required
                                            />
                                        </div>
                                        {errors.name && <div className="mt-1.5 text-xs text-red-600">{errors.name}</div>}
                                    </div>

                                    {/* Email and Phone */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Email Address <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Mail className="size-4 text-gray-400" />
                                                </div>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="email@example.com"
                                                    className="h-10 pl-10"
                                                    required
                                                />
                                            </div>
                                            {errors.email && <div className="mt-1.5 text-xs text-red-600">{errors.email}</div>}
                                        </div>

                                        <div>
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Phone Number
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <Phone className="size-4 text-gray-400" />
                                                </div>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="h-10 pl-10"
                                                />
                                            </div>
                                            {errors.phone && <div className="mt-1.5 text-xs text-red-600">{errors.phone}</div>}
                                        </div>
                                    </div>

                                    {/* Organization */}
                                    <div className="w-full">
                                        <Label htmlFor="organization" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Organization
                                        </Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <Building2 className="size-4 text-gray-400" />
                                            </div>
                                            <Input
                                                id="organization"
                                                type="text"
                                                value={data.organization}
                                                onChange={(e) => setData('organization', e.target.value)}
                                                placeholder="Enter organization name"
                                                className="h-10 pl-10"
                                            />
                                        </div>
                                        {errors.organization && <div className="mt-1.5 text-xs text-red-600">{errors.organization}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <FileText className="size-4" />
                                    Additional Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    <div>
                                        <Label htmlFor="notes" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Notes
                                        </Label>
                                        <textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={4}
                                            placeholder="Enter any additional notes about this contact..."
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                        {errors.notes && <div className="mt-1.5 text-xs text-red-600">{errors.notes}</div>}
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
                                {processing ? 'Creating...' : 'Create Contact'}
                            </Button>
                            <Button type="button" variant="outline" size="sm" asChild>
                                <Link href="/contacts">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </MainLayout>
    );
}
