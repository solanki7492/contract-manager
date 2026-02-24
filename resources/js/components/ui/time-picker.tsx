'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({ value, onChange, placeholder = 'Pick a time', disabled, className }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempTime, setTempTime] = React.useState<string>(value || '09:00');
  const [time, setTime] = React.useState<string | undefined>(value);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (value) {
      setTime(value);
      setTempTime(value);
    } else {
      setTime(undefined);
      setTempTime('09:00');
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
    if (onChange) {
      onChange(tempTime);
      setTime(tempTime);
    }
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempTime('09:00');
    setTime(undefined);
    if (onChange) {
      onChange('');
    }
    setIsOpen(false);
  };

  const formatTimeDisplay = (timeValue: string | undefined) => {
    if (!timeValue) return placeholder;

    // Parse the time
    const [hours, minutes] = timeValue.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    // Format to 12-hour format with AM/PM
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Generate hour options (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  // Generate minute options (0, 15, 30, 45)
  const minutes = ['00', '15', '30', '45'];

  const [selectedHour, selectedMinute] = tempTime.split(':');

  const handleHourChange = (hour: string) => {
    setTempTime(`${hour}:${selectedMinute}`);
  };

  const handleMinuteChange = (minute: string) => {
    setTempTime(`${selectedHour}:${minute}`);
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
          !time && 'text-muted-foreground',
          className
        )}
        disabled={disabled}
      >
        <Clock className="mr-2 h-4 w-4" />
        <span>{formatTimeDisplay(time)}</span>
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-[9999] mt-2 bg-popover border border-border rounded-md shadow-lg"
          style={{ top: '100%', left: 0 }}
        >
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Time</Label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedHour}
                    onChange={(e) => handleHourChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {hours.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span className="text-lg font-semibold">:</span>
                  <select
                    value={selectedMinute}
                    onChange={(e) => handleMinuteChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Selected: {formatTimeDisplay(tempTime)}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Select</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '12:00', '14:00', '17:00', '18:00', '20:00'].map((quickTime) => (
                    <Button
                      key={quickTime}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTempTime(quickTime)}
                      className={cn(
                        'h-8 text-xs',
                        tempTime === quickTime && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {formatTimeDisplay(quickTime)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
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
