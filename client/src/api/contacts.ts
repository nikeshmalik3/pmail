import api from './api';

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
  addresses: Address[];
  socialMedia: SocialMedia[];
  notes?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SocialMedia {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'other';
  url: string;
}

export interface ContactGroup {
  _id: string;
  name: string;
  description?: string;
  color: string;
  contactCount: number;
}

// Description: Get all contacts
// Endpoint: GET /api/contacts
// Request: { page?: number, limit?: number, search?: string, group?: string }
// Response: { contacts: Contact[], total: number, page: number, totalPages: number }
export const getContacts = (page = 1, limit = 20, search?: string, group?: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockContacts: Contact[] = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1 (555) 123-4567',
          company: 'Tech Corp',
          jobTitle: 'Senior Developer',
          avatar: '',
          addresses: [
            {
              type: 'work',
              street: '123 Business St',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94105',
              country: 'USA',
            },
          ],
          socialMedia: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
          ],
          notes: 'Great team player, excellent technical skills',
          tags: ['colleague', 'developer'],
          isFavorite: true,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
        },
        {
          _id: '2',
          firstName: 'Sarah',
          lastName: 'Wilson',
          email: 'sarah.wilson@partner.com',
          phone: '+1 (555) 987-6543',
          company: 'Partner Solutions',
          jobTitle: 'Project Manager',
          avatar: '',
          addresses: [],
          socialMedia: [],
          notes: 'Key contact for partnership projects',
          tags: ['partner', 'manager'],
          isFavorite: false,
          createdAt: '2024-01-12T14:30:00Z',
          updatedAt: '2024-01-12T14:30:00Z',
        },
        {
          _id: '3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@client.com',
          phone: '+1 (555) 456-7890',
          company: 'Client Industries',
          jobTitle: 'CEO',
          avatar: '',
          addresses: [],
          socialMedia: [
            { platform: 'twitter', url: 'https://twitter.com/mikejohnson' },
          ],
          notes: 'Important client, prefers email communication',
          tags: ['client', 'executive'],
          isFavorite: true,
          createdAt: '2024-01-08T09:15:00Z',
          updatedAt: '2024-01-08T09:15:00Z',
        },
      ];
      
      resolve({
        contacts: mockContacts,
        total: mockContacts.length,
        page: 1,
        totalPages: 1,
      });
    }, 500);
  });
};

// Description: Get contact by ID
// Endpoint: GET /api/contacts/:contactId
// Request: { contactId: string }
// Response: { contact: Contact }
export const getContactById = (contactId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        contact: {
          _id: contactId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          phone: '+1 (555) 123-4567',
          company: 'Tech Corp',
          jobTitle: 'Senior Developer',
          avatar: '',
          addresses: [
            {
              type: 'work',
              street: '123 Business St',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94105',
              country: 'USA',
            },
          ],
          socialMedia: [
            { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
          ],
          notes: 'Great team player, excellent technical skills',
          tags: ['colleague', 'developer'],
          isFavorite: true,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-10T10:00:00Z',
        },
      });
    }, 500);
  });
};

// Description: Create new contact
// Endpoint: POST /api/contacts
// Request: { firstName: string, lastName: string, email: string, phone?: string, company?: string, jobTitle?: string }
// Response: { success: boolean, message: string, contact: Contact }
export const createContact = (contactData: Partial<Contact>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Contact created successfully',
        contact: {
          _id: 'new-contact-id',
          ...contactData,
          addresses: [],
          socialMedia: [],
          tags: [],
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }, 1000);
  });
};

// Description: Update contact
// Endpoint: PUT /api/contacts/:contactId
// Request: { contactId: string, ...contactData }
// Response: { success: boolean, message: string, contact: Contact }
export const updateContact = (contactId: string, contactData: Partial<Contact>) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Contact updated successfully',
        contact: { _id: contactId, ...contactData },
      });
    }, 1000);
  });
};

// Description: Delete contact
// Endpoint: DELETE /api/contacts/:contactId
// Request: { contactId: string }
// Response: { success: boolean, message: string }
export const deleteContact = (contactId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Contact deleted successfully',
      });
    }, 500);
  });
};

// Description: Get contact groups
// Endpoint: GET /api/contacts/groups
// Request: {}
// Response: { groups: ContactGroup[] }
export const getContactGroups = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        groups: [
          { _id: '1', name: 'Colleagues', description: 'Work colleagues', color: '#3b82f6', contactCount: 15 },
          { _id: '2', name: 'Clients', description: 'Client contacts', color: '#10b981', contactCount: 8 },
          { _id: '3', name: 'Partners', description: 'Business partners', color: '#8b5cf6', contactCount: 5 },
          { _id: '4', name: 'Vendors', description: 'Service vendors', color: '#f59e0b', contactCount: 12 },
        ],
      });
    }, 500);
  });
};

// Description: Search contacts
// Endpoint: GET /api/contacts/search
// Request: { query: string }
// Response: { contacts: Contact[], total: number }
export const searchContacts = (query: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        contacts: [
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@company.com',
            phone: '+1 (555) 123-4567',
            company: 'Tech Corp',
            jobTitle: 'Senior Developer',
            avatar: '',
            addresses: [],
            socialMedia: [],
            notes: '',
            tags: ['colleague'],
            isFavorite: true,
            createdAt: '2024-01-10T10:00:00Z',
            updatedAt: '2024-01-10T10:00:00Z',
          },
        ],
        total: 1,
      });
    }, 500);
  });
};