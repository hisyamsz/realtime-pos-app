'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Utensils } from 'lucide-react';
import { toast } from 'sonner';

import DataTable from '@/components/common/data-table';
import DropdownAction from '@/components/common/dropdown-action';
import { HEADER_TABLE_MENU } from '@/constants/menu-constants';
import { DEFAULT_PAGE } from '@/constants/data-table-constants';
import useDataTable from '@/hooks/use-data-table';
import { formatRupiah } from '@/lib/utils';
import { Menu } from '@/validation/menu-validation';

export default function MenuManagement() {
  const supabase = createClient();
  const [selectedAction, setSelectedAction] = useState<{
    data?: Menu | null;
    type: 'create' | 'update' | 'delete';
  } | null>(null);

  const {
    currentPage: page,
    currentLimit: limit,
    currentSearch,
    handleChangeSearch,
    handleChangePage,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: menus,
    isLoading,
    isError,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['menus', page, limit, currentSearch],
    queryFn: async () => {
      let query = supabase.from('menus').select('*', { count: 'exact' });

      const sanitizedSearch = currentSearch.replace(/[,()]/g, '').trim();
      if (sanitizedSearch) {
        query = query.or(
          `name.ilike.%${sanitizedSearch}%,category.ilike.%${sanitizedSearch}%`,
        );
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        toast.error(`Failed to load menus`, {
          description: error.message,
        });
        throw error;
      }
      return { items: (data as Menu[]) || [], count };
    },
  });

  const totalPages = useMemo(() => {
    return menus && menus.count !== null ? Math.ceil(menus.count / limit) : 0;
  }, [menus, limit]);

  const filteredData = useMemo(() => {
    return (menus?.items || []).map((menu: Menu, index: number) => {
      return [
        (page - 1) * limit + index + 1,
        typeof menu.image_url === 'string' && menu.image_url ? (
          <div
            key={`img-${menu.id}`}
            className="bg-muted relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border"
          >
            <Image
              src={menu.image_url}
              alt={menu.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            key={`img-fallback-${menu.id}`}
            className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg border"
          >
            <Utensils className="text-muted-foreground h-5 w-5" />
          </div>
        ),
        <div key={`name-${menu.id}`} className="flex flex-col">
          <span className="text-foreground font-medium">{menu.name}</span>
          {menu.description && (
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {menu.description}
            </span>
          )}
        </div>,
        <Badge
          key={`category-${menu.id}`}
          variant="outline"
          className="capitalize"
        >
          {menu.category}
        </Badge>,
        <div
          key={`price-${menu.id}`}
          className="space-y-0.5 text-xs md:text-sm"
        >
          <p className="text-muted-foreground">
            Base:{' '}
            <span className="text-foreground font-medium">
              {formatRupiah(menu.price)}
            </span>
          </p>
          <p className="text-muted-foreground">
            Discount:{' '}
            <span className="text-foreground font-medium">
              {menu.discount ? `${menu.discount}%` : '-'}
            </span>
          </p>
          <p className="text-muted-foreground">
            After Discount:{' '}
            <span className="text-foreground font-medium">
              {menu.discount
                ? formatRupiah(menu.price - (menu.price * menu.discount) / 100)
                : '-'}
            </span>
          </p>
        </div>,
        <Badge
          key={`status-${menu.id}`}
          variant={menu.is_available ? 'success' : 'destructive'}
        >
          {menu.is_available ? 'Available' : 'Unavailable'}
        </Badge>,
        <DropdownAction
          key={`action-${menu.id}`}
          menu={[
            {
              label: (
                <span className="flex items-center gap-2 text-blue-600">
                  <Edit className="h-4 w-4 text-blue-600" />
                  Edit
                </span>
              ),
              action: () => {
                setSelectedAction({ data: menu, type: 'update' });
              },
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  Delete
                </span>
              ),
              variant: 'destructive',
              action: () => {
                setSelectedAction({ data: menu, type: 'delete' });
              },
            },
          ]}
        />,
      ];
    });
  }, [menus?.items, page, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-1/2 lg:w-2/5">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search by name or category.."
            className="w-full pl-8"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="xl"
          className="group w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 sm:w-auto"
          onClick={() => setSelectedAction({ type: 'create' })}
        >
          <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          Create Menu
        </Button>
      </div>

      <DataTable
        headers={HEADER_TABLE_MENU}
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
        errorMessage={
          fetchError instanceof Error ? fetchError.message : 'Unknown error'
        }
        onRetry={() => refetch()}
        emptyMessage="No menus found."
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
