import MainLayout from '../../Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ContractType {
    id: number;
    name: string;
}

interface CreateContractProps {
    contractTypes: ContractType[];
}

export default function CreateContract({ contractTypes }: CreateContractProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        contract_type_id: '',
        counterparty: '',
        start_date: '',
        end_date: '',
        termination_notice_days: '',
        termination_deadline_date: '',
        notes: '',
        file: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/contracts');
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Contract</h1>

                <Card>
                    <CardContent className="p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <div className="mt-1 text-sm text-red-600">{errors.title}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="contract_type_id">Contract Type</Label>
                                    <select
                                        id="contract_type_id"
                                        value={data.contract_type_id}
                                        onChange={(e) => setData('contract_type_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="">Select Type</option>
                                        {contractTypes.map((type) => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                    {errors.contract_type_id && <div className="mt-1 text-sm text-red-600">{errors.contract_type_id}</div>}
                                </div>

                                <div>
                                    <Label htmlFor="counterparty">Counterparty *</Label>
                                    <Input
                                        id="counterparty"
                                        type="text"
                                        value={data.counterparty}
                                        onChange={(e) => setData('counterparty', e.target.value)}
                                        required
                                    />
                                    {errors.counterparty && <div className="mt-1 text-sm text-red-600">{errors.counterparty}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <div className="mt-1 text-sm text-red-600">{errors.start_date}</div>}
                                </div>

                                <div>
                                    <Label htmlFor="end_date">End Date *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        required
                                    />
                                    {errors.end_date && <div className="mt-1 text-sm text-red-600">{errors.end_date}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="termination_notice_days">Termination Notice Period (days)</Label>
                                    <Input
                                        id="termination_notice_days"
                                        type="number"
                                        value={data.termination_notice_days}
                                        onChange={(e) => setData('termination_notice_days', e.target.value)}
                                        min="1"
                                    />
                                    {errors.termination_notice_days && <div className="mt-1 text-sm text-red-600">{errors.termination_notice_days}</div>}
                                </div>

                                <div>
                                    <Label htmlFor="termination_deadline_date">Or Termination Deadline Date</Label>
                                    <Input
                                        id="termination_deadline_date"
                                        type="date"
                                        value={data.termination_deadline_date}
                                        onChange={(e) => setData('termination_deadline_date', e.target.value)}
                                    />
                                    {errors.termination_deadline_date && <div className="mt-1 text-sm text-red-600">{errors.termination_deadline_date}</div>}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                            </div>

                            <div>
                                <Label htmlFor="file">Contract File (PDF/DOC)</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx"
                                />
                                {errors.file && <div className="mt-1 text-sm text-red-600">{errors.file}</div>}
                                <p className="mt-1 text-sm text-gray-500">Max size: 10MB. Allowed: PDF, DOC, DOCX</p>
                            </div>

                            <div className="flex space-x-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Creating...' : 'Create Contract'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/contracts">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
