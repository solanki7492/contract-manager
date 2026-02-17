import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, FileText, Download, Edit, Trash2, Plus, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface ContractType {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Recipient {
    id: number;
    user?: User;
    email?: string;
}

interface Reminder {
    id: number;
    trigger_datetime: string;
    trigger_type: string;
    status: string;
    recipients?: Recipient[];
}

interface Contract {
    id: number;
    title: string;
    counterparty: string;
    contract_type?: ContractType;
    start_date: string | null;
    end_date: string;
    termination_notice_days: number | null;
    termination_deadline_date: string | null;
    notes: string | null;
    file_path: string | null;
    status: string;
    creator?: User;
    created_at: string;
    updated_at: string;
    reminders?: Reminder[];
}

interface ShowContractProps {
    contract: Contract;
    downloadUrl?: string;
}

export default function ShowContract({ contract, downloadUrl }: ShowContractProps) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this contract?')) {
            router.delete(`/contracts/${contract.id}`);
        }
    };

    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <FileText className="size-5 text-gray-700" />
                                Contract Details
                            </div>
                            <p className="text-sm text-gray-600">
                                View contract information and reminders
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/contracts">
                                    <ArrowLeft className="size-4" />
                                    Back to Contracts
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Contract Information */}
                    <Card>
                        <CardHeader className="border-b border-gray-200 p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold">{contract.title}</CardTitle>
                                    <CardDescription className="mt-1">
                                        Created {new Date(contract.created_at).toLocaleDateString()} by {contract.creator?.name}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={
                                        contract.status === 'active' ? 'success' :
                                            contract.status === 'expiring' ? 'warning' :
                                                'destructive'
                                    }>
                                        {contract.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-7.5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Counterparty</h3>
                                    <p className="text-base text-gray-900">{contract.counterparty}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contract Type</h3>
                                    <p className="text-base text-gray-900">{contract.contract_type?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
                                    <p className="text-base text-gray-900">
                                        {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
                                    <p className="text-base text-gray-900">
                                        {new Date(contract.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                                {contract.termination_notice_days && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Termination Notice Period</h3>
                                        <p className="text-base text-gray-900">{contract.termination_notice_days} days</p>
                                    </div>
                                )}
                                {contract.termination_deadline_date && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Termination Deadline</h3>
                                        <p className="text-base text-gray-900">
                                            {new Date(contract.termination_deadline_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {contract.notes && (
                                <>
                                    <Separator className="my-6" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                                        <p className="text-base text-gray-900 whitespace-pre-wrap">{contract.notes}</p>
                                    </div>
                                </>
                            )}

                            <Separator className="my-6" />
                            <div className="flex items-center gap-2">
                                {downloadUrl && contract.file_path && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="size-4" />
                                            Download File
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/contracts/${contract.id}/edit`}>
                                        <Edit className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDelete}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="size-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reminders Section */}
                    <Card>
                        <CardHeader className="border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <Bell className="size-4" />
                                        Reminders
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Reminders associated with this contract
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/reminders/create?contract_id=${contract.id}`}>
                                        <Plus className="size-4" />
                                        Add Reminder
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {!contract.reminders || contract.reminders.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No reminders found for this contract
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Trigger Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Recipients</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {contract.reminders.map((reminder) => (
                                                <TableRow key={reminder.id}>
                                                    <TableCell>
                                                        <div className="text-gray-900">
                                                            {new Date(reminder.trigger_datetime).toLocaleString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-gray-900 capitalize">
                                                            {reminder.trigger_type.replace(/_/g, ' ')}
                                                        </div>
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
                                                        <div className="text-gray-900">
                                                            {reminder.recipients?.length || 0} recipient(s)
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/reminders/${reminder.id}`}>
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </MainLayout>
    );
}
