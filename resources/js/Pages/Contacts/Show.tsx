import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Users, Mail, Phone, Building2, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { Separator } from '@/components/ui/separator';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    organization: string | null;
    notes: string | null;
    creator?: User;
    created_at: string;
    updated_at: string;
}

interface ShowContactProps {
    contact: Contact;
}

export default function ShowContact({ contact }: ShowContactProps) {
    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <Users className="size-5 text-gray-700" />
                                Contact Details
                            </div>
                            <p className="text-sm text-gray-600">
                                View contact information
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

                    {/* Contact Information */}
                    <Card>
                        <CardHeader className="border-b border-gray-200 p-4">
                            <div>
                                <CardTitle className="text-2xl font-bold">{contact.name}</CardTitle>
                                <CardDescription className="mt-1">
                                    Created {new Date(contact.created_at).toLocaleDateString()}
                                    {contact.creator && ` by ${contact.creator.name}`}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-7.5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                        <Mail className="size-4" />
                                        Email Address
                                    </h3>
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="text-base text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        {contact.email}
                                    </a>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                        <Phone className="size-4" />
                                        Phone Number
                                    </h3>
                                    {contact.phone ? (
                                        <a
                                            href={`tel:${contact.phone}`}
                                            className="text-base text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            {contact.phone}
                                        </a>
                                    ) : (
                                        <p className="text-base text-gray-400">Not provided</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                        <Building2 className="size-4" />
                                        Organization
                                    </h3>
                                    <p className="text-base text-gray-900">
                                        {contact.organization || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                                    <p className="text-base text-gray-900">
                                        {new Date(contact.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {contact.notes && (
                                <>
                                    <Separator className="my-6" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                            <FileText className="size-4" />
                                            Notes
                                        </h3>
                                        <p className="text-base text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
                                    </div>
                                </>
                            )}

                            <Separator className="my-6" />
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/contacts/${contact.id}/edit`}>
                                        <Edit className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <DeleteConfirmDialog
                                    title="Delete Contact?"
                                    description={`Are you sure you want to delete "${contact.name}"? This action cannot be undone.`}
                                    onConfirm={() => router.delete(`/contacts/${contact.id}`)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </MainLayout>
    );
}
