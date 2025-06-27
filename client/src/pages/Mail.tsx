import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Paperclip,
  Flag,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getFolders, getEmailsByFolder, getEmailById, markEmailAsRead, toggleEmailStar } from '@/api/email';
import { useToast } from '@/hooks/useToast';
import type { Email, Folder } from '@/api/email';

export function Mail() {
  const { folderId = 'inbox' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (folderId) {
      loadEmails(folderId);
    }
  }, [folderId]);

  const loadFolders = async () => {
    try {
      console.log('Loading email folders...');
      const response = await getFolders() as any;
      setFolders(response.folders);
    } catch (error: any) {
      console.error('Error loading folders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email folders',
        variant: 'destructive',
      });
    }
  };

  const loadEmails = async (folder: string) => {
    try {
      setLoading(true);
      console.log('Loading emails for folder:', folder);
      const response = await getEmailsByFolder(folder) as any;
      setEmails(response.emails);
      setSelectedEmail(null);
    } catch (error: any) {
      console.error('Error loading emails:', error);
      toast({
        title: 'Error',
        description: 'Failed to load emails',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSelect = async (email: Email) => {
    try {
      setSelectedEmail(email);
      if (!email.isRead) {
        await markEmailAsRead(email._id, true);
        setEmails(prev => prev.map(e =>
          e._id === email._id ? { ...e, isRead: true } : e
        ));
      }
    } catch (error: any) {
      console.error('Error marking email as read:', error);
    }
  };

  const handleStarToggle = async (email: Email) => {
    try {
      await toggleEmailStar(email._id, !email.isStarred);
      setEmails(prev => prev.map(e =>
        e._id === email._id ? { ...e, isStarred: !e.isStarred } : e
      ));
      if (selectedEmail?._id === email._id) {
        setSelectedEmail(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
      }
      toast({
        title: 'Success',
        description: `Email ${!email.isStarred ? 'starred' : 'unstarred'}`,
      });
    } catch (error: any) {
      console.error('Error toggling star:', error);
      toast({
        title: 'Error',
        description: 'Failed to update email',
        variant: 'destructive',
      });
    }
  };

  const currentFolder = folders.find(f => f._id === folderId || f.type === folderId);
  const filteredEmails = emails.filter(email =>
    searchQuery === '' ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-900">
              {currentFolder?.name || 'Inbox'}
            </h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {filteredEmails.length}
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search emails..."
              className="pl-10 bg-blue-50/50 border-blue-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
              {filteredEmails.map((email) => (
                <div
                  key={email._id}
                  className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedEmail?._id === email._id ? 'bg-blue-100 border-r-4 border-blue-600' : ''
                  } ${!email.isRead ? 'bg-blue-25' : ''}`}
                  onClick={() => handleEmailSelect(email)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {email.from.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${!email.isRead ? 'font-semibold' : ''}`}>
                          {email.from}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarToggle(email);
                            }}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                email.isStarred ? 'fill-blue-400 text-blue-400' : 'text-gray-400'
                              }`}
                            />
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            {new Date(email.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm text-muted-foreground truncate mt-1 ${!email.isRead ? 'font-medium' : ''}`}>
                        {email.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {email.body}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        {email.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">High</Badge>
                        )}
                        {email.attachments && email.attachments.length > 0 && (
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        )}
                        {!email.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
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
        {selectedEmail ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                      <DropdownMenuItem>Add label</DropdownMenuItem>
                      <DropdownMenuItem>Block sender</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-blue-900">{selectedEmail.subject}</h1>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>From: {selectedEmail.from}</span>
                      <span>To: {selectedEmail.to.join(', ')}</span>
                      <span>{new Date(selectedEmail.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedEmail.priority === 'high' && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStarToggle(selectedEmail)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          selectedEmail.isStarred ? 'fill-blue-400 text-blue-400' : 'text-gray-400'
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="prose max-w-none">
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: selectedEmail.htmlBody || selectedEmail.body.replace(/\n/g, '<br>')
                    }}
                  />
                </div>

                {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map((attachment) => (
                        <div key={attachment._id} className="flex items-center space-x-2 p-2 border rounded-lg">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{attachment.filename}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(attachment.size / 1024).toFixed(1)} KB)
                          </span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline">
                  <ReplyAll className="h-4 w-4 mr-2" />
                  Reply All
                </Button>
                <Button variant="outline">
                  <Forward className="h-4 w-4 mr-2" />
                  Forward
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No email selected</h3>
                <p className="text-muted-foreground">Choose an email from the list to view its contents</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}