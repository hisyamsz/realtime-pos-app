'use client';

import { forwardRef, ForwardedRef, useState, ReactElement } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FormInput } from '@/components/common/form-input';
import { Input } from '@/components/ui/input';
import { BaseFormInputProps } from '@/types/form';
import { cn } from '@/lib/utils';
import { FieldPath, FieldValues } from 'react-hook-form';

export type PasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BaseFormInputProps<TFieldValues, TName>;

const PasswordInputComponent = forwardRef(
  <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(
    {
      className,
      control,
      name,
      label,
      error,
      placeholder,
      ...props
    }: PasswordInputProps<TFieldValues, TName>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <FormInput
        control={control}
        name={name}
        label={label}
        error={error}
        renderInput={(field, fieldState) => (
          <div className="relative w-full">
            <Input
              type={showPassword ? 'text' : 'password'}
              className={cn('!pr-12', className)}
              placeholder={placeholder}
              aria-invalid={!!fieldState?.error || !!error}
              {...props}
              {...field}
            />
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-foreground absolute top-0 right-0 flex h-full w-12 items-center justify-center rounded-r-[8px] bg-transparent focus:outline-none focus-visible:ring-2"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        )}
      />
    );
  },
);

PasswordInputComponent.displayName = 'PasswordInput';

const PasswordInput = PasswordInputComponent as <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: PasswordInputProps<TFieldValues, TName> & {
    ref?: ForwardedRef<HTMLInputElement>;
  },
) => ReactElement;

export { PasswordInput };
