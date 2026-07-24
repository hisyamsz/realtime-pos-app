'use client';

import { useEffect, useRef, useState, useId, DragEvent } from 'react';
import { Control, FieldPath, FieldValues, useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UploadCloud, Trash2, Loader2, AlertCircle, User } from 'lucide-react';
import { cn, validateImageFile, getImageData } from '@/lib/utils';
import { MAX_FILE_SIZE_MB } from '@/constants/file-constants';

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

/**
 * Truncates long filenames while preserving the extension (e.g. "very_long_file_n...3.png")
 */
function formatFileName(name: string, maxLen = 22): string {
  if (!name || name.length <= maxLen) return name;
  const lastDot = name.lastIndexOf('.');
  if (lastDot > 0 && lastDot < name.length - 1) {
    const ext = name.slice(lastDot);
    const base = name.slice(0, lastDot);
    const availableBaseLen = maxLen - ext.length - 3;
    if (availableBaseLen > 4) {
      const start = Math.ceil(availableBaseLen / 2);
      const end = Math.floor(availableBaseLen / 2);
      return `${base.slice(0, start)}...${base.slice(base.length - end)}${ext}`;
    }
  }
  return `${name.slice(0, maxLen - 3)}...`;
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const [isInvalidDrag, setIsInvalidDrag] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const dropzoneId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const value = useWatch({
    control,
    name,
  });

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      setFileName(null);
      setDragError(null);
      return;
    }

    if ((value as any) instanceof File) {
      const file = value as any as File;
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFileName(file.name);
      setDragError(null);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof value === 'string') {
      setPreviewUrl(value);
      setFileName(value.split('/').pop() || null);
      setDragError(null);
    }
  }, [value]);

  // Track global window drag events to detect when a file is dragged anywhere on screen
  useEffect(() => {
    let dragCounter = 0;

    const handleWindowDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (disabled || previewUrl) return;

      const types = e.dataTransfer?.types;
      if (types && Array.from(types).includes('Files')) {
        dragCounter++;
        setIsWindowDragging(true);
      }
    };

    const handleWindowDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (disabled || previewUrl) return;
    };

    const handleWindowDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (disabled || previewUrl) return;

      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        setIsWindowDragging(false);
      }
    };

    const handleWindowDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsWindowDragging(false);
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, [disabled, previewUrl]);

  return (
    <FormField
      control={control}
      name={name}
      render={({
        field: { onChange, value: _, ...fieldProps },
        fieldState,
      }) => {
        const handleFileChange = (file: File | null) => {
          if (file) {
            const validationError = validateImageFile(file, maxSizeMB);
            if (validationError) {
              setDragError(validationError);
              onChange(null);
              return;
            }
            setDragError(null);
            onChange(file);
          } else {
            setDragError(null);
            onChange(null);
          }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            const { file } = getImageData(e);
            handleFileChange(file);
          }
        };

        const handleRemove = (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragError(null);
          onChange(null);
          setPreviewUrl(null);
          setFileName(null);
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        };

        const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled || previewUrl) return;

          const items = Array.from(e.dataTransfer.items || []);
          const hasNonImage = items.some(
            (item) =>
              item.kind === 'file' &&
              item.type &&
              !item.type.startsWith('image/'),
          );

          setIsDragging(true);
          setIsInvalidDrag(hasNonImage);
        };

        const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          setIsInvalidDrag(false);
        };

        const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          setIsWindowDragging(false);
          setIsInvalidDrag(false);
          if (disabled || previewUrl) return;

          const files = e.dataTransfer?.files;
          if (files && files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
              setDragError(
                'Invalid file format. Only image files (JPG, PNG, WEBP, GIF) are allowed.',
              );
              return;
            }
            handleFileChange(file);
          }
        };

        const isInvalid = !!fieldState.error || !!dragError;
        const errorMessage = fieldState.error?.message || dragError;
        const isAnyDragging = isDragging || isWindowDragging;

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
              onDrop={handleDrop}
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
              {/* Preview Mode - Centered Big Image in Sidebar Style */}
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
                    onClick={handleRemove}
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
                onChange={handleInputChange}
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
