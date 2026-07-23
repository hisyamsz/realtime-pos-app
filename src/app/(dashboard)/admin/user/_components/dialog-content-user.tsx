'use client';

import {
  useActionState,
  useState,
  useEffect,
  useRef,
  startTransition,
} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { createUserSchema, CreateUserForm } from '@/validation/auth-validation';
import {
  INITIAL_CREATE_USER_FORM,
  INITIAL_STATE_CREATE_USER,
} from '@/constants/auth-constants';
import { Input } from '@/components/ui/input';
import { createUser } from '../action';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

interface DialogContentUserProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (message?: string) => void;
  onError?: (message?: string) => void;
}

export default function DialogContentUser({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: DialogContentUserProps) {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createUser,
    INITIAL_STATE_CREATE_USER,
  );

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM as any,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);
  const lastProcessedStateRef = useRef(state);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setAvatarPreview(null);
      setFormError(null);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (state === lastProcessedStateRef.current) return;
    lastProcessedStateRef.current = state;

    if (state?.status === 'success') {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      startTransition(() => {
        formAction(null);
      });
      onSuccess?.(state.message);
      form.reset();
    }

    if (state?.status === 'error') {
      if (state.errors?._form?.[0]) {
        onError?.(state.errors._form[0]);
      }
      startTransition(() => {
        formAction(null);
      });
    }
  }, [state, queryClient, onSuccess, onError, formAction, form]);

  useEffect(() => {
    if (state?.errors) {
      if (state.errors.name?.length) {
        form.setError('name', {
          type: 'server',
          message: state.errors.name[0],
        });
      }
      if (state.errors.email?.length) {
        form.setError('email', {
          type: 'server',
          message: state.errors.email[0],
        });
      }
      if (state.errors.password?.length) {
        form.setError('password', {
          type: 'server',
          message: state.errors.password[0],
        });
      }
      if (state.errors.role?.length) {
        form.setError('role', {
          type: 'server',
          message: state.errors.role[0],
        });
      }
      if (state.errors._form?.length) {
        setFormError(state.errors._form[0]);
      }
    }
  }, [state, form]);

  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      if (formError) setFormError(null);
      if (name) form.clearErrors(name as any);
    });
    return () => subscription.unsubscribe();
  }, [form, formError]);

  const onSubmit = (data: CreateUserForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('role', data.role);

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      onChange(null);
      setAvatarPreview(null);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create New User</DialogTitle>
        <DialogDescription>
          Fill in the user details below to add a new account.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-4"
        >
          <FormInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Enter full name"
            disabled={isPending}
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            disabled={isPending}
          />

          <PasswordInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter password"
            disabled={isPending}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1 space-y-1">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full [&:not([data-placeholder])]:capitalize">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {createUserSchema.shape.role.options.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="capitalize"
                      >
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
                      disabled={isPending}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError && (
            <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm font-medium">
              {formError}
            </div>
          )}

          <DialogFooter className="mt-6 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
