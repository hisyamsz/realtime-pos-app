import {
  DEFAULT_DELAY,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '@/constants/data-table-constants';
import { useRef, useState } from 'react';

export default function useDataTable() {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
  const [currentSearch, setCurrentSearch] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangeLimit = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(DEFAULT_PAGE);
  };

  const handleChangeSearch = (search: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      console.log('[Debounce Search Triggered]:', search);
      setCurrentSearch(search);
      setCurrentPage(DEFAULT_PAGE);
    }, DEFAULT_DELAY);
  };

  return {
    currentPage,
    handleChangePage,
    currentLimit,
    handleChangeLimit,
    setCurrentPage,
    currentSearch,
    handleChangeSearch,
  };
}
