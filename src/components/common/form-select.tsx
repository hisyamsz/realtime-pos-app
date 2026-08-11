'use client';

import { FieldValues, Path, UseFormReturn, Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface SelectItemOption {
  value: string | boolean | number;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps<T extends FieldValues> {
  form?: UseFormReturn<T>;
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  selectItem: SelectItemOption[];
  disabled?: boolean;
  className?: string;
}

export function FormSelect<T extends FieldValues>({
  form,
  control,
  name,
  label,
  placeholder = 'Select an option',
  selectItem,
  disabled,
  className,
}: FormSelectProps<T>) {
  const activeControl = control || form?.control;

  if (!activeControl) {
    return null;
  }

  return (
    <FormField
      control={activeControl}
      name={name}
      render={({ field }) => {
        const stringValue =
          field.value !== undefined && field.value !== null
            ? String(field.value)
            : undefined;

        const handleValueChange = (val: string) => {
          const selected = selectItem.find(
            (item) => String(item.value) === val,
          );
          field.onChange(selected ? selected.value : val);
        };

        return (
          <FormItem className="flex flex-col gap-1 space-y-1">
            {label && <FormLabel>{label}</FormLabel>}
            <Select
              onValueChange={handleValueChange}
              value={stringValue}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    'border-border !h-12 w-full rounded-[8px] px-4 text-base md:text-sm [&:not([data-placeholder])]:capitalize',
                    'focus-visible:border-foreground focus-visible:border-2 focus-visible:ring-0',
                    className,
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  {label && <SelectLabel>{label}</SelectLabel>}
                  {selectItem.map((item) => {
                    const itemValueStr = String(item.value);
                    return (
                      <SelectItem
                        key={itemValueStr}
                        value={itemValueStr}
                        disabled={item.disabled}
                        className="capitalize"
                      >
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default FormSelect;
