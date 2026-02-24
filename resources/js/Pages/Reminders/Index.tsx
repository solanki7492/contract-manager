import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/common/container';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';
import { Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

interface Contract {
    id: number;
    title: string;
}

interface Recipient {
    id: number;
}

interface Reminder {
    id: number;
    contract?: Contract;
    trigger_datetime: string;
    trigger_type: string;
    status: string;
    recipients?: Recipient[];
}

interface PageProps {
    reminders: {
        data: Reminder[];
        from: number;
        to: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    contracts: Contract[];
    filters: {
        status?: string;
        contract_id?: string;
        date_from?: string;
        date_to?: string;
        upcoming_days?: string;
    };
}

export default function RemindersIndex({ reminders, contracts, filters }: PageProps) {
    const [status, setStatus] = useState(filters.status || '');
    const [contractId, setContractId] = useState(filters.contract_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [upcomingDays, setUpcomingDays] = useState(filters.upcoming_days || '');

    // Set upcoming_days from URL params on mount
    useEffect(() => {
        if (filters.upcoming_days) {
            setUpcomingDays(filters.upcoming_days);
        }
    }, [filters.upcoming_days]);

    const handleFilter = () => {
        router.get('/reminders', {
            status,
            contract_id: contractId,
            date_from: dateFrom,
            date_to: dateTo,
            upcoming_days: upcomingDays
        }, { preserveState: true });
    };

    const handleReset = () => {
        setStatus('');
        setContractId('');
        setDateFrom('');
        setDateTo('');
        setUpcomingDays('');
        router.get('/reminders');
    };

    const clearUpcomingDaysFilter = () => {
        setUpcomingDays('');
        router.get('/reminders', {
            status,
            contract_id: contractId,
            date_from: dateFrom,
            date_to: dateTo
        }, { preserveState: true });
    };
    return (
        <MainLayout>
            <Head>
                <title>Reminders</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <Bell className="size-6 text-gray-700" />
                            <h1 className="text-3xl font-bold text-mono">Reminders</h1>
                        </div>
                        <Button asChild>
                            <Link href="/reminders/create">
                                <Plus className="w-5 h-5" />
                                Create Reminder
                            </Link>
                        </Button>
                    </div>

                    {/* Active Filter Badge */}
                    {upcomingDays && (
                        <Card className="bg-purple-50 border-purple-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="bg-purple-600 text-white">
                                            Active Filter
                                        </Badge>
                                        <span className="text-sm font-medium text-purple-900">
                                            Showing reminders in the next {upcomingDays} days
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearUpcomingDaysFilter}
                                        className="text-purple-900 hover:text-purple-700"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Clear Filter
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="sent">Sent</option>
                                    <option value="handled">Handled</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div>
                                <select
                                    value={contractId}
                                    onChange={(e) => setContractId(e.target.value)}
                                    className="h-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Contracts</option>
                                    {contracts && contracts.map((contract) => (
                                        <option key={contract.id} value={contract.id}>{contract.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    value={upcomingDays}
                                    onChange={(e) => setUpcomingDays(e.target.value)}
                                    className="h-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Upcoming Days</option>
                                    <option value="7">Next 7 Days</option>
                                    <option value="30">Next 30 Days</option>
                                </select>
                            </div>
                            <div>
                                <Input
                                    type="date"
                                    placeholder="From Date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="h-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        </CardContent>
                    </Card>

                    {/* Reminders Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contract</TableHead>
                                            <TableHead>Trigger Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Recipients</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reminders.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                                    No reminders found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            reminders.data.map((reminder) => (
                                                <TableRow key={reminder.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-gray-900">{reminder.contract?.title}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">
                                                            {new Date(reminder.trigger_datetime).toLocaleString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{reminder.trigger_type}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={
                                                            reminder.status === 'pending' ? 'secondary' :
                                                                reminder.status === 'sent' ? 'success' :
                                                                    reminder.status === 'handled' ? 'outline' :
                                                                        'destructive'
                                                        }>
                                                            {reminder.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900">{reminder.recipients?.length || 0}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/reminders/${reminder.id}`}>
                                                                    <Eye className="w-4 h-4" />
                                                                    View
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/reminders/${reminder.id}/edit`}>
                                                                    <Edit className="w-4 h-4" />
                                                                    Edit
                                                                </Link>
                                                            </Button>
                                                            <DeleteConfirmDialog
                                                                title="Delete Reminder?"
                                                                description={`Are you sure you want to delete the reminder for "${reminder.contract?.title || 'this contract'}"? This action cannot be undone.`}
                                                                onConfirm={() => router.delete(`/reminders/${reminder.id}`)}
                                                                variant="icon"
                                                            />
                                                            {reminder.status === 'sent' && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/reminders/${reminder.id}/handle`}
                                                                        method="post"
                                                                        as="button"
                                                                    >
                                                                        Mark Handled
                                                                    </Link>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {reminders.links && (
                                <div className="px-6 py-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700">
                                            Showing {reminders.from} to {reminders.to} of {reminders.total} results
                                        </div>
                                        <div className="flex space-x-2">
                                            {reminders.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            window.location.href = link.url;
                                                        }
                                                    }}
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
