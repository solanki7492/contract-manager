import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContractType {
    id: number;
    name: string;
    color: string;
    is_system: boolean;
}

interface ContractTypesManagementProps {
    contractTypes: ContractType[];
}

export default function ContractTypesManagement({ contractTypes }: ContractTypesManagementProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<ContractType | null>(null);
    const [deletingType, setDeletingType] = useState<ContractType | null>(null);

    return (
        <Card>
            <CardHeader className="flex items-center justify-between p-4">
                <div>
                    <CardTitle>Contract Types</CardTitle>
                    <CardDescription>
                        Manage custom contract types for your company.
                    </CardDescription>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <CreateContractTypeForm onSuccess={() => setIsCreateDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contractTypes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No contract types found. Create your first one!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contractTypes.map((type) => (
                                    <TableRow key={type.id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded border"
                                                    style={{ backgroundColor: type.color }}
                                                />
                                                <span className="text-sm text-muted-foreground">{type.color}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {type.is_system ? (
                                                <Badge variant="secondary">System</Badge>
                                            ) : (
                                                <Badge variant="outline">Custom</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {!type.is_system && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Dialog
                                                        open={editingType?.id === type.id}
                                                        onOpenChange={(open) => {
                                                            if (!open) setEditingType(null);
                                                            else setEditingType(type);
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <EditContractTypeForm
                                                                contractType={type}
                                                                onSuccess={() => setEditingType(null)}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Dialog
                                                        open={deletingType?.id === type.id}
                                                        onOpenChange={(open) => {
                                                            if (!open) setDeletingType(null);
                                                            else setDeletingType(type);
                                                        }}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DeleteContractTypeForm
                                                                contractType={type}
                                                                onSuccess={() => setDeletingType(null)}
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function CreateContractTypeForm({ onSuccess }: { onSuccess: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        color: '#3B82F6',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contract-types', {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Create Contract Type</DialogTitle>
                <DialogDescription>
                    Add a new contract type for your company.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="e.g., Service Agreement"
                        required
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex gap-2">
                        <Input
                            id="color"
                            type="color"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            className="w-20 h-10 p-1"
                        />
                        <Input
                            type="text"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </div>
            </form>
        </>
    );
}

function EditContractTypeForm({
    contractType,
    onSuccess,
}: {
    contractType: ContractType;
    onSuccess: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: contractType.name,
        color: contractType.color,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/contract-types/${contractType.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Edit Contract Type</DialogTitle>
                <DialogDescription>
                    Update the contract type details.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                        id="edit-name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="edit-color">Color</Label>
                    <div className="flex gap-2">
                        <Input
                            id="edit-color"
                            type="color"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            className="w-20 h-10 p-1"
                        />
                        <Input
                            type="text"
                            value={data.color}
                            onChange={(e) => setData('color', e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="submit" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </>
    );
}

function DeleteContractTypeForm({
    contractType,
    onSuccess,
}: {
    contractType: ContractType;
    onSuccess: () => void;
}) {
    const { delete: destroy, processing } = useForm();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/contract-types/${contractType.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <>
            <DialogHeader>
                <DialogTitle>Delete Contract Type</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this contract type? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        You are about to delete <strong>{contractType.name}</strong>. This action is permanent.
                    </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="destructive" disabled={processing}>
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </div>
            </form>
        </>
    );
}
