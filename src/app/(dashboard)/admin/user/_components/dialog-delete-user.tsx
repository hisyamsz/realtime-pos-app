'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import DialogDelete from '@/components/common/dialog-delete';
import { useIsSelf } from '@/hooks/use-is-self';
import { Profile } from '@/types/auth';
import { deleteUser } from '../action';
import { INITIAL_STATE_ACTION } from '@/constants/general-constants';

interface DialogDeleteUserProps {
  refetch?: () => void;
  currentData?: Profile | null;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function DialogDeleteUser({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogDeleteUserProps) {
  const isSelf = useIsSelf(currentData?.id);

  const [deleteUserState, deleteUserAction, isPendingDeleteUser] =
    useActionState(deleteUser, INITIAL_STATE_ACTION);

  const handleConfirm = () => {
    if (!currentData?.id) return;

    if (isSelf) {
      toast.error('Delete User Failed', {
        description: 'Admins cannot delete their own account',
      });
      return;
    }

    const formData = new FormData();
    formData.append('id', currentData.id);

    startTransition(() => {
      deleteUserAction(formData);
    });
  };

  useEffect(() => {
    if (deleteUserState?.status === 'error') {
      toast.error('Delete User Failed', {
        description: deleteUserState.errors?._form?.[0],
      });
    }

    if (deleteUserState?.status === 'success') {
      toast.success(deleteUserState.message || 'User deleted successfully');
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [deleteUserState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      title="User"
      description={
        <span className="text-muted-foreground text-sm leading-normal">
          Are you sure you want to delete user{' '}
          <strong className="text-foreground font-medium">
            &quot;{currentData?.name || 'Unknown Name'}&quot;
          </strong>
          ? This action cannot be undone.
        </span>
      }
      onConfirm={handleConfirm}
      isPending={isPendingDeleteUser}
    />
  );
}
