'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormInput } from '@/components/common/form-input';
import { PasswordInput } from '@/components/common/password-input';
import FormSelect from '@/components/common/form-select';

import { createUserSchema, CreateUserForm } from '@/validation/auth-validation';
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
  ROLE_LIST,
} from '@/constants/auth-constants';
import { createUser } from '../action';

interface DialogContentUserProps {
  isOpen?: boolean;
  refetch?: () => void;
}

export default function DialogContentUser({
  isOpen,
  refetch,
}: DialogContentUserProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const [createUserState, createUserAction, isPendingCreateUser] =
    useActionState(createUser, INITIAL_STATE_CREATE_USER);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setAvatarPreview(null);
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
      setAvatarPreview(null);
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch?.();
    }
  }, [createUserState, form, refetch]);

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      onChange(null);
      setAvatarPreview(null);
    }
  };

  return (
    <DialogContent
      className="sm:max-w-[500px]"
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>Create New User</DialogTitle>
        <DialogDescription>
          Fill in the user details below to add a new account.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <FormInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Enter full name"
            disabled={isPendingCreateUser}
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            disabled={isPendingCreateUser}
          />

          <PasswordInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter password"
            disabled={isPendingCreateUser}
          />

          <FormSelect
            form={form}
            name="role"
            label="Role"
            placeholder="Select a role"
            selectItem={ROLE_LIST}
            disabled={isPendingCreateUser}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 space-y-1">
                <FormLabel>Avatar (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  {avatarPreview && (
                    <div className="border-border h-12 w-12 overflow-hidden rounded-full border">
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAvatarChange(e, field.onChange)}
                      className="cursor-pointer"
                      disabled={isPendingCreateUser}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-6 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={isPendingCreateUser}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              className="w-full sm:w-auto"
              disabled={isPendingCreateUser}
            >
              {isPendingCreateUser ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
