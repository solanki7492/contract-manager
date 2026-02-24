import MainLayout from '../../Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { ArrowLeft, Bell, Calendar, Users, MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react';
import { Head } from '@inertiajs/react';

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
    recipient_type: 'user' | 'external';
    id?: string;
    email?: string;
}

interface CreateReminderProps {
    contracts: Contract[];
    users: User[];
    preselectedContractId?: string;
}

export default function CreateReminder({ contracts, users, preselectedContractId }: CreateReminderProps) {
    const { data, setData, post, processing, errors } = useForm({
        contract_id: preselectedContractId || '',
        trigger_type: 'before_end_date',
        days_before: '30',
        custom_date: '',
        send_time: '09:00',
        channels: ['email', 'in_app'] as string[],
        recipients: [] as Recipient[],
        notes: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/reminders');
    };

    const addRecipient = (type: 'user' | 'external') => {
        setData('recipients', [...data.recipients, { recipient_type: type, id: '', email: '' }]);
    };

    const removeRecipient = (index: number) => {
        const newRecipients = data.recipients.filter((_, i) => i !== index);
        setData('recipients', newRecipients);
    };

    const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
        const newRecipients = [...data.recipients];
        if (field === 'recipient_type') {
            newRecipients[index][field] = value as 'user' | 'external';
        } else {
            newRecipients[index][field] = value;
        }
        setData('recipients', newRecipients);
    };

    return (
        <MainLayout>
            <Head>
                <title>Create Reminder</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <Bell className="size-5 text-gray-700" />
                                Create New Reminder
                            </div>
                            <p className="text-sm text-gray-600">
                                Set up a new contract reminder
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

                    {/* Reminder Form */}
                    <form onSubmit={submit} className="space-y-5">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    {/* Contract Selection */}
                                    <div>
                                        <Label htmlFor="contract_id" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Contract <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="contract_id"
                                            value={data.contract_id}
                                            onChange={(e) => setData('contract_id', e.target.value)}
                                            className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Contract</option>
                                            {contracts.map((contract) => (
                                                <option key={contract.id} value={contract.id}>{contract.title}</option>
                                            ))}
                                        </select>
                                        {errors.contract_id && <div className="mt-1.5 text-xs text-red-600">{errors.contract_id}</div>}
                                    </div>

                                    {/* Trigger Type */}
                                    <div>
                                        <Label htmlFor="trigger_type" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Date <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="trigger_type"
                                            value={data.trigger_type}
                                            onChange={(e) => setData('trigger_type', e.target.value)}
                                            className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="before_end_date">Before End Date</option>
                                            <option value="before_termination_deadline">Before Termination Deadline</option>
                                            <option value="custom_date">Custom Date</option>
                                        </select>
                                        {errors.trigger_type && <div className="mt-1.5 text-xs text-red-600">{errors.trigger_type}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timing Configuration */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Timing Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    {(data.trigger_type === 'before_end_date' || data.trigger_type === 'before_termination_deadline') && (
                                        <div>
                                            <Label htmlFor="days_before" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Days Before <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="days_before"
                                                type="number"
                                                value={data.days_before}
                                                onChange={(e) => setData('days_before', e.target.value)}
                                                placeholder="Enter number of days"
                                                min="1"
                                                className="h-10"
                                                required
                                            />
                                            {errors.days_before && <div className="mt-1.5 text-xs text-red-600">{errors.days_before}</div>}
                                        </div>
                                    )}

                                    {data.trigger_type === 'custom_date' && (
                                        <div>
                                            <Label htmlFor="custom_date" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Custom Date <span className="text-red-500">*</span>
                                            </Label>
                                            <input
                                                id="custom_date"
                                                type="date"
                                                value={data.custom_date}
                                                onChange={(e) => setData('custom_date', e.target.value)}
                                                className="h-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.custom_date && <div className="mt-1.5 text-xs text-red-600">{errors.custom_date}</div>}
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="send_time" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Send Time <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            id="send_time"
                                            type="time"
                                            value={data.send_time}
                                            onChange={(e) => setData('send_time', e.target.value)}
                                            className="h-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.send_time && <div className="mt-1.5 text-xs text-red-600">{errors.send_time}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Channels */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <MessageSquare className="size-4" />
                                    Notification Channels
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-900 mb-3 block">
                                            Channels <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={data.channels.includes('email')}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setData('channels', [...data.channels, 'email']);
                                                        } else {
                                                            setData('channels', data.channels.filter(c => c !== 'email'));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-900 font-medium">Email</span>
                                            </label>
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={data.channels.includes('in_app')}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setData('channels', [...data.channels, 'in_app']);
                                                        } else {
                                                            setData('channels', data.channels.filter(c => c !== 'in_app'));
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-900 font-medium">In-App Notification</span>
                                            </label>
                                        </div>
                                        {errors.channels && <div className="mt-1.5 text-xs text-red-600">{errors.channels}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recipients */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Users className="size-4" />
                                    Recipients
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-900 mb-3 block">
                                            Recipients <span className="text-red-500">*</span>
                                        </Label>
                                        
                                        {data.recipients.length > 0 && (
                                            <div className="space-y-3 mb-4">
                                                {data.recipients.map((recipient, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border">
                                                        <select
                                                            value={recipient.recipient_type}
                                                            onChange={(e) => updateRecipient(index, 'recipient_type', e.target.value as 'user' | 'external')}
                                                            className="flex-1 h-9 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="user">Internal User</option>
                                                            <option value="external">External Email</option>
                                                        </select>
                                                        {recipient.recipient_type === 'user' ? (
                                                            <select
                                                                value={recipient.id || ''}
                                                                onChange={(e) => updateRecipient(index, 'id', e.target.value)}
                                                                className="flex-2 h-9 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">Select User</option>
                                                                {users.map((user) => (
                                                                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <Input
                                                                type="email"
                                                                value={recipient.email || ''}
                                                                onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                                                                placeholder="email@example.com"
                                                                className="flex-2 h-9"
                                                            />
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeRecipient(index)}
                                                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addRecipient('user')}
                                            >
                                                <Plus className="size-4 mr-2" />
                                                Add User
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => addRecipient('external')}
                                            >
                                                <Plus className="size-4 mr-2" />
                                                Add External Email
                                            </Button>
                                        </div>
                                        {errors.recipients && <div className="mt-1.5 text-xs text-red-600">{errors.recipients}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold">Additional Information</CardTitle>
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
                                            placeholder="Enter any additional notes..."
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
                                {processing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Reminder'
                                )}
                            </Button>
                            <Button type="button" variant="outline" size="sm" asChild>
                                <Link href="/reminders">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </MainLayout>
    );
}
