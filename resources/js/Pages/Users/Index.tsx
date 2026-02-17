import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Users as UsersIcon, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/common/container';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Head } from '@inertiajs/react';

interface Company {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    company?: Company;
    last_login_at?: string;
    created_at: string;
}

interface PageProps {
    users: {
        data: User[];
        from: number;
        to: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search?: string;
        role?: string;
    };
}

export default function UsersIndex({ users, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    const handleFilter = () => {
        router.get('/users', { search, role }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setRole('');
        router.get('/users');
    };

    const getRoleBadgeVariant = (userRole: string) => {
        switch (userRole) {
            case 'superadmin':
                return 'destructive';
            case 'company_admin':
                return 'warning';
            default:
                return 'secondary';
        }
    };

    const getRoleLabel = (userRole: string) => {
        switch (userRole) {
            case 'superadmin':
                return 'Super Admin';
            case 'company_admin':
                return 'Company Admin';
            case 'user':
                return 'User';
            default:
                return userRole;
        }
    };

    const handleDeleteUser = (userId: number) => {
        router.delete(`/users/${userId}`, {
            onSuccess: () => {
                // Optionally show a success message or refresh the list
            },
        });
    }

    return (
        <MainLayout>
            <Head>
                <title>Users</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <UsersIcon className="size-6 text-gray-700" />
                            <h1 className="text-3xl font-bold text-mono">Users</h1>
                        </div>
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="w-5 h-5" />
                                Create User
                            </Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Search users..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    />
                                </div>
                                <div>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="superadmin">Super Admin</option>
                                        <option value="company_admin">Company Admin</option>
                                        <option value="user">User</option>
                                    </select>
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

                    {/* Users Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Company</TableHead>
                                            <TableHead>Last Login</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            users.data.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">{user.name}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{user.email}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                                            {getRoleLabel(user.role)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{user.company?.name || 'N/A'}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">
                                                            {user.last_login_at
                                                                ? new Date(user.last_login_at).toLocaleDateString()
                                                                : 'Never'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/users/${user.id}/edit`}>
                                                                    <Edit className="size-4" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <DeleteConfirmDialog
                                                                title="Are you sure?"
                                                                description="This action cannot be undone. This will permanently delete this user."
                                                                onConfirm={() => handleDeleteUser(user.id)}
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
                            {users.links && (
                                <div className="px-6 py-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {users.from} to {users.to} of {users.total} results
                                        </div>
                                        <div className="flex space-x-2">
                                            {users.links.map((link, index) => (
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
