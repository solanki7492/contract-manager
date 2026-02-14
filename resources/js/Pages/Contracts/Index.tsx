import MainLayout from '../../Layouts/MainLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { 
    PlusIcon, 
    MagnifyingGlassIcon, 
    FunnelIcon, 
    ArrowPathIcon, 
    EyeIcon, 
    PencilIcon 
} from '@heroicons/react/24/outline';

export default function ContractsIndex({ contracts, contractTypes, filters }) {
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
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
                    <Link
                        href="/contracts/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Create Contract
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Search contracts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                {contractTypes.map((ct) => (
                                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleFilter}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Filter
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contracts Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterparty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contracts.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No contracts found
                                    </td>
                                </tr>
                            ) : (
                                contracts.data.map((contract) => (
                                    <tr key={contract.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contract.counterparty}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{contract.contract_type?.name || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(contract.end_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${contract.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    contract.status === 'expiring' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link href={`/contracts/${contract.id}`} className="text-blue-600 hover:text-blue-900">
                                                View
                                            </Link>
                                            <Link href={`/contracts/${contract.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {contracts.links && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">
                                    Showing {contracts.from} to {contracts.to} of {contracts.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {contracts.links.map((link, index) => (
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
