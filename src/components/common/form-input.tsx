import { ReactNode, Ref, ChangeEvent } from 'react';
import {
  Control,
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

  const standaloneProps = isNumber
    ? {
        ...props,
        type: 'text',
        inputMode: 'numeric' as const,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          e.target.value = e.target.value.replace(/\D/g, '');
          props.onChange?.(e);
        },
      }
    : props;

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
                  {...props}
                  {...field}
                  type={isNumber ? 'text' : props.type}
                  inputMode={isNumber ? 'numeric' : props.inputMode}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    if (isNumber) {
                      const digits = e.target.value.replace(/\D/g, '');
                      e.target.value = digits;
                      field.onChange(digits ? Number(digits) : '');
                      props.onChange?.(e);
                    } else {
                      field.onChange(e);
                      props.onChange?.(e);
                    }
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
        <Input ref={ref} {...standaloneProps} />
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    );
  }

  return <Input ref={ref} {...standaloneProps} />;
}
