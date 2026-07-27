'use client';

import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DialogDeleteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  onConfirm?: () => void;
  isPending?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export default function DialogDelete({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending = false,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  className,
}: DialogDeleteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[500px] ${className}`}
        showCloseButton={!isPending}
      >
        <DialogHeader>
          <DialogTitle>Delete {title}</DialogTitle>
          <DialogDescription>
            {description ||
              `Are you sure you want to delete this ${title.toLowerCase()}? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 flex items-center gap-4 sm:gap-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={isPending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
