export interface Language {
    code: string;
    label: string;
    flag: string;
    direction: 'ltr' | 'rtl';
    messages?: Record<string, string>;
}
