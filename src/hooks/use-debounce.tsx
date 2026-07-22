import { useCallback, useEffect, useRef } from 'react';

export default function useDebounce() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback((callback: () => void, delay: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debounce;
}
