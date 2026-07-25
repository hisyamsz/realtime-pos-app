'use client';

import { Control, FieldPath, FieldValues, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud, Trash2, Loader2, AlertCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_FILE_SIZE_MB } from '@/constants/file-constants';
import { useFormImage, formatFileName } from '@/hooks/use-form-image';

export interface FormImageProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  disabled?: boolean;
  isUploading?: boolean;
  isDeleting?: boolean;
  accept?: string;
  className?: string;
  avatarClassName?: string;
  maxSizeMB?: number;
}

export function FormImage<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  disabled,
  isUploading = false,
  isDeleting = false,
  accept = 'image/*',
  className,
  avatarClassName,
  maxSizeMB = MAX_FILE_SIZE_MB,
}: FormImageProps<TFieldValues, TName>) {
  const value = useWatch({
    control,
    name,
  });

  const {
    previewUrl,
    fileName,
    isDragging,
    isWindowDragging,
    isAnyDragging,
    isInvalidDrag,
    dragError,
    dropzoneId,
    inputRef,
    handleInputChange,
    handleRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFormImage({
    value,
    disabled,
    maxSizeMB,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({
        field: { onChange, value: _, ...fieldProps },
        fieldState,
      }) => {
        const isInvalid = !!fieldState.error || !!dragError;
        const errorMessage = fieldState.error?.message || dragError;

        return (
          <FormItem
            className={cn('w-full max-w-full overflow-hidden', className)}
          >
            {label && (
              <FormLabel className="text-sm font-medium">{label}</FormLabel>
            )}

            <label
              htmlFor={`dropzone-file-${dropzoneId}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, onChange)}
              className={cn(
                'relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out',
                isInvalid || isInvalidDrag
                  ? 'border-destructive bg-destructive/5 ring-destructive/10 border-dashed ring-4'
                  : isDragging
                    ? 'border-primary bg-primary/5 ring-primary/10 border-dashed ring-4'
                    : isWindowDragging
                      ? 'border-primary/70 bg-primary/5 ring-primary/20 border-dashed ring-2'
                      : 'border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40 border-dashed',
                (disabled || isUploading || isDeleting) &&
                  'pointer-events-none opacity-60',
              )}
            >
              {previewUrl && (
                <div className="relative flex w-full max-w-full min-w-0 flex-col items-center justify-center overflow-hidden p-4 text-center">
                  <Avatar
                    className={cn(
                      'border-border h-28 w-28 shrink-0 rounded-lg border shadow-xs',
                      avatarClassName,
                    )}
                  >
                    <AvatarImage
                      src={previewUrl}
                      alt="Preview"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-ink text-canvas flex items-center justify-center rounded-lg font-semibold">
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-3 grid w-full min-w-0 overflow-hidden leading-tight">
                    <span
                      className="text-foreground mx-auto block max-w-[200px] truncate text-center text-xs font-semibold"
                      title={fileName || undefined}
                    >
                      {fileName ? formatFileName(fileName) : 'Image uploaded'}
                    </span>
                    <span className="text-mute mt-0.5 block truncate text-center text-xs capitalize">
                      Preview ready
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, onChange)}
                    disabled={isDeleting || disabled}
                    className="border-border bg-background/90 text-destructive hover:bg-destructive/10 absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border shadow-xs transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    title="Remove image"
                  >
                    {isDeleting ? (
                      <Loader2 className="text-destructive h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}

              {/* Uploading Spinner */}
              {isUploading && !previewUrl && (
                <div className="flex flex-col items-center justify-center p-5">
                  <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
              )}

              {/* Empty Dropzone / Dragging Mode */}
              {!previewUrl && !isUploading && (
                <div className="flex flex-col items-center justify-center p-5 text-center">
                  {isAnyDragging ? (
                    isInvalidDrag ? (
                      <>
                        <AlertCircle className="text-destructive mb-2 h-10 w-10 animate-bounce" />
                        <p className="text-destructive text-sm font-semibold">
                          File format not supported!
                        </p>
                        <p className="text-destructive/80 mt-1 text-xs">
                          Only image files (JPG, PNG, WEBP, GIF) are allowed
                        </p>
                      </>
                    ) : isDragging ? (
                      <>
                        <UploadCloud className="text-primary mb-2 h-10 w-10 animate-bounce" />
                        <p className="text-primary text-sm font-semibold">
                          Drop file here to upload
                        </p>
                        <p className="text-primary/80 mt-1 text-xs">
                          Release to process image
                        </p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="text-primary mb-2 h-10 w-10 animate-pulse" />
                        <p className="text-primary text-sm font-semibold">
                          Drop file inside this box
                        </p>
                        <p className="text-primary/80 mt-1 text-xs">
                          Drag your image into this dropzone area
                        </p>
                      </>
                    )
                  ) : (
                    <>
                      <UploadCloud
                        className={cn('text-muted-foreground mb-2 h-10 w-10', {
                          'text-destructive': isInvalid,
                        })}
                      />
                      <p
                        className={cn(
                          'text-muted-foreground text-sm font-medium',
                          {
                            'text-destructive': isInvalid,
                          },
                        )}
                      >
                        Drag and drop or{' '}
                        <span className="text-primary hover:underline">
                          click to upload
                        </span>{' '}
                        file
                      </p>
                      <p className="text-muted-foreground/70 mt-1 text-xs">
                        PNG, JPG, WEBP, or GIF (max {maxSizeMB}MB)
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Hidden file input controlled by label htmlFor */}
              <input
                {...fieldProps}
                ref={inputRef}
                type="file"
                name={name}
                accept={accept}
                id={`dropzone-file-${dropzoneId}`}
                className="hidden"
                disabled={disabled || !!previewUrl}
                onChange={(e) => handleInputChange(e, onChange)}
                onClick={(e) => {
                  e.currentTarget.value = '';
                }}
              />
            </label>

            {errorMessage && (
              <p className="text-destructive p-1 text-xs font-medium">
                {errorMessage}
              </p>
            )}
          </FormItem>
        );
      }}
    />
  );
}
