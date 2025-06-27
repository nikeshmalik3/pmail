import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Building,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  ExternalLink,
} from 'lucide-react';
import { getContacts, getContactGroups, createContact, deleteContact } from '@/api/contacts';
import { useToast } from '@/hooks/useToast';
import type { Contact, ContactGroup } from '@/api/contacts';

export function Contacts() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
    loadGroups();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      console.log('Loading contacts...');
      const response = await getContacts() as any;
      setContacts(response.contacts);
    } catch (error: any) {
      console.error('Error loading contacts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contacts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    try {
      console.log('Loading contact groups...');
      const response = await getContactGroups() as any;
      setGroups(response.groups);
    } catch (error: any) {
      console.error('Error loading groups:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      setContacts(prev => prev.filter(c => c._id !== contactId));
      if (selectedContact?._id === contactId) {
        setSelectedContact(null);
      }
      toast({
        title: 'Success',
        description: 'Contact deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === '' ||
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup = selectedGroup === 'all' ||
      contact.tags.includes(selectedGroup);

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="h-full flex">
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Add New Contact</DialogTitle>
                <DialogDescription>
                  Create a new contact in your address book.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">Contact creation form would go here</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-10 bg-blue-50/50 border-blue-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Button
              variant={selectedGroup === 'all' ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                selectedGroup === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
              onClick={() => setSelectedGroup('all')}
            >
              All Contacts
              <Badge variant="secondary" className="ml-auto">
                {contacts.length}
              </Badge>
            </Button>

            {groups.map((group) => (
              <Button
                key={group._id}
                variant={selectedGroup === group.name.toLowerCase() ? 'default' : 'ghost'}
                className={`w-full justify-start ${
                  selectedGroup === group.name.toLowerCase() ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
                onClick={() => setSelectedGroup(group.name.toLowerCase())}
              >
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: group.color }}
                />
                {group.name}
                <Badge variant="secondary" className="ml-auto">
                  {group.contactCount}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-900">
            Contacts ({filteredContacts.length})
          </h2>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedContact?._id === contact._id ? 'bg-blue-100 border-r-4 border-blue-600' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {contact.firstName} {contact.lastName}
                        </p>
                        {contact.isFavorite && (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contact.email}</p>
                      {contact.company && (
                        <p className="text-xs text-muted-foreground truncate">{contact.company}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-1">
                        {contact.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">+{contact.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {selectedContact ? (
          <>
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedContact.avatar} alt={`${selectedContact.firstName} ${selectedContact.lastName}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                      {selectedContact.firstName.charAt(0)}{selectedContact.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </h1>
                    {selectedContact.jobTitle && selectedContact.company && (
                      <p className="text-muted-foreground">
                        {selectedContact.jobTitle} at {selectedContact.company}
                      </p>
                    )}
                    <div className="flex items-center mt-2 space-x-2">
                      {selectedContact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Contact
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteContact(selectedContact._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Contact Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{selectedContact.email}</p>
                        </div>
                      </div>

                      {selectedContact.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
                          </div>
                        </div>
                      )}

                      {selectedContact.company && (
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-sm text-muted-foreground">{selectedContact.company}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {selectedContact.addresses.map((address, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium capitalize">{address.type} Address</p>
                            <p className="text-sm text-muted-foreground">
                              {address.street}<br />
                              {address.city}, {address.state} {address.zipCode}<br />
                              {address.country}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedContact.socialMedia.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Social Media</h3>
                    <div className="space-y-2">
                      {selectedContact.socialMedia.map((social, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                            <ExternalLink className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">{social.platform}</p>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {social.url}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedContact.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Notes</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{selectedContact.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Contact History</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {new Date(selectedContact.createdAt).toLocaleDateString()}</p>
                    <p>Last updated: {new Date(selectedContact.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No contact selected</h3>
                <p className="text-muted-foreground">Choose a contact from the list to view their details</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}