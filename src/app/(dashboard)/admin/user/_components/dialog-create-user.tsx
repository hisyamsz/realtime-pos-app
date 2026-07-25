'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { FormUser } from './form-user';

import { createUserSchema, CreateUserForm } from '@/validation/auth-validation';
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
} from '@/constants/auth-constants';
import { createUser } from '../action';

interface DialogCreateUserProps {
  isOpen?: boolean;
  refetch?: () => void;
}

export default function DialogCreateUser({
  isOpen,
  refetch,
}: DialogCreateUserProps) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
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
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch?.();
    }
  }, [createUserState, form, refetch]);

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isPending={isPendingCreateUser}
      title="Create New User"
      description="Fill in the user details below to add a new account."
    />
  );
}
