import MainLayout from '../../Layouts/MainLayout';
import { useForm } from '@inertiajs/react';

export default function CreateContract({ contractTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        contract_type_id: '',
        counterparty: '',
        start_date: '',
        end_date: '',
        termination_notice_days: '',
        termination_deadline_date: '',
        notes: '',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contracts');
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Contract</h1>

                <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {errors.title && <div className="mt-1 text-sm text-red-600">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contract Type
                            </label>
                            <select
                                value={data.contract_type_id}
                                onChange={(e) => setData('contract_type_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Type</option>
                                {contractTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                            {errors.contract_type_id && <div className="mt-1 text-sm text-red-600">{errors.contract_type_id}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Counterparty *
                            </label>
                            <input
                                type="text"
                                value={data.counterparty}
                                onChange={(e) => setData('counterparty', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.counterparty && <div className="mt-1 text-sm text-red-600">{errors.counterparty}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.start_date && <div className="mt-1 text-sm text-red-600">{errors.start_date}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date *
                            </label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.end_date && <div className="mt-1 text-sm text-red-600">{errors.end_date}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Termination Notice Period (days)
                            </label>
                            <input
                                type="number"
                                value={data.termination_notice_days}
                                onChange={(e) => setData('termination_notice_days', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                            />
                            {errors.termination_notice_days && <div className="mt-1 text-sm text-red-600">{errors.termination_notice_days}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Or Termination Deadline Date
                            </label>
                            <input
                                type="date"
                                value={data.termination_deadline_date}
                                onChange={(e) => setData('termination_deadline_date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.termination_deadline_date && <div className="mt-1 text-sm text-red-600">{errors.termination_deadline_date}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contract File (PDF/DOC)
                        </label>
                        <input
                            type="file"
                            onChange={(e) => setData('file', e.target.files[0])}
                            accept=".pdf,.doc,.docx"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.file && <div className="mt-1 text-sm text-red-600">{errors.file}</div>}
                        <p className="mt-1 text-sm text-gray-500">Max size: 10MB. Allowed: PDF, DOC, DOCX</p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {processing ? 'Creating...' : 'Create Contract'}
                        </button>
                        <a
                            href="/contracts"
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
