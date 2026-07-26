'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog } from '@/components/ui/dialog';
import { FormUser } from './form-user';

import { createUserSchema, CreateUserForm } from '@/validation/auth-validation';
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
} from '@/constants/auth-constants';
import { createUser } from '../action';
import { Preview } from '@/types/general';

export default function DialogCreateUser({
  refetch,
  open,
  handleChangeAction,
}: {
  refetch?: () => void;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(
          key,
          key === 'avatar_url' ? preview?.file ?? '' : (value as any),
        );
      }
    });

    startTransition(() => {
      createUserAction(formData);
    });
  });

  useEffect(() => {
    if (createUserState?.status === 'error') {
      toast.error('Create User Failed', {
        description: createUserState.errors?._form?.[0],
      });
    }

    if (createUserState?.status === 'success') {
      toast.success(createUserState.message || 'Create User Success');
      form.reset();
      setPreview(undefined);
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [createUserState]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setPreview(undefined);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isPending={isPendingCreateUser}
        submitLabel="Create User"
        type="create"
      />
    </Dialog>
  );
}
