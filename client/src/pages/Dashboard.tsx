import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Mail,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { getFolders } from '@/api/email';
import { getCalendarEvents } from '@/api/calendar';
import { getContacts } from '@/api/contacts';
import { useToast } from '@/hooks/useToast';

interface DashboardStats {
  unreadEmails: number;
  todayEvents: number;
  totalContacts: number;
  completedTasks: number;
}

export function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    unreadEmails: 0,
    todayEvents: 0,
    totalContacts: 0,
    completedTasks: 0,
  });
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Loading dashboard data...');
        
        // Load folders to get unread count
        const foldersResponse = await getFolders() as any;
        const inboxFolder = foldersResponse.folders.find((f: any) => f.type === 'inbox');
        
        // Load today's events
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const eventsResponse = await getCalendarEvents(
          today.toISOString(),
          tomorrow.toISOString()
        ) as any;
        
        // Load contacts count
        const contactsResponse = await getContacts() as any;
        
        setStats({
          unreadEmails: inboxFolder?.unreadCount || 0,
          todayEvents: eventsResponse.events.length,
          totalContacts: contactsResponse.total,
          completedTasks: 8, // Mock data
        });

        // Set recent data for quick view
        setRecentEmails([
          {
            id: '1',
            from: 'john.doe@company.com',
            subject: 'Q4 Budget Review Meeting',
            time: '10:30 AM',
            isRead: false,
          },
          {
            id: '2',
            from: 'sarah.wilson@partner.com',
            subject: 'Project Update - Phase 2 Complete',
            time: '2:20 PM',
            isRead: true,
          },
        ]);

        setUpcomingEvents(eventsResponse.events.slice(0, 3));
        
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse border-brand-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-brand-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-brand-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-brand-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-brand-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-brand-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-900 text-shadow">Good morning, John!</h1>
          <p className="text-slate-600 mt-1">Here's what's happening with your communication today.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-2 rounded-lg border border-brand-200 shadow-sm">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect hover:shadow-xl transition-all duration-300 border-brand-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-700">Unread Emails</CardTitle>
            <div className="p-2 bg-brand-100 rounded-lg">
              <Mail className="h-4 w-4 text-brand-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-900">{stats.unreadEmails}</div>
            <p className="text-xs text-slate-600 flex items-center mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all duration-300 border-brand-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-700">Today's Events</CardTitle>
            <div className="p-2 bg-brand-100 rounded-lg">
              <Calendar className="h-4 w-4 text-brand-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-900">{stats.todayEvents}</div>
            <p className="text-xs text-slate-600 flex items-center mt-1">
              <Clock className="inline h-3 w-3 mr-1 text-brand-500" />
              Next in 2 hours
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all duration-300 border-brand-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-700">Total Contacts</CardTitle>
            <div className="p-2 bg-brand-100 rounded-lg">
              <Users className="h-4 w-4 text-brand-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-900">{stats.totalContacts}</div>
            <p className="text-xs text-slate-600 flex items-center mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +5 this week
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect hover:shadow-xl transition-all duration-300 border-brand-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-brand-700">Tasks Done</CardTitle>
            <div className="p-2 bg-brand-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-brand-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-900">{stats.completedTasks}</div>
            <p className="text-xs text-slate-600 flex items-center mt-1">
              <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
              80% completion rate
            </p>
            <Progress value={80} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Emails */}
        <Card className="glass-effect border-brand-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-brand-900">Recent Emails</CardTitle>
                <CardDescription className="text-slate-600">Your latest messages</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEmails.map((email) => (
              <div key={email.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-brand-100 text-brand-700 font-medium">
                    {email.from.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none text-slate-900">{email.from}</p>
                    <p className="text-xs text-slate-500">{email.time}</p>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{email.subject}</p>
                </div>
                {!email.isRead && (
                  <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="glass-effect border-brand-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-brand-900">Upcoming Events</CardTitle>
                <CardDescription className="text-slate-600">Your schedule for today</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                View Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-brand-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none text-slate-900">{event.title}</p>
                    <Badge className="bg-brand-600 text-white hover:bg-brand-700">
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {new Date(event.start).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })} - {event.location || 'No location'}
                  </p>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-brand-300" />
                <p>No events scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-effect border-brand-200">
        <CardHeader>
          <CardTitle className="text-brand-900">Quick Actions</CardTitle>
          <CardDescription className="text-slate-600">Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-20 bg-brand-600 hover:bg-brand-700 text-white flex-col gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
              <Mail className="h-6 w-6" />
              Compose Email
            </Button>
            <Button variant="outline" className="h-20 border-brand-200 hover:bg-brand-50 flex-col gap-2 text-brand-700 hover:text-brand-800 shadow-sm hover:shadow-md transition-all duration-200">
              <Calendar className="h-6 w-6 text-brand-600" />
              Schedule Meeting
            </Button>
            <Button variant="outline" className="h-20 border-brand-200 hover:bg-brand-50 flex-col gap-2 text-brand-700 hover:text-brand-800 shadow-sm hover:shadow-md transition-all duration-200">
              <Users className="h-6 w-6 text-brand-600" />
              Add Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}