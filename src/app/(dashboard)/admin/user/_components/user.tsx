'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserPlus } from 'lucide-react';

export default function UserManagment() {
  const supabase = createClient();

  const {
    data: profiles,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-128">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search by name.."
            className="w-full pl-8"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="xl"
              className="group w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 sm:w-auto"
            >
              <UserPlus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Create User
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="rounded-md border p-4">
        {isLoading && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground text-sm">Loading users...</p>
          </div>
        )}

        {isError && (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-red-500">
            <p className="text-sm">
              Error loading users:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <button
              onClick={() => refetch()}
              className="text-sm font-medium underline underline-offset-4 hover:text-red-600"
            >
              Try again
            </button>
          </div>
        )}

        {profiles && profiles.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground text-sm">No users found.</p>
          </div>
        )}

        {profiles && profiles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="hover:bg-accent hover:text-accent-foreground flex flex-col gap-2 rounded-lg border p-4 transition-all"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm leading-none font-medium">
                    {profile.name || 'Unknown Name'}
                  </p>
                  <span className="focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none">
                    {profile.role || 'user'}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Joined: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
