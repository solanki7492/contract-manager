import { usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, FileType } from 'lucide-react';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import ContractTypesManagement from '@/components/profile/ContractTypesManagement';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface ContractType {
    id: number;
    name: string;
    color: string;
    is_system: boolean;
}

interface PageProps {
    user: User;
    contractTypes?: ContractType[];
    [key: string]: any;
}

export default function Show() {
    const { user, contractTypes } = usePage<PageProps>().props;
    const isCompanyAdmin = user.role === 'company_admin' || user.role === 'superadmin';

    return (
        <MainLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full max-w-md" style={{ gridTemplateColumns: isCompanyAdmin ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)' }}>
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Password
                            </TabsTrigger>
                            {isCompanyAdmin && (
                                <TabsTrigger value="contract-types" className="flex items-center gap-2">
                                    <FileType className="h-4 w-4" />
                                    Contract Types
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                            <EditProfileForm user={user} />
                        </TabsContent>

                        <TabsContent value="password" className="space-y-6">
                            <ChangePasswordForm />
                        </TabsContent>

                        {isCompanyAdmin && contractTypes && (
                            <TabsContent value="contract-types" className="space-y-6">
                                <ContractTypesManagement contractTypes={contractTypes} />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>
        </MainLayout>
    );
}
