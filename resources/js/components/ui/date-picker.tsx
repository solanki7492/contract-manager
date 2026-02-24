'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type CalendarValue = Date | null | [Date | null, Date | null];

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', disabled, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date | null>(value ? new Date(value) : null);
  const [date, setDate] = React.useState<Date | null>(value ? new Date(value) : null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      setDate(newDate);
      setTempDate(newDate);
    } else {
      setDate(null);
      setTempDate(null);
    }
  }, [value]);

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

  const handleApply = () => {
    if (tempDate && onChange) {
      const formatted = format(tempDate, 'yyyy-MM-dd');
      onChange(formatted);
      setDate(tempDate);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempDate(null);
    setDate(null);
    if (onChange) {
      onChange('');
    }
    setIsOpen(false);
  };

  const handleDateChange = (value: CalendarValue) => {
    if (value && !Array.isArray(value)) {
      setTempDate(value);
    }
  };

  return (
    <div className="relative w-full">
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full h-10 justify-start text-left font-normal',
          !date && 'text-muted-foreground',
          className
        )}
        disabled={disabled}
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        {date ? format(date, 'LLL dd, y') : <span>{placeholder}</span>}
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-[9999] mt-2 bg-popover border border-border rounded-md shadow-lg"
          style={{ top: '100%', left: 0 }}
        >
          <div className="p-3">
            <Calendar
              onChange={handleDateChange}
              value={tempDate}
              className="!border-none !font-sans"
            />
          </div>
          <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
