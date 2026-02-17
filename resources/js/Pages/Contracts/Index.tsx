import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Eye, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/common/container';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';

interface ContractType {
    id: number;
    name: string;
}

interface Contract {
    id: number;
    title: string;
    counterparty: string;
    contract_type?: ContractType;
    end_date: string;
    status: string;
}

interface PageProps {
    contracts: {
        data: Contract[];
        from: number;
        to: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    contractTypes: ContractType[];
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
}

export default function ContractsIndex({ contracts, contractTypes, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [type, setType] = useState(filters.type || '');

    const handleFilter = () => {
        router.get('/contracts', { search, status, type }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('');
        setType('');
        router.get('/contracts');
    };

    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-mono">Contracts</h1>
                        <Button asChild>
                            <Link href="/contracts/create">
                                <Plus className="w-5 h-5" />
                                Create Contract
                            </Link>
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Search contracts..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="expiring">Expiring</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                                <div>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">All Types</option>
                                        {contractTypes.map((ct) => (
                                            <option key={ct.id} value={ct.id}>{ct.name}</option>
                                        ))}
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

                    {/* Contracts Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Counterparty</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contracts.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                                    No contracts found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            contracts.data.map((contract) => (
                                                <TableRow key={contract.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">{contract.title}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{contract.counterparty}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{contract.contract_type?.name || 'N/A'}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">
                                                            {new Date(contract.end_date).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            contract.status === 'active' ? 'success' :
                                                                contract.status === 'expiring' ? 'warning' :
                                                                    'destructive'
                                                        }>
                                                            {contract.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/contracts/${contract.id}`}>
                                                                    <Eye className="w-4 h-4" />
                                                                    View
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/contracts/${contract.id}/edit`}>
                                                                    <Edit className="w-4 h-4" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <DeleteConfirmDialog
                                                                title="Delete Contract?"
                                                                description={`Are you sure you want to delete "${contract.title}"? This action cannot be undone.`}
                                                                onConfirm={() => router.delete(`/contracts/${contract.id}`)}
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
                            {contracts.links && (
                                <div className="px-6 py-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {contracts.from} to {contracts.to} of {contracts.total} results
                                        </div>
                                        <div className="flex space-x-2">
                                            {contracts.links.map((link, index) => (
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
