'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog } from '@/components/ui/dialog';
import { FormUser } from './form-user';

import { updateUserSchema, UpdateUserForm } from '@/validation/auth-validation';
import { INITIAL_STATE_UPDATE_USER } from '@/constants/auth-constants';
import { updateUser } from '../action';
import { Profile } from '@/types/auth';
import { Preview } from '@/types/general';
import { useAuthStore } from '@/providers/auth-store-provider';

export default function DialogUpdateUser({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: {
  refetch?: () => void;
  currentData?: Profile | null;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const currentUserId = useAuthStore((state) => state.profile?.id || state.user?.id);
  const isSelf = Boolean(currentUserId && currentData?.id === currentUserId);

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  const [updateUserState, updateUserAction, isPendingUpdateUser] =
    useActionState(updateUser, INITIAL_STATE_UPDATE_USER);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    if (isSelf && data.role !== 'admin') {
      toast.error('Update User Failed', {
        description: 'Admins cannot change their own role',
      });
      form.setValue('role', currentData?.role || 'admin');
      return;
    }

    const formData = new FormData();
    if (currentData?.avatar_url !== data.avatar_url) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(
            key,
            key === 'avatar_url' ? preview?.file ?? '' : (value as any),
          );
        }
      });
      formData.append('old_avatar_url', currentData?.avatar_url ?? '');
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });
    }
    formData.append('id', currentData?.id ?? '');

    startTransition(() => {
      updateUserAction(formData);
    });
  });

  useEffect(() => {
    if (updateUserState?.status === 'error') {
      toast.error('Update User Failed', {
        description: updateUserState.errors?._form?.[0],
      });
      if (currentData) {
        form.setValue('role', currentData.role as string);
      }
    }

    if (updateUserState?.status === 'success') {
      toast.success(updateUserState.message || 'User updated successfully');
      form.reset();
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [updateUserState]);

  useEffect(() => {
    if (currentData && open) {
      form.setValue('id', currentData.id as string);
      form.setValue('name', currentData.name as string);
      form.setValue('role', currentData.role as string);
      form.setValue('avatar_url', currentData.avatar_url as string);
      if (currentData.avatar_url) {
        setPreview({
          file: new File([], currentData.avatar_url as string),
          displayUrl: currentData.avatar_url as string,
        });
      } else {
        setPreview(undefined);
      }
    } else if (!open) {
      form.reset();
      setPreview(undefined);
    }
  }, [currentData, open, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isPending={isPendingUpdateUser}
        submitLabel="Update User"
        type="update"
        isRoleDisabled={isSelf}
      />
    </Dialog>
  );
}
