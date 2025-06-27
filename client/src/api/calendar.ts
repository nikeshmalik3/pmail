import api from './api';

export interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  location?: string;
  attendees: Attendee[];
  organizer: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  priority: 'low' | 'normal' | 'high';
  recurrence?: RecurrenceRule;
  reminders: Reminder[];
  calendarId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendee {
  email: string;
  name?: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  isOptional: boolean;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  until?: string;
  count?: number;
  byWeekDay?: number[];
}

export interface Reminder {
  method: 'email' | 'popup';
  minutes: number;
}

export interface Calendar {
  _id: string;
  name: string;
  color: string;
  description?: string;
  isVisible: boolean;
  isDefault: boolean;
  owner: string;
  permissions: 'read' | 'write' | 'admin';
}

// Description: Get all calendars
// Endpoint: GET /api/calendar/calendars
// Request: {}
// Response: { calendars: Calendar[] }
export const getCalendars = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        calendars: [
          {
            _id: '1',
            name: 'Work',
            color: '#3b82f6',
            description: 'Work-related events',
            isVisible: true,
            isDefault: true,
            owner: 'me@company.com',
            permissions: 'admin',
          },
          {
            _id: '2',
            name: 'Personal',
            color: '#10b981',
            description: 'Personal events',
            isVisible: true,
            isDefault: false,
            owner: 'me@company.com',
            permissions: 'admin',
          },
          {
            _id: '3',
            name: 'Team Meetings',
            color: '#8b5cf6',
            description: 'Team meeting schedule',
            isVisible: true,
            isDefault: false,
            owner: 'team@company.com',
            permissions: 'write',
          },
        ],
      });
    }, 500);
  });
};

// Description: Get calendar events
// Endpoint: GET /api/calendar/events
// Request: { start: string, end: string, calendarIds?: string[] }
// Response: { events: CalendarEvent[] }
export const getCalendarEvents = (start: string, end: string, calendarIds?: string[]) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEvents: CalendarEvent[] = [
        {
          _id: '1',
          title: 'Team Standup',
          description: 'Daily team standup meeting',
          start: '2024-01-15T09:00:00Z',
          end: '2024-01-15T09:30:00Z',
          allDay: false,
          location: 'Conference Room A',
          attendees: [
            { email: 'john@company.com', name: 'John Doe', status: 'accepted', isOptional: false },
            { email: 'jane@company.com', name: 'Jane Smith', status: 'pending', isOptional: false },
          ],
          organizer: 'me@company.com',
          status: 'confirmed',
          priority: 'normal',
          reminders: [{ method: 'popup', minutes: 15 }],
          calendarId: '1',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
        },
        {
          _id: '2',
          title: 'Project Review',
          description: 'Quarterly project review meeting',
          start: '2024-01-16T14:00:00Z',
          end: '2024-01-16T16:00:00Z',
          allDay: false,
          location: 'Main Conference Room',
          attendees: [
            { email: 'manager@company.com', name: 'Manager', status: 'accepted', isOptional: false },
          ],
          organizer: 'me@company.com',
          status: 'confirmed',
          priority: 'high',
          reminders: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
          calendarId: '1',
          createdAt: '2024-01-12T10:00:00Z',
          updatedAt: '2024-01-12T10:00:00Z',
        },
      ];
      
      resolve({ events: mockEvents });
    }, 500);
  });
};

// Description: Create new calendar event
// Endpoint: POST /api/calendar/events
// Request: { title: string, description?: string, start: string, end: string, allDay: boolean, location?: string, attendees: Attendee[], calendarId: string }
// Response: { success: boolean, message: string, event: CalendarEvent }
export const createCalendarEvent = (eventData: Partial<CalendarEvent>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Event created successfully',
        event: {
          _id: 'new-event-id',
          ...eventData,
          organizer: 'me@company.com',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }, 1000);
  });
};

// Description: Update calendar event
// Endpoint: PUT /api/calendar/events/:eventId
// Request: { eventId: string, ...eventData }
// Response: { success: boolean, message: string, event: CalendarEvent }
export const updateCalendarEvent = (eventId: string, eventData: Partial<CalendarEvent>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Event updated successfully',
        event: { _id: eventId, ...eventData },
      });
    }, 1000);
  });
};

// Description: Delete calendar event
// Endpoint: DELETE /api/calendar/events/:eventId
// Request: { eventId: string }
// Response: { success: boolean, message: string }
export const deleteCalendarEvent = (eventId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Event deleted successfully',
      });
    }, 500);
  });
};