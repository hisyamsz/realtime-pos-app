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
import { FormCurrencyInput } from '@/components/common/form-currency-input';
import FormSelect from '@/components/common/form-select';
import { FormImage } from '@/components/common/form-image';

import { MENU_CATEGORIES, MENU_STATUS } from '@/constants/menu-constants';
import { CreateMenuForm, UpdateMenuForm } from '@/validation/menu-validation';

interface FormMenuProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmitAction: (e?: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
  submitLabel: string;
  type: 'create' | 'update';
  isSubmitDisabled?: boolean;
}

export function FormMenu<T extends CreateMenuForm | UpdateMenuForm>({
  form,
  onSubmitAction,
  isPending = false,
  submitLabel = 'Create Menu',
  type,
  isSubmitDisabled = false,
}: FormMenuProps<T>) {
  const isCreate = type === 'create';
  const control = form.control as unknown as Control<CreateMenuForm>;

  return (
    <DialogContent
      className="sm:max-w-[500px]"
      onInteractOutside={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      showCloseButton={!isPending}
    >
      <DialogHeader>
        <DialogTitle>
          {isCreate ? 'Create New Menu' : 'Update Menu'}
        </DialogTitle>
        <DialogDescription>
          {isCreate
            ? 'Fill in the menu details below to add a new menu.'
            : 'Update the menu details below to update the menu.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={onSubmitAction} className="space-y-4 py-4">
          <FormInput
            control={control}
            name="name"
            label="Menu Name"
            placeholder="Enter menu name"
            disabled={isPending}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormCurrencyInput
              control={control}
              name="price"
              label="Price (Rp)"
              placeholder="Enter price"
              disabled={isPending}
            />
            <FormInput
              control={control}
              name="discount"
              label="Discount (%)"
              placeholder="Enter discount %"
              type="number"
              min={0}
              max={100}
              disabled={isPending}
            />
          </div>

          <FormInput
            control={control}
            name="description"
            label="Description"
            placeholder="Enter description"
            type="textarea"
            disabled={isPending}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              control={control}
              name="category"
              label="Category"
              placeholder="Select a category"
              selectItem={MENU_CATEGORIES}
              disabled={isPending}
            />

            <FormSelect
              control={control}
              name="is_available"
              label="Status"
              placeholder="Select status"
              selectItem={MENU_STATUS}
              disabled={isPending}
            />
          </div>

          <FormImage
            control={control}
            name="image_url"
            label="Menu Image"
            disabled={isPending}
          />

          <DialogFooter className="mt-6 flex items-center gap-4 pt-4 sm:gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending || isSubmitDisabled}
              title={
                isSubmitDisabled
                  ? 'Please upload menu image to submit'
                  : undefined
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
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
