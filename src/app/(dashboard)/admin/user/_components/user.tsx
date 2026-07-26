'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/common/data-table';
import DialogCreateUser from './dialog-create-user';
import DialogUpdateUser from './dialog-update-user';
import DropdownAction from '@/components/common/dropdown-action';
import { HEADER_TABLE_USER } from '@/constants/user-constants';
import { DEFAULT_PAGE } from '@/constants/data-table-constants';
import useDataTable from '@/hooks/use-data-table';
import { Profile } from '@/types/auth';

export default function UserManagement() {
  const supabase = createClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    data: Profile;
    type: 'update' | 'delete';
  } | null>(null);

  const {
    currentPage: page,
    currentLimit: limit,
    currentSearch,
    handleChangeSearch,
    handleChangePage,
    handleChangeLimit,
  } = useDataTable();

  const handleEdit = (user: Profile) => {
    setSelectedAction({ data: user, type: 'update' });
  };

  const handleDelete = (user: Profile) => {
    setSelectedAction({ data: user, type: 'delete' });
  };

  const {
    data: users,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['users', page, limit, currentSearch],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*', { count: 'exact' });

      if (currentSearch) {
        query = query.ilike('name', `%${currentSearch}%`);
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
    return users && users.count !== null ? Math.ceil(users.count / limit) : 0;
  }, [users, limit]);

  const filteredData = useMemo(() => {
    return (users?.profiles || []).map((user, index) => {
      return [
        (page - 1) * limit + index + 1,
        user.id,
        user.name || 'Unknown Name',
        <Badge
          key={`role-${user.id}`}
          variant={
            user.role === 'admin'
              ? 'default'
              : user.role === 'kitchen'
                ? 'secondary'
                : 'outline'
          }
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
              action: () => handleEdit(user),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  Delete
                </span>
              ),
              variant: 'destructive',
              action: () => handleDelete(user),
            },
          ]}
        />,
      ];
    });
  }, [users?.profiles, page, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-2/5">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search by name.."
            className="w-full pl-8"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="xl"
          className="group w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 sm:w-auto"
          onClick={() => setIsCreateOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          Create User
        </Button>

        <DialogCreateUser
          open={isCreateOpen}
          handleChangeAction={setIsCreateOpen}
          refetch={refetch}
        />

        <DialogUpdateUser
          open={selectedAction?.type === 'update'}
          handleChangeAction={(open) => {
            if (!open) setSelectedAction(null);
          }}
          currentData={selectedAction?.type === 'update' ? selectedAction.data : null}
          refetch={refetch}
        />
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
