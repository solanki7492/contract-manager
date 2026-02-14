import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function RemindersIndex({ reminders, contracts, filters }) {
    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
                    <Link
                        href="/reminders/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Reminder
                    </Link>
                </div>

                {/* Reminders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reminders.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No reminders found
                                    </td>
                                </tr>
                            ) : (
                                reminders.data.map((reminder) => (
                                    <tr key={reminder.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{reminder.contract?.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(reminder.trigger_datetime).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{reminder.trigger_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reminder.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                                    reminder.status === 'sent' ? 'bg-green-100 text-green-800' :
                                                        reminder.status === 'handled' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                {reminder.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{reminder.recipients?.length || 0}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link href={`/reminders/${reminder.id}`} className="text-blue-600 hover:text-blue-900">
                                                View
                                            </Link>
                                            {reminder.status === 'sent' && (
                                                <Link
                                                    href={`/reminders/${reminder.id}/handle`}
                                                    method="post"
                                                    as="button"
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Mark Handled
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {reminders.links && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Showing {reminders.from} to {reminders.to} of {reminders.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {reminders.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1 rounded ${link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
