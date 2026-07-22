import {
  DEFAULT_DELAY,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '@/constants/data-table-constants';
import { useState } from 'react';
import useDebounce from '@/hooks/use-debounce';

export default function useDataTable() {
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT);
  const [currentSearch, setCurrentSearch] = useState('');
  const debounce = useDebounce();

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  const handleChangeLimit = (limit: number) => {
    setCurrentLimit(limit);
    setCurrentPage(DEFAULT_PAGE);
  };

  const handleChangeSearch = (search: string) => {
    debounce(() => {
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
