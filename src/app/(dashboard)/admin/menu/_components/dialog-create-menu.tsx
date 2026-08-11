'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Dialog } from '@/components/ui/dialog';
import { FormMenu } from './form-menu';

import { createMenuSchema, CreateMenuForm } from '@/validation/menu-validation';
import {
  INITIAL_CREATE_MENU_FORM,
  INITIAL_STATE_CREATE_MENU,
} from '@/constants/menu-constants';
import { createMenu } from '../action';

interface DialogCreateMenuProps {
  refetch?: () => void;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function DialogCreateMenu({
  refetch,
  open,
  handleChangeAction,
}: DialogCreateMenuProps) {
  const form = useForm<CreateMenuForm>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: INITIAL_CREATE_MENU_FORM,
  });

  const [createMenuState, createMenuAction, isPendingCreateMenu] =
    useActionState(createMenu, INITIAL_STATE_CREATE_MENU);

  const handledStateRef = useRef(createMenuState);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value === null ? '' : (value as any));
      }
    });

    startTransition(() => {
      createMenuAction(formData);
    });
  });

  useEffect(() => {
    if (!createMenuState || handledStateRef.current === createMenuState) {
      return;
    }
    handledStateRef.current = createMenuState;

    if (createMenuState.status === 'error') {
      toast.error('Create Menu Failed', {
        description: createMenuState.errors?._form?.[0],
      });
      if (createMenuState.errors) {
        Object.entries(createMenuState.errors).forEach(([field, errors]) => {
          if (field !== '_form' && errors?.[0]) {
            form.setError(field as any, { message: errors[0] });
          }
        });
      }
    }

    if (createMenuState.status === 'success') {
      toast.success(createMenuState.message || 'Menu created successfully');
      form.reset(INITIAL_CREATE_MENU_FORM);
      handleChangeAction?.(false);
      refetch?.();
    }
  }, [createMenuState, form, handleChangeAction, refetch]);

  useEffect(() => {
    if (!open) {
      form.reset(INITIAL_CREATE_MENU_FORM);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isPending={isPendingCreateMenu}
        submitLabel="Create Menu"
        type="create"
      />
    </Dialog>
  );
}
