import {
  Building,
  Bell,
  FileText,
  LayoutGrid,
  Settings,
  Users,
  UserPlus,
  UserCog
} from 'lucide-react';
import { type MenuConfig } from './types';

// Super Admin Menu - Only for managing companies and users
export const MENU_SUPERADMIN: MenuConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutGrid,
  },
  { heading: 'Admin' },
  {
    title: 'Companies',
    path: '/companies',
    icon: Building,
  },
  {
    title: 'Company Users',
    path: '/users',
    icon: UserPlus,
  },
  { heading: 'Settings' },
  {
    title: 'Profile',
    path: '/profile',
    icon: Settings,
  },
];

// Company User Menu - For managing contracts, reminders, contacts
export const MENU_COMPANY: MenuConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutGrid,
  },
  { heading: 'Management' },
  {
    title: 'Contracts',
    path: '/contracts',
    icon: FileText,
  },
  {
    title: 'Reminders',
    path: '/reminders',
    icon: Bell,
  },
  {
    title: 'Contacts',
    path: '/contacts',
    icon: Users,
  },
  {
    title: 'Users',
    path: '/users',
    icon: UserCog,
  },
  { heading: 'Settings' },
  {
    title: 'Profile',
    path: '/profile',
    icon: Settings,
  },
];
