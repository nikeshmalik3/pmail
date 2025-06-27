import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Server,
  Mail,
  Shield,
  Settings,
  Activity,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalEmails: number;
  storageUsed: number;
  storageTotal: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
}

export function Admin() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalEmails: 0,
    storageUsed: 0,
    storageTotal: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '',
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Mock data for admin panel
      const mockUsers: User[] = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          role: 'admin',
          status: 'active',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@company.com',
          role: 'user',
          status: 'active',
          lastLogin: '2024-01-14T15:20:00Z',
          createdAt: '2024-01-02T00:00:00Z',
        },
        {
          _id: '3',
          firstName: 'Bob',
          lastName: 'Wilson',
          email: 'bob.wilson@company.com',
          role: 'user',
          status: 'inactive',
          lastLogin: '2024-01-10T09:15:00Z',
          createdAt: '2024-01-03T00:00:00Z',
        },
      ];

      const mockStats: SystemStats = {
        totalUsers: 156,
        activeUsers: 142,
        totalEmails: 45678,
        storageUsed: 2.1,
        storageTotal: 15,
        cpuUsage: 35,
        memoryUsage: 68,
        uptime: '15 days, 4 hours',
      };

      setUsers(mockUsers);
      setSystemStats(mockStats);
    } catch (error: any) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'suspend' | 'delete') => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (action === 'delete') {
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        setUsers(prev => prev.map(u => 
          u._id === userId 
            ? { ...u, status: action === 'activate' ? 'active' : 'suspended' }
            : u
        ));
      }

      toast({
        title: 'Success',
        description: `User ${action}d successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to ${action} user`,
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user =>
    searchQuery === '' ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your PMail system and users</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-effect border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{systemStats.totalEmails.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Processed this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {systemStats.storageUsed}GB
            </div>
            <Progress 
              value={(systemStats.storageUsed / systemStats.storageTotal) * 100} 
              className="h-1 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              of {systemStats.storageTotal}GB used
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">System Health</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Healthy</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Uptime: {systemStats.uptime}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="glass-effect border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-900">User Management</CardTitle>
                  <CardDescription>Manage system users and their permissions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10 bg-blue-50/50 border-blue-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.status === 'active' ? 'default' : 
                            user.status === 'suspended' ? 'destructive' : 'secondary'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            {user.status === 'active' ? (
                              <DropdownMenuItem 
                                onClick={() => handleUserAction(user._id, 'suspend')}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleUserAction(user._id, 'activate')}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleUserAction(user._id, 'delete')}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass-effect border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 mb-2">{systemStats.cpuUsage}%</div>
                <Progress value={systemStats.cpuUsage} className="h-2" />
              </CardContent>
            </Card>

            <Card className="glass-effect border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <MemoryStick className="h-5 w-5 mr-2" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900 mb-2">{systemStats.memoryUsage}%</div>
                <Progress value={systemStats.memoryUsage} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <Card className="glass-effect border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">System Services</CardTitle>
              <CardDescription>Monitor the status of system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Mail Server (Postfix)', status: 'running' },
                  { name: 'IMAP Server (Dovecot)', status: 'running' },
                  { name: 'Database (MongoDB)', status: 'running' },
                  { name: 'Web Server (Nginx)', status: 'running' },
                  { name: 'Spam Filter (Rspamd)', status: 'running' },
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700 capitalize">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="glass-effect border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Security Overview</CardTitle>
              <CardDescription>Monitor security events and threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">0</div>
                    <p className="text-sm text-muted-foreground">Active Threats</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-700">3</div>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-700">12</div>
                    <p className="text-sm text-muted-foreground">Blocked IPs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-effect border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  System configuration options would be available here for administrators to manage
                  email server settings, security policies, and other system parameters.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}