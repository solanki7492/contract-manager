import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Bell, Calendar, Users, MessageSquare, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DeleteConfirmDialog } from '@/components/common/delete-confirm-dialog';

interface Contract {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Recipient {
    id: number;
    recipient_type: string;
    user?: User;
    email?: string;
}

interface Reminder {
    id: number;
    contract?: Contract;
    trigger_datetime: string;
    trigger_type: string;
    days_before?: number;
    custom_date?: string;
    send_time?: string;
    channels: string[];
    notes?: string;
    status: string;
    recipients?: Recipient[];
    creator?: User;
    handler?: User;
    handled_at?: string;
    created_at: string;
    updated_at: string;
}

interface ShowReminderProps {
    reminder: Reminder;
}

export default function ShowReminder({ reminder }: ShowReminderProps) {
    const handleMarkAsHandled = () => {
        if (confirm('Mark this reminder as handled?')) {
            router.post(`/reminders/${reminder.id}/handle`);
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
                                <Bell className="size-5 text-gray-700" />
                                Reminder Details
                            </div>
                            <p className="text-sm text-gray-600">
                                View reminder information and status
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/reminders">
                                    <ArrowLeft className="size-4" />
                                    Back to Reminders
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Reminder Information */}
                    <Card>
                        <CardHeader className="border-b border-gray-200 p-3 flex items-center justify-between p-4">
                            <div>
                                <CardTitle className="text-2xl font-bold">
                                    {reminder.contract?.title || 'No Contract'}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Created {new Date(reminder.created_at).toLocaleDateString()} by {reminder.creator?.name}
                                </CardDescription>
                            </div>

                            <Badge
                                variant={
                                    reminder.status === 'pending' ? 'secondary' :
                                        reminder.status === 'sent' ? 'success' :
                                            reminder.status === 'handled' ? 'outline' :
                                                'destructive'
                                }
                            >
                                {reminder.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-7.5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                        <Calendar className="size-4" />
                                        Trigger Date & Time
                                    </h3>
                                    <p className="text-base text-gray-900">
                                        {new Date(reminder.trigger_datetime).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">Trigger Type</h3>
                                    <p className="text-base text-gray-900 capitalize">
                                        {reminder.trigger_type.replace(/_/g, ' ')}
                                    </p>
                                </div>
                                {reminder.days_before && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Days Before</h3>
                                        <p className="text-base text-gray-900">{reminder.days_before} days</p>
                                    </div>
                                )}
                                {reminder.send_time && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Send Time</h3>
                                        <p className="text-base text-gray-900">{reminder.send_time}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                        <MessageSquare className="size-4" />
                                        Notification Channels
                                    </h3>
                                    <div className="flex gap-2 mt-2">
                                        {reminder.channels.map((channel, index) => (
                                            <Badge key={index} variant="outline">
                                                {channel === 'email' ? 'Email' : 'In-App'}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {reminder.contract && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">Associated Contract</h3>
                                        <Link
                                            href={`/contracts/${reminder.contract.id}`}
                                            className="text-base text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                            {reminder.contract.title}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {reminder.notes && (
                                <>
                                    <Separator className="my-6" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                                        <p className="text-base text-gray-900 whitespace-pre-wrap">{reminder.notes}</p>
                                    </div>
                                </>
                            )}

                            {reminder.handled_at && reminder.handler && (
                                <>
                                    <Separator className="my-6" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">Handled Information</h3>
                                        <p className="text-base text-gray-900">
                                            Marked as handled on {new Date(reminder.handled_at).toLocaleString()} by {reminder.handler.name}
                                        </p>
                                    </div>
                                </>
                            )}

                            <Separator className="my-6" />
                            <div className="flex items-center gap-2">
                                {reminder.status === 'sent' && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleMarkAsHandled}
                                    >
                                        <CheckCircle className="size-4" />
                                        Mark as Handled
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/reminders/${reminder.id}/edit`}>
                                        <Edit className="size-4" />
                                        Edit
                                    </Link>
                                </Button>
                                <DeleteConfirmDialog
                                    title="Delete Reminder?"
                                    description={`Are you sure you want to delete this reminder for "${reminder.contract?.title || 'this contract'}"? This action cannot be undone.`}
                                    onConfirm={() => router.delete(`/reminders/${reminder.id}`)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recipients Section */}
                    <Card>
                        <CardHeader className="border-b border-gray-200">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Users className="size-4" />
                                Recipients
                            </CardTitle>
                            <CardDescription className="mt-1">
                                People who will receive this reminder
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-7.5">
                            {!reminder.recipients || reminder.recipients.length === 0 ? (
                                <div className="text-center text-gray-500">
                                    No recipients found
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {reminder.recipients.map((recipient) => (
                                        <div
                                            key={recipient.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {recipient.recipient_type === 'user' && recipient.user
                                                        ? recipient.user.name
                                                        : recipient.email}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {recipient.recipient_type === 'user' && recipient.user
                                                        ? recipient.user.email
                                                        : 'External Email'}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {recipient.recipient_type === 'user' ? 'Internal' : 'External'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </MainLayout>
    );
}
