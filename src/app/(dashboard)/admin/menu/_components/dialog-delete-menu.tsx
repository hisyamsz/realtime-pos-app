'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import DialogDelete from '@/components/common/dialog-delete';
import { Menu } from '@/validation/menu-validation';
import { deleteMenu } from '../action';
import { INITIAL_STATE_ACTION } from '@/constants/general-constants';

interface DialogDeleteMenuProps {
  refetch?: () => void;
  currentData?: Menu | null;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function DialogDeleteMenu({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteMenuProps) {
  const [deleteMenuState, deleteMenuAction, isPendingDeleteMenu] =
    useActionState(deleteMenu, INITIAL_STATE_ACTION);

  const handleConfirm = () => {
    if (!currentData?.id) return;

    const formData = new FormData();
    formData.append('id', String(currentData.id));

    startTransition(() => {
      deleteMenuAction(formData);
    });
  };

  useEffect(() => {
    if (deleteMenuState?.status === 'error') {
      toast.error('Delete Menu Failed', {
        description: deleteMenuState.errors?._form?.[0],
      });
    }

    if (deleteMenuState?.status === 'success') {
      toast.success(deleteMenuState.message || 'Menu deleted successfully');
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [deleteMenuState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      title="Menu"
      description={
        <>
          Are you sure you want to delete menu{' '}
          <strong className="text-foreground font-medium">
            &quot;{currentData?.name || 'Unknown Menu'}&quot;
          </strong>
          ? This action cannot be undone.
        </>
      }
      onConfirm={handleConfirm}
      isPending={isPendingDeleteMenu}
    />
  );
}
