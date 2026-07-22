import { ReactNode } from 'react';
import { Card } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import PaginationDataTable from './pagination-data-table';
import { LIMIT_OPTIONS } from '@/constants/data-table-constants';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  limitOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface DataTableProps<T> {
  headers: string[];
  data?: T[] | null;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyMessage?: string;
  pagination?: PaginationProps;
}

export default function DataTable<T>({
  headers,
  data,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load data.',
  onRetry,
  emptyMessage = 'No data available.',
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="overflow-hidden p-0">
        <Table className="w-full">
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              {headers.map((header, idx) => (
                <TableHead
                  key={idx}
                  className="text-foreground px-6 py-3 font-semibold"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-muted-foreground h-32 text-center text-sm"
                >
                  Loading data...
                </TableCell>
              </TableRow>
            )}

            {isError && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-destructive h-32 text-center text-sm"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p>{errorMessage}</p>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="hover:text-destructive/80 font-medium underline underline-offset-4"
                      >
                        Try again
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && data && data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-muted-foreground h-32 text-center text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              data &&
              data.length > 0 &&
              (data as unknown as ReactNode[][]).map((row, rowIndex) => (
                <TableRow key={`tr-${rowIndex}`}>
                  {row.map((column, columnIndex) => (
                    <TableCell
                      className="px-6 py-4"
                      key={`tc-${rowIndex}-${columnIndex}`}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {pagination && (
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <div className="hidden items-center gap-2 text-sm md:flex">
            <p className="text-muted-foreground">Limit:</p>
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => pagination.onLimitChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {(pagination.limitOptions || LIMIT_OPTIONS).map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-full items-center justify-center md:w-auto md:justify-end">
            {pagination.totalPages > 1 && (
              <PaginationDataTable
                totalPages={pagination.totalPages}
                currentPage={pagination.currentPage}
                onChangePage={pagination.onPageChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
