import api from './api';

export interface Email {
  _id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments?: Attachment[];
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  _id: string;
  filename: string;
  size: number;
  mimeType: string;
  url: string;
}

export interface Folder {
  _id: string;
  name: string;
  type: 'inbox' | 'sent' | 'drafts' | 'trash' | 'custom';
  unreadCount: number;
  color?: string;
}

// Description: Get all email folders
// Endpoint: GET /api/email/folders
// Request: {}
// Response: { folders: Folder[] }
export const getFolders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        folders: [
          { _id: '1', name: 'Inbox', type: 'inbox', unreadCount: 12, color: '#3b82f6' },
          { _id: '2', name: 'Sent', type: 'sent', unreadCount: 0, color: '#10b981' },
          { _id: '3', name: 'Drafts', type: 'drafts', unreadCount: 3, color: '#f59e0b' },
          { _id: '4', name: 'Trash', type: 'trash', unreadCount: 0, color: '#ef4444' },
          { _id: '5', name: 'Important', type: 'custom', unreadCount: 5, color: '#8b5cf6' },
        ],
      });
    }, 500);
  });
};

// Description: Get emails by folder
// Endpoint: GET /api/email/folder/:folderId
// Request: { folderId: string, page?: number, limit?: number }
// Response: { emails: Email[], total: number, page: number, totalPages: number }
export const getEmailsByFolder = (folderId: string, page = 1, limit = 20) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockEmails: Email[] = [
        {
          _id: '1',
          from: 'john.doe@company.com',
          to: ['me@company.com'],
          subject: 'Q4 Budget Review Meeting',
          body: 'Hi team, I wanted to schedule our Q4 budget review meeting for next week. Please let me know your availability.',
          isRead: false,
          isStarred: true,
          folder: folderId,
          priority: 'high',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          _id: '2',
          from: 'sarah.wilson@partner.com',
          to: ['me@company.com'],
          cc: ['team@company.com'],
          subject: 'Project Update - Phase 2 Complete',
          body: 'Great news! We have successfully completed Phase 2 of the project ahead of schedule.',
          isRead: true,
          isStarred: false,
          folder: folderId,
          priority: 'normal',
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z',
        },
        {
          _id: '3',
          from: 'notifications@system.com',
          to: ['me@company.com'],
          subject: 'System Maintenance Scheduled',
          body: 'This is to inform you that system maintenance is scheduled for this weekend.',
          isRead: false,
          isStarred: false,
          folder: folderId,
          priority: 'low',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z',
        },
      ];
      
      resolve({
        emails: mockEmails,
        total: mockEmails.length,
        page: 1,
        totalPages: 1,
      });
    }, 500);
  });
};

// Description: Get single email by ID
// Endpoint: GET /api/email/:emailId
// Request: { emailId: string }
// Response: { email: Email }
export const getEmailById = (emailId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        email: {
          _id: emailId,
          from: 'john.doe@company.com',
          to: ['me@company.com'],
          subject: 'Q4 Budget Review Meeting',
          body: 'Hi team, I wanted to schedule our Q4 budget review meeting for next week. Please let me know your availability.',
          htmlBody: '<p>Hi team,</p><p>I wanted to schedule our Q4 budget review meeting for next week. Please let me know your availability.</p>',
          isRead: false,
          isStarred: true,
          folder: '1',
          priority: 'high',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      });
    }, 500);
  });
};

// Description: Send new email
// Endpoint: POST /api/email/send
// Request: { to: string[], cc?: string[], bcc?: string[], subject: string, body: string, attachments?: File[] }
// Response: { success: boolean, message: string, emailId: string }
export const sendEmail = (emailData: {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: File[];
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Email sent successfully',
        emailId: 'new-email-id',
      });
    }, 1000);
  });
};

// Description: Mark email as read/unread
// Endpoint: PATCH /api/email/:emailId/read
// Request: { emailId: string, isRead: boolean }
// Response: { success: boolean, message: string }
export const markEmailAsRead = (emailId: string, isRead: boolean) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Email marked as ${isRead ? 'read' : 'unread'}`,
      });
    }, 300);
  });
};

// Description: Star/unstar email
// Endpoint: PATCH /api/email/:emailId/star
// Request: { emailId: string, isStarred: boolean }
// Response: { success: boolean, message: string }
export const toggleEmailStar = (emailId: string, isStarred: boolean) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Email ${isStarred ? 'starred' : 'unstarred'}`,
      });
    }, 300);
  });
};

// Description: Search emails
// Endpoint: GET /api/email/search
// Request: { query: string, folder?: string, from?: string, to?: string }
// Response: { emails: Email[], total: number }
export const searchEmails = (searchParams: {
  query: string;
  folder?: string;
  from?: string;
  to?: string;
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        emails: [
          {
            _id: '1',
            from: 'john.doe@company.com',
            to: ['me@company.com'],
            subject: 'Q4 Budget Review Meeting',
            body: 'Hi team, I wanted to schedule our Q4 budget review meeting for next week.',
            isRead: false,
            isStarred: true,
            folder: '1',
            priority: 'high',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
          },
        ],
        total: 1,
      });
    }, 500);
  });
};