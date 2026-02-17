export interface NotificationData {
    type: 'contract_created' | 'reminder_created';
    contract_id?: number;
    contract_title?: string;
    contract_counterparty?: string;
    reminder_id?: number;
    reminder_title?: string;
    trigger_datetime?: string;
    creator_id: number;
    creator_name: string;
    message: string;
    action_url: string;
}

export interface Notification {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface NotificationResponse {
    data: Notification[];
    unread_count: number;
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
