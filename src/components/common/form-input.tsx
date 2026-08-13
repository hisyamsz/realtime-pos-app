import { ReactNode, Ref, ChangeEvent } from 'react';
import {
  FieldPath,
  FieldValues,
  ControllerRenderProps,
  ControllerFieldState,
} from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BaseFormInputProps } from '@/types/form';

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormInputProps<TFieldValues, TName> {
  renderInput?: (
    field: ControllerRenderProps<TFieldValues, TName>,
    fieldState: ControllerFieldState,
  ) => ReactNode;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  error,
  renderInput,
  ref,
  ...props
}: FormInputProps<TFieldValues, TName> & { ref?: Ref<HTMLInputElement> }) {
  const isNumber = props.type === 'number';

  const inputProps = {
    ...props,
    ...(isNumber && {
      type: 'text' as const,
      inputMode: props.inputMode ?? ('numeric' as const),
    }),
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      if (isNumber) e.target.value = e.target.value.replace(/\D/g, '');
      props.onChange?.(e);
    },
  };

  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className="flex flex-col gap-1 space-y-1">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {renderInput ? (
                renderInput(field, fieldState)
              ) : (
                <Input
                  {...inputProps}
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, '');
                    field.onChange(isNumber ? (d ? Number(d) : '') : e);
                    props.onChange?.(e);
                  }}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (label || error) {
    return (
      <div className="flex w-full flex-col gap-1 space-y-2">
        {label && (
          <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <Input ref={ref} {...inputProps} />
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  return <Input ref={ref} {...inputProps} />;
}
