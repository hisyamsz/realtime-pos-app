'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { logoutAction } from '@/actions/auth-action';
import {
  Store,
  Settings,
  User,
  LogOut,
  MoreVertical,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from '@/constants/sidebar-constant';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';

interface UserProfile {
  name: string;
  role: string;
  avatar_url?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export default function AppSidebar() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserProfile({
              name: profile.name || profile.full_name || 'User',
              role: profile.role || '',
              avatar_url: profile.avatar_url,
            });
          } else {
            setUserProfile({
              name: user.email?.split('@')[0] || 'User',
              role: '',
              avatar_url: undefined,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    document.body.style.cursor = 'wait';
    try {
      await logoutAction();
      toast.success('Logout Berhasil!', {
        description: 'Mengarahkan ke halaman login...',
        position: 'top-right',
      });
      const callbackUrl = pathname;
      const url = new URL('/login', window.location.origin);
      url.searchParams.set('callbackUrl', callbackUrl);
      router.push(url.pathname + url.search);
    } catch (error) {
      toast.error('Logout Gagal', {
        description: 'Terjadi kesalahan saat mencoba keluar.',
        position: 'top-right',
      });
      setIsLoggingOut(false);
    } finally {
      document.body.style.cursor = 'default';
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="hover:bg-transparent"
            >
              <Link href="/">
                <div className="bg-ink text-canvas flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Store className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-lg font-semibold">
                    Omni POS
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton className="flex h-auto items-center gap-3 rounded-lg bg-transparent px-4 py-3 hover:bg-transparent">
                        <Skeleton className="h-5 w-5 shrink-0 rounded" />
                        <Skeleton className="h-5 w-32 rounded" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                : SIDEBAR_MENU_LIST[userProfile?.role as SidebarMenuKey]?.map(
                    (item) => {
                      const isActive = pathname === item.url;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.title}
                            className={cn(
                              'flex h-auto items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-ink text-canvas hover:bg-ink/90 hover:text-canvas data-[active=true]:bg-ink data-[active=true]:text-canvas data-[active=true]:hover:bg-ink/90 data-[active=true]:hover:text-canvas'
                                : 'text-mute hover:text-ink hover:bg-soft-cloud bg-transparent dark:hover:bg-white/10 dark:hover:text-white',
                            )}
                          >
                            <Link href={item.url}>
                              {item.icon && (
                                <item.icon className="h-4 w-4 shrink-0" />
                              )}
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    },
                  )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full items-center justify-between"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {isLoading ? (
                      <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                    ) : (
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userProfile?.avatar_url}
                          alt={userProfile?.name}
                        />
                        <AvatarFallback className="bg-ink text-canvas rounded-lg font-semibold">
                          {userProfile?.name
                            ? getInitials(userProfile.name)
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                      {isLoading ? (
                        <div className="mt-0.5 flex flex-col gap-1.5">
                          <Skeleton className="h-4 w-20 rounded" />
                          <Skeleton className="h-3 w-12 rounded" />
                        </div>
                      ) : (
                        <>
                          <span className="truncate font-semibold">
                            {userProfile?.name || 'Loading...'}
                          </span>
                          <span className="text-mute truncate text-xs capitalize">
                            {userProfile?.role || 'user'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <MoreVertical className="text-mute h-4 w-4 shrink-0 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
                alignOffset={isMobile ? 0 : 8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="truncate text-sm leading-none font-semibold">
                      {userProfile?.name || 'Loading...'}
                    </p>
                    <p className="text-mute truncate text-xs leading-none capitalize">
                      {userProfile?.role || 'user'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-sale focus:bg-sale/10 focus:text-sale cursor-pointer"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <Loader2 className="text-sale mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="text-sale mr-2 h-4 w-4" />
                  )}
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
