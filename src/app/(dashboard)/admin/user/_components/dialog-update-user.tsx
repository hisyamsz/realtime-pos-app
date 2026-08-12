'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog } from '@/components/ui/dialog';
import { FormUser } from './form-user';

import { updateUserSchema, UpdateUserForm } from '@/validation/auth-validation';
import { INITIAL_STATE_UPDATE_USER } from '@/constants/auth-constants';
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

  const handledStateRef = useRef(updateUserState);
  const { isDirty } = form.formState;

  const onSubmit = form.handleSubmit((data) => {
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
    if (!updateUserState || handledStateRef.current === updateUserState) {
      return;
    }
    handledStateRef.current = updateUserState;

    if (updateUserState.status === 'error') {
      toast.error('Update User Failed', {
        description:
          updateUserState.errors?._form?.[0] || 'Unknown error occurred',
      });
      if (updateUserState.errors) {
        Object.entries(updateUserState.errors).forEach(([field, errors]) => {
          if (field !== '_form' && errors?.[0]) {
            form.setError(field as any, { message: errors[0] });
          }
        });
      }
    }

    if (updateUserState.status === 'success') {
      toast.success(updateUserState.message || 'User updated successfully');
      form.reset();
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [updateUserState, form, handleChangeAction, refetch]);

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
        onSubmitAction={onSubmit}
        isPending={isPendingUpdateUser}
        submitLabel="Update user"
        type="update"
        isRoleDisabled={isSelf}
        isSubmitDisabled={!isDirty}
      />
    </Dialog>
  );
}
