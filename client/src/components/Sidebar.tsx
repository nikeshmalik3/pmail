import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Calendar,
  Users,
  Settings,
  Inbox,
  Send,
  FileText,
  Trash2,
  Star,
  Archive,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Shield,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Mail',
    href: '/mail',
    icon: Mail,
    children: [
      { title: 'Inbox', href: '/mail/inbox', icon: Inbox, badge: 12 },
      { title: 'Starred', href: '/mail/starred', icon: Star, badge: 3 },
      { title: 'Sent', href: '/mail/sent', icon: Send },
      { title: 'Drafts', href: '/mail/drafts', icon: FileText, badge: 2 },
      { title: 'Archive', href: '/mail/archive', icon: Archive },
      { title: 'Trash', href: '/mail/trash', icon: Trash2 },
    ],
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Contacts',
    href: '/contacts',
    icon: Users,
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Mail']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const active = isActive(item.href);

    return (
      <div key={item.title}>
        <div className="relative">
          {hasChildren ? (
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 h-10 px-3 text-slate-700 hover:text-brand-900 hover:bg-brand-50 transition-all duration-200',
                level > 0 && 'pl-6',
                active && 'bg-brand-100 text-brand-900 font-medium shadow-sm border-r-2 border-brand-600'
              )}
              onClick={() => toggleExpanded(item.title)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-brand-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-brand-600" />
              )}
              <item.icon className="h-4 w-4 text-brand-600" />
              <span className="flex-1 text-left font-medium">{item.title}</span>
              {item.badge && (
                <Badge className="bg-brand-600 text-white hover:bg-brand-700 text-xs px-2 py-0.5">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3 h-10 px-3 text-slate-700 hover:text-brand-900 hover:bg-brand-50 transition-all duration-200',
                level > 0 && 'pl-6',
                active && 'bg-brand-100 text-brand-900 font-medium shadow-sm border-r-2 border-brand-600'
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="h-4 w-4 text-brand-600" />
                <span className="flex-1 text-left font-medium">{item.title}</span>
                {item.badge && (
                  <Badge className="bg-brand-600 text-white hover:bg-brand-700 text-xs px-2 py-0.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-2 mt-1 space-y-1 border-l border-brand-200 pl-2">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex h-full w-64 flex-col border-r border-brand-200 bg-white shadow-sm', className)}>
      <div className="p-4 border-b border-brand-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center shadow-lg">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-brand-900">PMail</h1>
        </div>

        <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Compose
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-1">
          {navigation.map(item => renderNavItem(item))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-brand-200 bg-brand-25">
        <div className="text-xs text-slate-600 font-medium mb-2">
          Storage: 2.1 GB of 15 GB used
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-300" style={{ width: '14%' }}></div>
        </div>
      </div>
    </div>
  );
}