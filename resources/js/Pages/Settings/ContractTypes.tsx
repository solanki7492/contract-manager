import { usePage, Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ContractTypesManagement from '@/components/profile/ContractTypesManagement';
import { Container } from '@/components/common/container';
import { FileType } from 'lucide-react';

interface ContractType {
    id: number;
    name: string;
    color: string;
    is_system: boolean;
}

interface PageProps {
    contractTypes: ContractType[];
    [key: string]: any;
}

export default function ContractTypes() {
    const { contractTypes } = usePage<PageProps>().props;

    return (
        <MainLayout>
            <Head>
                <title>Contract Types</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5">
                                <FileType className="size-6 text-gray-700" />
                                <h1 className="text-2xl font-semibold text-gray-900">Contract Types</h1>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage custom contract types for your company
                            </p>
                        </div>

                        <ContractTypesManagement contractTypes={contractTypes} />
                    </div>
                </div>
            </Container>
        </MainLayout>
    );
}
