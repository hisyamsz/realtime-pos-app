'use client';

import { FieldValues, UseFormReturn, Control } from 'react-hook-form';
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

import { ROLE_LIST } from '@/constants/auth-constants';
import { CreateUserForm, UpdateUserForm } from '@/validation/auth-validation';

interface FormUserProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  submitLabel: string;
  type: 'create' | 'update';
  isRoleDisabled?: boolean;
  isSubmitDisabled?: boolean;
}

export function FormUser<T extends CreateUserForm | UpdateUserForm>({
  form,
  onSubmit,
  isPending = false,
  submitLabel = 'Create User',
  type,
  isRoleDisabled = false,
  isSubmitDisabled = false,
}: FormUserProps<T>) {
  const isCreate = type === 'create';
  const control = form.control as unknown as Control<CreateUserForm>;

  return (
    <DialogContent
      className="sm:max-w-[500px]"
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>
          {isCreate ? 'Create New User' : 'Update User'}
        </DialogTitle>
        <DialogDescription>
          {isCreate
            ? 'Fill in the user details below to add a new account.'
            : 'Update the user details below to update the account.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4 py-4">
          <FormInput
            control={control}
            name="name"
            label="Full Name"
            placeholder="Enter full name"
            disabled={isPending}
          />

          {isCreate && (
            <FormInput
              control={control}
              name="email"
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              disabled={isPending}
            />
          )}

          {isCreate && (
            <PasswordInput
              control={control}
              name="password"
              label="Password"
              placeholder="Enter password"
              disabled={isPending}
            />
          )}

          <FormSelect
            control={control}
            name="role"
            label="Role"
            placeholder="Select a role"
            selectItem={ROLE_LIST}
            disabled={isPending || isRoleDisabled}
          />

          <FormImage
            control={control}
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
              disabled={isPending || isSubmitDisabled}
              title={
                isSubmitDisabled
                  ? 'Please modify at least one valid field to submit'
                  : undefined
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
