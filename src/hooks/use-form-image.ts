'use client';

import { useEffect, useRef, useState, useId } from 'react';
import { validateImageFile, getImageData } from '@/lib/utils';
import { MAX_FILE_SIZE_MB } from '@/constants/file-constants';
import { useFileDrag } from '@/hooks/use-file-drag';

export interface UseFormImageProps {
  value: any;
  disabled?: boolean;
  maxSizeMB?: number;
}

export function formatFileName(name: string, maxLen = 22): string {
  if (!name) return name;
  let decodedName = name;
  try {
    decodedName = decodeURIComponent(name);
  } catch {
    decodedName = name;
  }
  if (decodedName.length <= maxLen) return decodedName;
  const lastDot = decodedName.lastIndexOf('.');
  if (lastDot > 0 && lastDot < decodedName.length - 1) {
    const ext = decodedName.slice(lastDot);
    const base = decodedName.slice(0, lastDot);
    const availableBaseLen = maxLen - ext.length - 3;
    if (availableBaseLen > 4) {
      const start = Math.ceil(availableBaseLen / 2);
      const end = Math.floor(availableBaseLen / 2);
      return `${base.slice(0, start)}...${base.slice(base.length - end)}${ext}`;
    }
  }
  return `${decodedName.slice(0, maxLen - 3)}...`;
}

export function useFormImage({
  value,
  disabled,
  maxSizeMB = MAX_FILE_SIZE_MB,
}: UseFormImageProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragError, setDragError] = useState<string | null>(null);
  const dropzoneId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef<((val: any) => void) | null>(null);

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
      const rawName = value.split('/').pop() || null;
      if (rawName) {
        try {
          setFileName(decodeURIComponent(rawName));
        } catch {
          setFileName(rawName);
        }
      } else {
        setFileName(null);
      }
      setDragError(null);
    }
  }, [value]);

  const handleFileChange = (
    file: File | null,
    onChange?: (val: any) => void,
  ) => {
    const targetOnChange = onChange || onChangeRef.current;
    if (file) {
      const validationError = validateImageFile(file, maxSizeMB);
      if (validationError) {
        setDragError(validationError);
        targetOnChange?.(null);
        return;
      }
      setDragError(null);
      targetOnChange?.(file);
    } else {
      setDragError(null);
      targetOnChange?.(null);
    }
  };

  const {
    isDragging,
    isWindowDragging,
    isAnyDragging,
    isInvalidDrag,
    handleDragOver,
    handleDragLeave,
    handleDrop: onDragDrop,
  } = useFileDrag({
    disabled,
    hasPreview: !!previewUrl,
    onFileDrop: (file) => handleFileChange(file),
    onInvalidDrop: (message) => setDragError(message),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (val: any) => void,
  ) => {
    onChangeRef.current = onChange;
    if (e.target.files && e.target.files.length > 0) {
      const { file } = getImageData(e);
      handleFileChange(file, onChange);
    }
  };

  const handleRemove = (e: React.MouseEvent, onChange: (val: any) => void) => {
    e.preventDefault();
    e.stopPropagation();
    onChangeRef.current = onChange;
    setDragError(null);
    onChange(null);
    setPreviewUrl(null);
    setFileName(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLLabelElement>,
    onChange: (val: any) => void,
  ) => {
    onChangeRef.current = onChange;
    onDragDrop(e);
  };

  return {
    previewUrl,
    fileName,
    isDragging,
    isWindowDragging,
    isAnyDragging,
    isInvalidDrag,
    dragError,
    dropzoneId,
    inputRef,
    handleFileChange,
    handleInputChange,
    handleRemove,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
