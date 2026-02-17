import { formatDistanceToNow } from 'date-fns';
import { FileText, Bell, CheckCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification';

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const isUnread = !notification.read_at;
    const { data } = notification;

    const getIcon = () => {
        switch (data.type) {
            case 'contract_created':
                return <FileText className="size-5 text-primary" />;
            case 'reminder_created':
                return <Bell className="size-5 text-amber-500" />;
            default:
                return <Bell className="size-5 text-muted-foreground" />;
        }
    };

    const getTitle = () => {
        switch (data.type) {
            case 'contract_created':
                return 'New Contract Created';
            case 'reminder_created':
                return 'New Reminder Created';
            default:
                return 'Notification';
        }
    };

    const handleClick = () => {
        if (isUnread) {
            onMarkAsRead(notification.id);
        }
    };

    return (
        <Link
            href={data.action_url}
            onClick={handleClick}
            className={cn(
                'flex gap-3 px-5 py-3.5 hover:bg-muted/50 transition-colors relative',
                isUnread && 'bg-primary/5'
            )}
        >
            {isUnread && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
            )}

            <div className="flex-shrink-0 mt-0.5">
                <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full',
                    isUnread ? 'bg-primary/10' : 'bg-muted'
                )}>
                    {getIcon()}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={cn(
                        'text-sm font-medium',
                        isUnread ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                        {getTitle()}
                    </h4>
                    {isUnread && (
                        <CheckCircle className="size-4 text-primary flex-shrink-0" />
                    )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    {data.message}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{data.creator_name}</span>
                    <span>•</span>
                    <span>
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                </div>
            </div>
        </Link>
    );
}
