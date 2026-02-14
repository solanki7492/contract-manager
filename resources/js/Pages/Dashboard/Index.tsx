import MainLayout from '../../Layouts/MainLayout';
import { Link } from '@inertiajs/react';
import {
    FileCheck,
    Clock,
    AlertTriangle,
    Flame,
    Bell,
    BellRing,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/src/components/ui/table';
import { cn } from '@/src/lib/utils';

interface Contract {
    id: number;
    title: string;
    counterparty: string;
    end_date: string;
    days_until_end: number;
    status: 'active' | 'expiring' | 'expired';
}

interface Reminder {
    id: number;
    contract_title: string;
    trigger_datetime: string;
}

interface Stats {
    active_contracts: number;
    expiring_30_days: number;
    expiring_60_days: number;
    expiring_90_days: number;
    upcoming_reminders_7_days: number;
    upcoming_reminders_30_days: number;
}

interface DashboardProps {
    stats: Stats;
    expiringContracts: Contract[];
    upcomingReminders: Reminder[];
}

export default function Dashboard({ stats, expiringContracts, upcomingReminders }: DashboardProps) {
    const statCards = [
        {
            label: 'Active Contracts',
            value: stats.active_contracts,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            icon: FileCheck,
            trend: '+12.5%'
        },
        {
            label: 'Expiring in 30 Days',
            value: stats.expiring_30_days,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
            icon: Clock,
            trend: '+5.2%'
        },
        {
            label: 'Expiring in 60 Days',
            value: stats.expiring_60_days,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            icon: AlertTriangle,
            trend: '+3.1%'
        },
        {
            label: 'Expiring in 90 Days',
            value: stats.expiring_90_days,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            icon: Flame,
            trend: '-2.4%'
        },
        {
            label: 'Reminders (7 Days)',
            value: stats.upcoming_reminders_7_days,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            icon: BellRing,
            trend: '+8.3%'
        },
        {
            label: 'Reminders (30 Days)',
            value: stats.upcoming_reminders_30_days,
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10',
            icon: Bell,
            trend: '+6.7%'
        },
    ];

    const getStatusColor = (status: Contract['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/10 text-green-700 dark:text-green-400';
            case 'expiring':
                return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
            case 'expired':
                return 'bg-red-500/10 text-red-700 dark:text-red-400';
            default:
                return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back! Here's an overview of your contracts and reminders.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/contracts/create">
                            <FileCheck className="mr-2 h-4 w-4" />
                            New Contract
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-muted-foreground mb-1">
                                                {stat.label}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-3xl font-bold text-foreground">
                                                    {stat.value}
                                                </p>
                                                <span className={cn(
                                                    "text-xs font-medium flex items-center gap-1",
                                                    stat.trend.startsWith('+') ? "text-green-600" : "text-red-600"
                                                )}>
                                                    <TrendingUp className="h-3 w-3" />
                                                    {stat.trend}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                                            <Icon className={cn("h-6 w-6", stat.color)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Expiring Contracts */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Expiring Contracts</CardTitle>
                                <CardDescription>Contracts expiring in the next 90 days</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/contracts">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {expiringContracts.length === 0 ? (
                            <div className="text-center py-12">
                                <FileCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground mt-4">No contracts expiring soon</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Counterparty</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Days Left</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expiringContracts.map((contract) => (
                                            <TableRow key={contract.id}>
                                                <TableCell className="font-medium">
                                                    {contract.title}
                                                </TableCell>
                                                <TableCell>{contract.counterparty}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {new Date(contract.end_date).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {contract.days_until_end} days
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(getStatusColor(contract.status))}
                                                    >
                                                        {contract.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/contracts/${contract.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upcoming Reminders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Upcoming Reminders</CardTitle>
                                <CardDescription>Reminders scheduled for the next 30 days</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/reminders">View All</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {upcomingReminders.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground mt-4">No upcoming reminders</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingReminders.map((reminder) => (
                                    <div
                                        key={reminder.id}
                                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Bell className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {reminder.contract_title}
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Due: {new Date(reminder.trigger_datetime).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/reminders/${reminder.id}`}>
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
