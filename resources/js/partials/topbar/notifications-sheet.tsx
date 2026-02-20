import { ReactNode, useEffect, useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationItem } from './notification-item';
import type { Notification, NotificationResponse } from '@/types/notification';
import axios from 'axios';

interface NotificationsSheetProps {
  trigger: ReactNode;
  onUnreadCountChange?: (count: number) => void;
}

export function NotificationsSheet({ trigger, onUnreadCountChange }: NotificationsSheetProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get<NotificationResponse>('/notifications');
      setNotifications(response.data.data);
      setUnreadCount(response.data.unread_count);
      onUnreadCountChange?.(response.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await axios.post(`/notifications/${id}/read`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
      onUnreadCountChange?.(response.data.unread_count);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.post('/notifications/read-all');
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({
          ...notif,
          read_at: notif.read_at || new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
      onUnreadCountChange?.(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read_at);
  const readNotifications = notifications.filter(n => n.read_at);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3 flex items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary text-primary-foreground ml-2">
                {unreadCount} new
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="grow p-0">
          <ScrollArea className="h-[calc(100vh-10.5rem)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Bell className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {unreadNotifications.length > 0 && (
                  <>
                    <div className="px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                      Unread
                    </div>
                    {unreadNotifications.map((notification, index) => (
                      <div key={notification.id}>
                        <NotificationItem
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                        />
                        {index < unreadNotifications.length - 1 && (
                          <div className="border-b border-border mx-5" />
                        )}
                      </div>
                    ))}
                  </>
                )}

                {readNotifications.length > 0 && (
                  <>
                    {unreadNotifications.length > 0 && (
                      <div className="border-b border-border my-2" />
                    )}
                    <div className="px-5 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                      Earlier
                    </div>
                    {readNotifications.map((notification, index) => (
                      <div key={notification.id}>
                        <NotificationItem
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                        />
                        {index < readNotifications.length - 1 && (
                          <div className="border-b border-border mx-5" />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </SheetBody>
        {notifications.length > 0 && (
          <SheetFooter className="border-t border-border p-5 grid grid-cols-1 gap-2.5">
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
