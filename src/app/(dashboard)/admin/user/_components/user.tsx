'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/common/data-table';
import DropdownAction from '@/components/common/dropdown-action';
import { HEADER_TABLE_USER } from '@/constants/user-constants';
import { DEFAULT_PAGE } from '@/constants/data-table-constants';
import useDataTable from '@/hooks/use-data-table';

export default function UserManagment() {
  const supabase = createClient();

  const {
    currentPage: page,
    currentLimit: limit,
    handleChangePage,
    handleChangeLimit,
    setCurrentPage,
  } = useDataTable();

  const [search, setSearch] = useState('');

  const handleEdit = (id: string) => {
    console.log('Edit user ID:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete user ID:', id);
  };

  const {
    data: users,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*', { count: 'exact' });

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        toast.error(`Failed to load users`, {
          description: error.message,
        });
        throw error;
      }
      return { profiles: data, count };
    },
  });

  const totalPages = useMemo(() => {
    return users && users.count !== null
      ? Math.ceil(users.count / limit)
      : 0;
  }, [users, limit]);

  const filteredData = useMemo(() => {
    return (users?.profiles || []).map((user, index) => {
      return [
        (page - 1) * limit + index + 1,
        <span
          key={`id-${user.id}`}
          className="inline-block font-medium"
          title={user.id}
        >
          {user.id}
        </span>,
        user.name || 'Unknown Name',
        <Badge
          key={`role-${user.id}`}
          variant={user.role === 'admin' ? 'default' : 'outline'}
          className="capitalize"
        >
          {user.role || 'user'}
        </Badge>,
        <DropdownAction
          key={`action-${user.id}`}
          menu={[
            {
              label: (
                <span className="flex items-center gap-2 text-blue-600">
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit
                </span>
              ),
              action: () => handleEdit(user.id),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  Delete
                </span>
              ),
              variant: 'destructive',
              action: () => handleDelete(user.id),
            },
          ]}
        />,
      ];
    });
  }, [users?.profiles, page, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-128">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search by name.."
            className="w-full pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(DEFAULT_PAGE);
            }}
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

      <DataTable
        headers={HEADER_TABLE_USER}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
        errorMessage={
          fetchError instanceof Error ? fetchError.message : 'Unknown error'
        }
        onRetry={() => refetch()}
        emptyMessage="No users found."
        pagination={{
          currentPage: page,
          totalPages: Math.max(DEFAULT_PAGE, totalPages),
          limit: limit,
          onPageChange: handleChangePage,
          onLimitChange: handleChangeLimit,
        }}
      />
    </div>
  );
}
