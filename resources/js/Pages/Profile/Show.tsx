import { usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Settings } from 'lucide-react';
import EditProfileForm from '@/components/profile/EditProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import { Container } from '@/components/common/container';
import { Head } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface PageProps {
    user: User;
    [key: string]: any;
}

export default function Show() {
    const { user } = usePage<PageProps>().props;

    return (
        <MainLayout>
            <Head>
                <title>Profile</title>
            </Head>
            <Container>
                <div className="space-y-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2.5">
                                <Settings className="size-6 text-gray-700" />
                                <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your account settings and preferences
                            </p>
                        </div>

                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                                <TabsTrigger value="profile" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="password" className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Password
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="space-y-6">
                                <EditProfileForm user={user} />
                            </TabsContent>

                            <TabsContent value="password" className="space-y-6">
                                <ChangePasswordForm />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </Container>
        </MainLayout>
    );
}
