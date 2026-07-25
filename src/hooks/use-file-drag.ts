'use client';

import { useEffect, useRef, useState, DragEvent } from 'react';

export interface UseFileDragOptions {
  disabled?: boolean;
  hasPreview?: boolean;
  onFileDrop?: (file: File) => void;
  onInvalidDrop?: (message: string) => void;
}

export function useFileDrag({
  disabled = false,
  hasPreview = false,
  onFileDrop,
  onInvalidDrop,
}: UseFileDragOptions = {}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isWindowDragging, setIsWindowDragging] = useState(false);
  const [isInvalidDrag, setIsInvalidDrag] = useState(false);

  const disabledRef = useRef(disabled);
  const hasPreviewRef = useRef(hasPreview);

  useEffect(() => {
    disabledRef.current = disabled;
    hasPreviewRef.current = hasPreview;
  }, [disabled, hasPreview]);

  // Track global window drag events to detect when a file is dragged anywhere on screen
  useEffect(() => {
    let dragCounter = 0;

    const isFileDrag = (e: globalThis.DragEvent) => {
      if (!e.dataTransfer?.types) return false;
      const types = Array.from(e.dataTransfer.types);
      return (
        types.includes('Files') || types.includes('application/x-moz-file')
      );
    };

    const resetDragState = () => {
      dragCounter = 0;
      setIsWindowDragging(false);
      setIsDragging(false);
      setIsInvalidDrag(false);
    };

    const handleWindowDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (disabledRef.current || hasPreviewRef.current) return;

      if (isFileDrag(e)) {
        dragCounter++;
        setIsWindowDragging(true);
      }
    };

    const handleWindowDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (disabledRef.current || hasPreviewRef.current) return;
    };

    const handleWindowDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault();
      if (disabledRef.current || hasPreviewRef.current) return;

      dragCounter--;
      if (
        dragCounter <= 0 ||
        e.clientX === 0 ||
        e.clientY === 0 ||
        !e.relatedTarget
      ) {
        resetDragState();
      }
    };

    const handleWindowDrop = (e: globalThis.DragEvent) => {
      e.preventDefault();
      resetDragState();
    };

    const handleWindowDragEnd = () => {
      resetDragState();
    };

    const handleMouseUpOrLeave = () => {
      resetDragState();
    };

    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('dragend', handleWindowDragEnd);
    window.addEventListener('mouseup', handleMouseUpOrLeave);
    window.addEventListener('mouseleave', handleMouseUpOrLeave);

    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('dragend', handleWindowDragEnd);
      window.removeEventListener('mouseup', handleMouseUpOrLeave);
      window.removeEventListener('mouseleave', handleMouseUpOrLeave);
    };
  }, []);

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || hasPreview) return;

    const items = Array.from(e.dataTransfer.items || []);
    const hasNonImage = items.some(
      (item) =>
        item.kind === 'file' && item.type && !item.type.startsWith('image/'),
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
    if (disabled || hasPreview) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        onInvalidDrop?.(
          'Invalid file format. Only image files (JPG, PNG, WEBP, GIF) are allowed.',
        );
        return;
      }
      onFileDrop?.(file);
    }
  };

  const isAnyDragging = isDragging || isWindowDragging;

  return {
    isDragging,
    isWindowDragging,
    isAnyDragging,
    isInvalidDrag,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
