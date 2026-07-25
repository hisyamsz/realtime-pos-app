'use client';

import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { FormInput } from '@/components/common/form-input';
import { PasswordInput } from '@/components/common/password-input';
import FormSelect from '@/components/common/form-select';
import { FormImage } from '@/components/common/form-image';

import { CreateUserForm } from '@/validation/auth-validation';
import { ROLE_LIST } from '@/constants/auth-constants';

interface FormUserProps {
  form: UseFormReturn<CreateUserForm>;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
  pendingLabel?: string;
}

export function FormUser({
  form,
  onSubmit,
  isPending = false,
  title = 'Create New User',
  description = 'Fill in the user details below to add a new account.',
  submitLabel = 'Create User',
  pendingLabel = 'Creating...',
}: FormUserProps) {
  return (
    <DialogContent
      className="sm:max-w-[500px]"
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
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

          <FormSelect
            form={form}
            name="role"
            label="Role"
            placeholder="Select a role"
            selectItem={ROLE_LIST}
            disabled={isPending}
          />

          <FormImage
            control={form.control}
            name="avatar_url"
            label="Avatar (Optional)"
            disabled={isPending}
          />

          <DialogFooter className="mt-6 flex items-center gap-4 pt-4 sm:gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="lg"
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
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {pendingLabel}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
