import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
} from 'lucide-react';
import { getCalendars, getCalendarEvents, createCalendarEvent } from '@/api/calendar';
import { useToast } from '@/hooks/useToast';
import type { CalendarEvent, Calendar as CalendarType } from '@/api/calendar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Calendar() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendars();
    loadEvents();
  }, [currentDate]);

  const loadCalendars = async () => {
    try {
      console.log('Loading calendars...');
      const response = await getCalendars() as any;
      setCalendars(response.calendars);
    } catch (error: any) {
      console.error('Error loading calendars:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendars',
        variant: 'destructive',
      });
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      console.log('Loading calendar events...');
      const response = await getCalendarEvents(
        startOfMonth.toISOString(),
        endOfMonth.toISOString()
      ) as any;
      setEvents(response.events);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth();

  return (
    <div className="h-full flex">
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Create New Event</DialogTitle>
                <DialogDescription>
                  Add a new event to your calendar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">Event creation form would go here</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">My Calendars</h3>
          <div className="space-y-2">
            {calendars.map((calendar) => (
              <div key={calendar._id} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />
                <span className="text-sm">{calendar.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {calendar.permissions}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Upcoming Events</h3>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="p-3 rounded-lg border hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5"
                      style={{ backgroundColor: calendars.find(c => c._id === event.calendarId)?.color || '#3b82f6' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(event.start).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-900">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
                className={view === 'month' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Day
              </Button>
            </div>
          </div>
        </div>

        {view === 'month' && (
          <div className="flex-1 p-4">
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {DAYS.map((day) => (
                <div key={day} className="bg-blue-50 p-3 text-center">
                  <span className="text-sm font-medium text-blue-700">{day}</span>
                </div>
              ))}

              {days.map((date, index) => (
                <div
                  key={index}
                  className={`bg-white p-2 min-h-[120px] ${
                    date ? 'hover:bg-blue-50 cursor-pointer' : ''
                  } ${isToday(date) ? 'bg-blue-100' : ''}`}
                >
                  {date && (
                    <>
                      <div className={`text-sm font-medium mb-2 ${
                        isToday(date) ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {getEventsForDate(date).slice(0, 3).map((event) => (
                          <div
                            key={event._id}
                            className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                            style={{
                              backgroundColor: calendars.find(c => c._id === event.calendarId)?.color + '20',
                              borderLeft: `3px solid ${calendars.find(c => c._id === event.calendarId)?.color || '#3b82f6'}`,
                            }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {event.title}
                          </div>
                        ))}
                        {getEventsForDate(date).length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{getEventsForDate(date).length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent className="sm:max-w-[500px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-blue-900">{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  {selectedEvent.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedEvent.start).toLocaleString()} - {new Date(selectedEvent.end).toLocaleString()}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                {selectedEvent.attendees.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Attendees ({selectedEvent.attendees.length})</span>
                    </div>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {attendee.name?.charAt(0) || attendee.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{attendee.name || attendee.email}</span>
                          <Badge
                            variant={attendee.status === 'accepted' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {attendee.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Edit Event
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}