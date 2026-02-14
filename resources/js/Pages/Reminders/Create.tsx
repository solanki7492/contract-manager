import MainLayout from '../../Layouts/MainLayout';
import { useForm } from '@inertiajs/react';

export default function CreateReminder({ contracts, users, preselectedContractId }) {
    const { data, setData, post, processing, errors } = useForm({
        contract_id: preselectedContractId || '',
        trigger_type: 'before_end_date',
        days_before: '30',
        custom_date: '',
        send_time: '09:00',
        channels: ['email', 'in_app'],
        recipients: [],
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reminders');
    };

    const addRecipient = (type) => {
        setData('recipients', [...data.recipients, { type, id: '', email: '' }]);
    };

    const removeRecipient = (index) => {
        const newRecipients = data.recipients.filter((_, i) => i !== index);
        setData('recipients', newRecipients);
    };

    const updateRecipient = (index, field, value) => {
        const newRecipients = [...data.recipients];
        newRecipients[index][field] = value;
        setData('recipients', newRecipients);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Reminder</h1>

                <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contract *
                        </label>
                        <select
                            value={data.contract_id}
                            onChange={(e) => setData('contract_id', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Contract</option>
                            {contracts.map((contract) => (
                                <option key={contract.id} value={contract.id}>{contract.title}</option>
                            ))}
                        </select>
                        {errors.contract_id && <div className="mt-1 text-sm text-red-600">{errors.contract_id}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trigger Type *
                        </label>
                        <select
                            value={data.trigger_type}
                            onChange={(e) => setData('trigger_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="before_end_date">Before End Date</option>
                            <option value="before_termination_deadline">Before Termination Deadline</option>
                            <option value="custom_date">Custom Date</option>
                        </select>
                        {errors.trigger_type && <div className="mt-1 text-sm text-red-600">{errors.trigger_type}</div>}
                    </div>

                    {(data.trigger_type === 'before_end_date' || data.trigger_type === 'before_termination_deadline') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Days Before *
                            </label>
                            <input
                                type="number"
                                value={data.days_before}
                                onChange={(e) => setData('days_before', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                                required
                            />
                            {errors.days_before && <div className="mt-1 text-sm text-red-600">{errors.days_before}</div>}
                        </div>
                    )}

                    {data.trigger_type === 'custom_date' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Date *
                            </label>
                            <input
                                type="date"
                                value={data.custom_date}
                                onChange={(e) => setData('custom_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.custom_date && <div className="mt-1 text-sm text-red-600">{errors.custom_date}</div>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Send Time *
                        </label>
                        <input
                            type="time"
                            value={data.send_time}
                            onChange={(e) => setData('send_time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.send_time && <div className="mt-1 text-sm text-red-600">{errors.send_time}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Channels *
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
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
                                    className="rounded border-gray-300 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Email</span>
                            </label>
                            <label className="flex items-center">
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
                                    className="rounded border-gray-300 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">In-App</span>
                            </label>
                        </div>
                        {errors.channels && <div className="mt-1 text-sm text-red-600">{errors.channels}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recipients *
                        </label>
                        <div className="space-y-3">
                            {data.recipients.map((recipient, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <select
                                        value={recipient.type}
                                        onChange={(e) => updateRecipient(index, 'type', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                    >
                                        <option value="user">Internal User</option>
                                        <option value="external">External Email</option>
                                    </select>
                                    {recipient.type === 'user' ? (
                                        <select
                                            value={recipient.id}
                                            onChange={(e) => updateRecipient(index, 'id', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">Select User</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="email"
                                            value={recipient.email}
                                            onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeRecipient(index)}
                                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 space-x-2">
                            <button
                                type="button"
                                onClick={() => addRecipient('user')}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                            >
                                Add User
                            </button>
                            <button
                                type="button"
                                onClick={() => addRecipient('external')}
                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                                Add External Email
                            </button>
                        </div>
                        {errors.recipients && <div className="mt-1 text-sm text-red-600">{errors.recipients}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Reminder'}
                        </button>
                        <a
                            href="/reminders"
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
