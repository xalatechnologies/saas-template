'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  MoreHorizontal
} from 'lucide-react';
import { Button, Badge, Select } from '../ui';
import { cn } from '@/utils';

export interface CalendarEvent<T> {
  readonly id: string;
  readonly title: string;
  readonly start: Date;
  readonly end: Date;
  readonly allDay?: boolean;
  readonly color?: string;
  readonly data: T;
}

export interface CalendarViewProps<T> {
  readonly events: CalendarEvent<T>[];
  readonly view?: 'month' | 'week' | 'day' | 'agenda';
  readonly currentDate?: Date;
  readonly onEventClick?: (event: CalendarEvent<T>) => void;
  readonly onDateClick?: (date: Date) => void;
  readonly onEventCreate?: (start: Date, end: Date) => void;
  readonly renderEvent?: (event: CalendarEvent<T>) => React.ReactNode;
  readonly showControls?: boolean;
  readonly firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
  readonly height?: string;
  readonly loading?: boolean;
  readonly className?: string;
}

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

/**
 * Calendar view component for event displays
 * @returns JSX.Element
 */
export function CalendarView<T>({
  events,
  view: initialView = 'month',
  currentDate: initialDate = new Date(),
  onEventClick,
  onDateClick,
  onEventCreate,
  renderEvent,
  showControls = true,
  firstDayOfWeek = 1,
  height = '600px',
  loading = false,
  className,
}: CalendarViewProps<T>): JSX.Element {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>(initialView);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calendar calculations
  const { startDate, endDate, days, weeks } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() - firstDayOfWeek + 7) % 7));
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + ((6 - lastDay.getDay() + firstDayOfWeek) % 7));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return { startDate, endDate, days, weeks };
  }, [currentDate, firstDayOfWeek]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);
      
      return (eventStart <= dateEnd && eventEnd >= dateStart);
    });
  };

  // Navigation handlers
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const orderedWeekDays = [
    ...weekDays.slice(firstDayOfWeek),
    ...weekDays.slice(0, firstDayOfWeek),
  ];

  if (loading) {
    return (
      <div 
        className={cn('flex items-center justify-center bg-card rounded-xl', className)}
        style={{ height }}
      >
        <div className="text-center">
          <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col bg-card rounded-xl border border-border', className)} style={{ height }}>
      {/* Calendar Header */}
      {showControls && (
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h2>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigatePrevious}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToday}
                className="rounded-lg"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateNext}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {onEventCreate && (
              <Button
                onClick={() => onEventCreate(new Date(), new Date())}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            )}
            <Select
              value={view}
              onValueChange={(value) => setView(value as CalendarView)}
              className="w-32"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
              <option value="agenda">Agenda</option>
            </Select>
          </div>
        </div>
      )}

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto">
        {view === 'month' && (
          <MonthView
            weeks={weeks}
            weekDays={orderedWeekDays}
            currentDate={currentDate}
            selectedDate={selectedDate}
            getEventsForDate={getEventsForDate}
            onDateClick={(date) => {
              setSelectedDate(date);
              onDateClick?.(date);
            }}
            onEventClick={onEventClick}
            renderEvent={renderEvent}
          />
        )}

        {view === 'week' && (
          <WeekView
            days={days.slice(0, 7)}
            weekDays={orderedWeekDays}
            getEventsForDate={getEventsForDate}
            onEventClick={onEventClick}
            renderEvent={renderEvent}
          />
        )}

        {view === 'day' && (
          <DayView
            date={currentDate}
            events={getEventsForDate(currentDate)}
            onEventClick={onEventClick}
            renderEvent={renderEvent}
          />
        )}

        {view === 'agenda' && (
          <AgendaView
            events={events}
            startDate={currentDate}
            onEventClick={onEventClick}
            renderEvent={renderEvent}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Month view component
 */
interface MonthViewProps<T> {
  readonly weeks: Date[][];
  readonly weekDays: string[];
  readonly currentDate: Date;
  readonly selectedDate: Date | null;
  readonly getEventsForDate: (date: Date) => CalendarEvent<T>[];
  readonly onDateClick: (date: Date) => void;
  readonly onEventClick?: (event: CalendarEvent<T>) => void;
  readonly renderEvent?: (event: CalendarEvent<T>) => React.ReactNode;
}

function MonthView<T>({
  weeks,
  weekDays,
  currentDate,
  selectedDate,
  getEventsForDate,
  onDateClick,
  onEventClick,
  renderEvent,
}: MonthViewProps<T>): JSX.Element {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="h-full">
      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, dayIndex) => {
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.getTime() === today.getTime();
              const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
              const events = getEventsForDate(date);

              return (
                <div
                  key={dayIndex}
                  onClick={() => onDateClick(date)}
                  className={cn(
                    'min-h-[100px] border-r border-b border-border p-2 cursor-pointer hover:bg-accent transition-colors',
                    !isCurrentMonth && 'bg-muted/30 text-muted-foreground',
                    isToday && 'bg-primary/5',
                    isSelected && 'ring-2 ring-primary ring-inset'
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={cn(
                      'text-sm font-medium',
                      isToday && 'text-primary'
                    )}>
                      {date.getDate()}
                    </span>
                    {events.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {events.length}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 3).map((event) => (
                      <CalendarEventItem
                        key={event.id}
                        event={event}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        renderEvent={renderEvent}
                        compact
                      />
                    ))}
                    {events.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{events.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Calendar event item component
 */
interface CalendarEventItemProps<T> {
  readonly event: CalendarEvent<T>;
  readonly onClick?: (e: React.MouseEvent) => void;
  readonly renderEvent?: (event: CalendarEvent<T>) => React.ReactNode;
  readonly compact?: boolean;
}

function CalendarEventItem<T>({
  event,
  onClick,
  renderEvent,
  compact = false,
}: CalendarEventItemProps<T>): JSX.Element {
  if (renderEvent) {
    return <div onClick={onClick}>{renderEvent(event)}</div>;
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded px-2 py-1 text-xs truncate cursor-pointer hover:opacity-80',
        event.color ? `bg-${event.color}-500 text-white` : 'bg-primary text-primary-foreground',
        compact && 'py-0.5'
      )}
    >
      {!event.allDay && (
        <span className="font-medium">
          {event.start.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {' '}
        </span>
      )}
      {event.title}
    </div>
  );
}

// Placeholder implementations for other views
function WeekView<T>(props: any): JSX.Element {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
      <p>Week view coming soon</p>
    </div>
  );
}

function DayView<T>(props: any): JSX.Element {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
      <p>Day view coming soon</p>
    </div>
  );
}

function AgendaView<T>(props: any): JSX.Element {
  return (
    <div className="p-8 text-center text-muted-foreground">
      <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
      <p>Agenda view coming soon</p>
    </div>
  );
}