import MainLayout from '../../Layouts/MainLayout';
import { useForm, Link } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/common/container';
import { ArrowLeft, FileText, Calendar, Clock, FileUp } from 'lucide-react';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';

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
            <Head>
                <title>Create Contract</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2.5 font-semibold text-lg text-gray-900">
                                <FileText className="size-5 text-gray-700" />
                                Create New Contract
                            </div>
                            <p className="text-sm text-gray-600">
                                Add a new contract to the system
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

                    {/* Contract Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold">Contract Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    {/* Title */}
                                    <div className="w-full">
                                        <Label htmlFor="title" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Title <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter contract title"
                                            className="h-10"
                                            required
                                        />
                                        {errors.title && <div className="mt-1.5 text-xs text-red-600">{errors.title}</div>}
                                    </div>

                                    {/* Contract Type and Counterparty */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <div>
                                            <Label htmlFor="contract_type_id" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Contract Type
                                            </Label>
                                            <select
                                                id="contract_type_id"
                                                value={data.contract_type_id}
                                                onChange={(e) => setData('contract_type_id', e.target.value)}
                                                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Type</option>
                                                {contractTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>{type.name}</option>
                                                ))}
                                            </select>
                                            {errors.contract_type_id && <div className="mt-1.5 text-xs text-red-600">{errors.contract_type_id}</div>}
                                        </div>

                                        <div>
                                            <Label htmlFor="counterparty" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Counterparty <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="counterparty"
                                                type="text"
                                                value={data.counterparty}
                                                onChange={(e) => setData('counterparty', e.target.value)}
                                                placeholder="Enter counterparty name"
                                                className="h-10"
                                                required
                                            />
                                            {errors.counterparty && <div className="mt-1.5 text-xs text-red-600">{errors.counterparty}</div>}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contract Dates */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Contract Dates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-7.5">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <div>
                                            <Label htmlFor="start_date" className="text-sm font-medium text-gray-900 mb-2 block">
                                                Start Date
                                            </Label>
                                            <DatePicker
                                                value={data.start_date}
                                                onChange={(date) => setData('start_date', date)}
                                                placeholder="Pick start date"
                                            />
                                            {errors.start_date && <div className="mt-1.5 text-xs text-red-600">{errors.start_date}</div>}
                                        </div>

                                        <div>
                                            <Label htmlFor="end_date" className="text-sm font-medium text-gray-900 mb-2 block">
                                                End Date <span className="text-red-500">*</span>
                                            </Label>
                                            <DatePicker
                                                value={data.end_date}
                                                onChange={(date) => setData('end_date', date)}
                                                placeholder="Pick end date"
                                            />
                                            {errors.end_date && <div className="mt-1.5 text-xs text-red-600">{errors.end_date}</div>}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Termination Details */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Clock className="size-4" />
                                    Termination Details
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-7.5">
                                <Tabs
                                    defaultValue={data.termination_deadline_date ? "date" : "days"}
                                    onValueChange={(value) => {
                                        if (value === "days") {
                                            setData('termination_deadline_date', '');
                                        } else {
                                            setData('termination_notice_days', '');
                                        }
                                    }}
                                >
                                    {/* Tabs Header */}
                                    <TabsList className="mb-6 max-w-max">
                                        <TabsTrigger value="days">Notice Period (Days)</TabsTrigger>
                                        <TabsTrigger value="date">Deadline Date</TabsTrigger>
                                    </TabsList>
                                    {/* Days Tab */}
                                    <TabsContent value="days">
                                        <div>
                                            <Label
                                                htmlFor="termination_notice_days"
                                                className="text-sm font-medium text-gray-900 mb-2 block"
                                            >
                                                Termination Notice Period (days)
                                            </Label>

                                            <Input
                                                id="termination_notice_days"
                                                type="number"
                                                value={data.termination_notice_days}
                                                onChange={(e) =>
                                                    setData('termination_notice_days', e.target.value)
                                                }
                                                min="1"
                                                placeholder="Enter days"
                                                className="h-10"
                                            />

                                            {errors.termination_notice_days && (
                                                <div className="mt-1.5 text-xs text-red-600">
                                                    {errors.termination_notice_days}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    {/* Date Tab */}
                                    <TabsContent value="date">
                                        <div>
                                            <Label
                                                htmlFor="termination_deadline_date"
                                                className="text-sm font-medium text-gray-900 mb-2 block"
                                            >
                                                Termination Deadline Date
                                            </Label>
                                            <DatePicker
                                                value={data.termination_deadline_date}
                                                onChange={(date) => setData('termination_deadline_date', date)}
                                                placeholder="Pick deadline date"
                                            />
                                            {errors.termination_deadline_date && (
                                                <div className="mt-1.5 text-xs text-red-600">
                                                    {errors.termination_deadline_date}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        <Card>
                            <CardHeader className="border-b border-gray-200">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <FileUp className="size-4" />
                                    Additional Information
                                </CardTitle>
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

                                    <div>
                                        <Label htmlFor="file" className="text-sm font-medium text-gray-900 mb-2 block">
                                            Contract File (PDF/DOC)
                                        </Label>
                                        <Input
                                            id="file"
                                            type="file"
                                            onChange={(e) => setData('file', e.target.files?.[0] || null)}
                                            accept=".pdf,.doc,.docx"
                                            className="h-10"
                                        />
                                        {errors.file && <div className="mt-1.5 text-xs text-red-600">{errors.file}</div>}
                                        <p className="mt-1.5 text-xs text-gray-500">Max size: 10MB. Allowed: PDF, DOC, DOCX</p>
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
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                            <Button type="button" variant="outline" size="sm" asChild>
                                <Link href="/contracts">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </Container>
        </MainLayout>
    );
}
