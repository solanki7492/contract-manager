import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/common/container';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';

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
    contracts: unknown;
    filters: unknown;
}

export default function RemindersIndex({ reminders }: PageProps) {
    return (
        <MainLayout>
            <Container>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-mono">Reminders</h1>
                        <Button asChild>
                            <Link href="/reminders/create">
                                <Plus className="w-5 h-5" />
                                Create Reminder
                            </Link>
                        </Button>
                    </div>

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
