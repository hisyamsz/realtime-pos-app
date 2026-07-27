'use client';

import { startTransition, useActionState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog } from '@/components/ui/dialog';
import { FormUser } from './form-user';

import { updateUserSchema, UpdateUserForm } from '@/validation/auth-validation';
import {
  INITIAL_STATE_UPDATE_USER,
  HAS_LETTER_OR_NUMBER_REGEX,
} from '@/constants/auth-constants';
import { updateUser } from '../action';
import { Profile } from '@/types/auth';
import { useIsSelf } from '@/hooks/use-is-self';

interface DialogUpdateUserProps {
  refetch?: () => void;
  currentData?: Profile | null;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function DialogUpdateUser({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogUpdateUserProps) {
  const isSelf = useIsSelf(currentData?.id);

  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  const [updateUserState, updateUserAction, isPendingUpdateUser] =
    useActionState(updateUser, INITIAL_STATE_UPDATE_USER);

  const watchedName = form.watch('name');
  const watchedRole = form.watch('role');
  const watchedAvatarUrl = form.watch('avatar_url');

  const isChanged = useMemo(() => {
    if (!currentData || !open) return false;

    const trimmedWatchedName = (watchedName ?? '').trim();
    const isNameValid =
      trimmedWatchedName.length > 0 &&
      HAS_LETTER_OR_NUMBER_REGEX.test(trimmedWatchedName);

    if (!isNameValid) return false;

    const isNameChanged =
      trimmedWatchedName !== (currentData.name ?? '').trim();
    const isRoleChanged = watchedRole !== currentData.role;

    let isAvatarChanged = false;
    if (watchedAvatarUrl instanceof File) {
      isAvatarChanged = true;
    } else {
      const currentAvatar = currentData.avatar_url || null;
      const formAvatar = watchedAvatarUrl || null;
      isAvatarChanged = formAvatar !== currentAvatar;
    }

    return isNameChanged || isRoleChanged || isAvatarChanged;
  }, [currentData, open, watchedName, watchedRole, watchedAvatarUrl]);

  const onSubmit = form.handleSubmit((data) => {
    if (!isChanged) {
      toast.info('No changes detected', {
        description: 'Please modify at least one field before updating.',
      });
      return;
    }

    if (isSelf && data.role !== 'admin') {
      toast.error('Update User Failed', {
        description: 'Admins cannot change their own role',
      });
      form.setValue('role', currentData?.role || 'admin');
      return;
    }

    const formData = new FormData();
    formData.append('id', currentData?.id ?? '');

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value === null ? '' : (value as any));
      }
    });

    if (currentData?.avatar_url && currentData.avatar_url !== data.avatar_url) {
      formData.append('old_avatar_url', currentData.avatar_url);
    }

    startTransition(() => {
      updateUserAction(formData);
    });
  });

  useEffect(() => {
    if (updateUserState?.status === 'error') {
      toast.error('Update User Failed', {
        description: updateUserState.errors?._form?.[0],
      });
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
      form.reset({
        id: currentData.id as string,
        name: currentData.name as string,
        role: currentData.role as string,
        avatar_url: currentData.avatar_url as string,
      });
    } else if (!open) {
      form.reset();
    }
  }, [currentData, open, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isPending={isPendingUpdateUser}
        submitLabel="Update user"
        type="update"
        isRoleDisabled={isSelf}
        isSubmitDisabled={!isChanged}
      />
    </Dialog>
  );
}
