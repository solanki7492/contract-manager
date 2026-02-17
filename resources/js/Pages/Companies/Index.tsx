import { Link, router, usePage } from '@inertiajs/react';
import { Building2, Plus, Search, Edit, Users } from 'lucide-react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/common/container';
import { Head } from '@inertiajs/react'


interface Company {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    users_count: number;
    created_at: string;
}

interface PageProps {
    companies: {
        data: Company[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
    };
    [key: string]: unknown;
}

export default function Index() {
    const { companies, filters } = usePage<PageProps>().props;
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/companies', { search }, { preserveState: true });
    };

    return (
        <MainLayout>
            <Head>
                <title>Companies</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Building2 className="w-7 h-7" />
                                Companies
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">Manage companies and their users</p>
                        </div>
                        <Button asChild>
                            <Link href="/companies/create">
                                <Plus className="w-4 h-4" />
                                Add Company
                            </Link>
                        </Button>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search companies..."
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>

                    {/* Companies Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Users</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {companies.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-12">
                                                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                    <p className="text-gray-500">No companies found</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            companies.data.map((company) => (
                                                <TableRow key={company.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">{company.name}</div>
                                                        {company.address && (
                                                            <div className="text-sm text-gray-500">{company.address}</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {company.email && (
                                                            <div className="text-sm text-gray-900">{company.email}</div>
                                                        )}
                                                        {company.phone && (
                                                            <div className="text-sm text-gray-500">{company.phone}</div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-gray-700">
                                                            <Users className="w-4 h-4" />
                                                            {company.users_count}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={company.is_active ? 'success' : 'destructive'}>
                                                            {company.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/companies/${company.id}/edit`}>
                                                                <Edit className="w-4 h-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {companies.last_page > 1 && (
                                <div className="px-6 py-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{(companies.current_page - 1) * companies.per_page + 1}</span> to{' '}
                                            <span className="font-medium">
                                                {Math.min(companies.current_page * companies.per_page, companies.total)}
                                            </span>{' '}
                                            of <span className="font-medium">{companies.total}</span> results
                                        </div>
                                        <div className="flex gap-2">
                                            {companies.links.map((link, index) => (
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
