'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({ value, onChange, placeholder = 'Pick a time', disabled, className }: TimePickerProps) {
  const [time, setTime] = React.useState(value || '09:00');
  const [hours, setHours] = React.useState(value ? value.split(':')[0] : '09');
  const [minutes, setMinutes] = React.useState(value ? value.split(':')[1] : '00');

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(h);
      setMinutes(m);
      setTime(value);
    }
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    const numVal = parseInt(val || '0');
    if (numVal > 23) val = '23';
    setHours(val.padStart(2, '0'));
    updateTime(val.padStart(2, '0'), minutes);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    const numVal = parseInt(val || '0');
    if (numVal > 59) val = '59';
    setMinutes(val.padStart(2, '0'));
    updateTime(hours, val.padStart(2, '0'));
  };

  const updateTime = (h: string, m: string) => {
    const newTime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    setTime(newTime);
    if (onChange) {
      onChange(newTime);
    }
  };

  const formatDisplayTime = () => {
    if (!hours || !minutes) return placeholder;
    const h = parseInt(hours);
    const m = parseInt(minutes);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full h-10 justify-start text-left font-normal',
            !time && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>{formatDisplayTime()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">Hours</label>
            <Input
              type="text"
              value={hours}
              onChange={handleHoursChange}
              className="w-16 text-center"
              placeholder="00"
              maxLength={2}
            />
          </div>
          <div className="pt-6 text-2xl font-semibold">:</div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">Minutes</label>
            <Input
              type="text"
              value={minutes}
              onChange={handleMinutesChange}
              className="w-16 text-center"
              placeholder="00"
              maxLength={2}
            />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {['00:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '23:59'].map((presetTime) => (
            <Button
              key={presetTime}
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                const [h, m] = presetTime.split(':');
                setHours(h);
                setMinutes(m);
                updateTime(h, m);
              }}
            >
              {presetTime}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
