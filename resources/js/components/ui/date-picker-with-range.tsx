'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarValue = Date | null | [Date | null, Date | null];

interface DatePickerWithRangeProps {
    from?: string;
    to?: string;
    onChange?: (from: string, to: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePickerWithRange({
    from,
    to,
    onChange,
    placeholder = 'Pick a date range',
    disabled,
    className,
}: DatePickerWithRangeProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [tempDateRange, setTempDateRange] = React.useState<[Date | null, Date | null]>([
        from ? new Date(from) : null,
        to ? new Date(to) : null,
    ]);
    const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([
        from ? new Date(from) : null,
        to ? new Date(to) : null,
    ]);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (from || to) {
            const range: [Date | null, Date | null] = [from ? new Date(from) : null, to ? new Date(to) : null];
            setDateRange(range);
            setTempDateRange(range);
        } else {
            setDateRange([null, null]);
            setTempDateRange([null, null]);
        }
    }, [from, to]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleDateRangeApply = () => {
        if (onChange && tempDateRange[0]) {
            const fromFormatted = format(tempDateRange[0], 'yyyy-MM-dd');
            const toFormatted = tempDateRange[1] ? format(tempDateRange[1], 'yyyy-MM-dd') : fromFormatted;
            onChange(fromFormatted, toFormatted);
            setDateRange(tempDateRange);
        }
        setIsOpen(false);
    };

    const handleDateRangeReset = () => {
        setTempDateRange([null, null]);
        setDateRange([null, null]);
        if (onChange) {
            onChange('', '');
        }
        setIsOpen(false);
    };

    const handleDateChange = (value: CalendarValue) => {
        if (Array.isArray(value)) {
            setTempDateRange([value[0] || null, value[1] || null]);
        }
    };

    const formatDateDisplay = () => {
        const [fromDate, toDate] = dateRange;
        if (fromDate) {
            if (toDate) {
                return `${format(fromDate, 'LLL dd, y')} - ${format(toDate, 'LLL dd, y')}`;
            }
            return format(fromDate, 'LLL dd, y');
        }
        return placeholder;
    };

    return (
        <div className="relative w-full">
            <Button
                ref={buttonRef}
                type="button"
                id="date"
                variant="outline"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    'w-full h-10 justify-start text-left font-normal',
                    !dateRange[0] && 'text-muted-foreground',
                    className
                )}
            >
                <CalendarDays size={16} className="me-2" />
                <span>{formatDateDisplay()}</span>
            </Button>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute z-[9999] mt-2 bg-popover border border-border rounded-md shadow-lg"
                    style={{ top: '100%', right: 0 }}
                >
                    <div className="p-3">
                        <Calendar
                            onChange={handleDateChange}
                            value={tempDateRange}
                            selectRange={true}
                            className="!border-none !font-sans"
                        />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
                        <Button variant="outline" size="sm" onClick={handleDateRangeReset}>
                            Reset
                        </Button>
                        <Button size="sm" onClick={handleDateRangeApply}>
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
