import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Users, Mail, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Container } from '@/components/common/container';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Head } from '@inertiajs/react';

interface Company {
    id: number;
    name: string;
}

interface Contact {
    id: number;
    name: string;
    email: string;
    company?: Company;
    last_login_at?: string;
    created_at: string;
}

interface PageProps {
    contacts: {
        data: Contact[];
        from: number;
        to: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
    };
}

export default function ContactsIndex({ contacts, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get('/contacts', { search }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/contacts');
    };

    return (
        <MainLayout>
            <Head>
                <title>Contacts</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <Users className="size-6 text-gray-700" />
                            <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
                        </div>
                        <Button asChild>
                            <Link href="/contacts/create">
                                <Plus className="w-5 h-5" />
                                Create Contact
                            </Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={handleFilter}
                                        className="flex-1"
                                    >
                                        Filter
                                    </Button>
                                    <Button
                                        onClick={handleReset}
                                        variant="secondary"
                                        className="flex-1"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contacts Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead className="text-left">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contacts.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Users className="size-12 text-gray-300" />
                                                        <p className="text-base font-medium">No contacts found</p>
                                                        <p className="text-sm">Get started by creating your first contact</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            contacts.data.map((contact) => (
                                                <TableRow key={contact.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">{contact.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-gray-900">
                                                            <Mail className="size-4 text-gray-400" />
                                                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">
                                                                {contact.email}
                                                            </a>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{contact.company?.name || 'N/A'}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2 justify-start">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/contacts/${contact.id}`}>
                                                                    <Eye className="size-4" />
                                                                    View
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/contacts/${contact.id}/edit`}>
                                                                    <Edit className="size-4" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <DeleteConfirmDialog
                                                                title="Delete Contact?"
                                                                description={`Are you sure you want to delete "${contact.name}"? This action cannot be undone.`}
                                                                onConfirm={() => router.delete(`/contacts/${contact.id}`)}
                                                                variant="icon"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {contacts.links && contacts.data.length > 0 && (
                                <div className="px-6 py-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {contacts.from} to {contacts.to} of {contacts.total} results
                                        </div>
                                        <div className="flex space-x-2">
                                            {contacts.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => link.url && router.visit(link.url)}
                                                    disabled={!link.url}
                                                    variant={link.active ? 'primary' : 'outline'}
                                                    size="sm"
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </MainLayout>
    );
}
