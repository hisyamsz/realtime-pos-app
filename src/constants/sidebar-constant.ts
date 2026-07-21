import {
  LayoutGrid,
  Receipt,
  UtensilsCrossed,
  Grid2X2,
  UserCog,
} from 'lucide-react';

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutGrid,
    },
    {
      title: 'Order',
      url: '/order',
      icon: Receipt,
    },
    {
      title: 'Menu',
      url: '/admin/menu',
      icon: UtensilsCrossed,
    },
    {
      title: 'Table',
      url: '/admin/table',
      icon: Grid2X2,
    },
    {
      title: 'User',
      url: '/admin/user',
      icon: UserCog,
    },
  ],
  cashier: [],
  kitchen: [],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
