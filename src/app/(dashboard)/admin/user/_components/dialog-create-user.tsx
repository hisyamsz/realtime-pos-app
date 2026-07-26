'use client';

import { startTransition, useActionState, useEffect } from 'react';
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

interface DialogCreateUserProps {
  refetch?: () => void;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function DialogCreateUser({
  refetch,
  open,
  handleChangeAction,
}: DialogCreateUserProps) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value === null ? '' : (value as any));
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
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [createUserState]);

  useEffect(() => {
    if (!open) {
      form.reset();
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
