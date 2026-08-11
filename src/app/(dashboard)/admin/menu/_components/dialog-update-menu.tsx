'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog } from '@/components/ui/dialog';
import { FormMenu } from './form-menu';

import { updateMenuSchema, UpdateMenuForm, Menu } from '@/validation/menu-validation';
import { INITIAL_STATE_UPDATE_MENU } from '@/constants/menu-constants';
import { updateMenu } from '../action';

interface DialogUpdateMenuProps {
  refetch?: () => void;
  currentData?: Menu | null;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function DialogUpdateMenu({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: DialogUpdateMenuProps) {
  const form = useForm<UpdateMenuForm>({
    resolver: zodResolver(updateMenuSchema),
  });

  const [updateMenuState, updateMenuAction, isPendingUpdateMenu] =
    useActionState(updateMenu, INITIAL_STATE_UPDATE_MENU);

  const handledStateRef = useRef(updateMenuState);
  const { isDirty } = form.formState;

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append('id', String(currentData?.id ?? ''));

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value === null ? '' : (value as any));
      }
    });

    if (
      currentData?.image_url &&
      typeof currentData.image_url === 'string' &&
      currentData.image_url !== data.image_url
    ) {
      formData.append('old_image_url', currentData.image_url);
    }

    startTransition(() => {
      updateMenuAction(formData);
    });
  });

  useEffect(() => {
    if (!updateMenuState || handledStateRef.current === updateMenuState) {
      return;
    }
    handledStateRef.current = updateMenuState;

    if (updateMenuState.status === 'error') {
      toast.error('Update Menu Failed', {
        description: updateMenuState.errors?._form?.[0] || 'Unknown error occurred',
      });
      if (updateMenuState.errors) {
        Object.entries(updateMenuState.errors).forEach(([field, errors]) => {
          if (field !== '_form' && errors?.[0]) {
            form.setError(field as any, { message: errors[0] });
          }
        });
      }
    }

    if (updateMenuState.status === 'success') {
      toast.success(updateMenuState.message || 'Menu updated successfully');
      form.reset();
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [updateMenuState, form, handleChangeAction, refetch]);

  useEffect(() => {
    if (currentData && open) {
      form.reset({
        id: currentData.id,
        name: currentData.name as string,
        description: currentData.description as string,
        category: currentData.category as string,
        price: currentData.price as number,
        discount: (currentData.discount || 0) as number,
        is_available: currentData.is_available as boolean,
        image_url: currentData.image_url as string,
      });
    } else if (!open) {
      form.reset();
    }
  }, [currentData, open, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isPending={isPendingUpdateMenu}
        submitLabel="Update menu"
        type="update"
        isSubmitDisabled={!isDirty}
      />
    </Dialog>
  );
}
