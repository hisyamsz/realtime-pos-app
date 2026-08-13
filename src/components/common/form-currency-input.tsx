import { FieldPath, FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormInput, FormInputProps } from '@/components/common/form-input';

export type FormCurrencyInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<FormInputProps<TFieldValues, TName>, 'type'>;

const formatDisplay = (val: unknown) => {
  if (!val && val !== 0) return '';
  const digits = String(val).replace(/\D/g, '');
  return digits ? Number(digits).toLocaleString('id-ID') : '';
};

export function FormCurrencyInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormCurrencyInputProps<TFieldValues, TName>) {
  const { disabled, placeholder, className } = props;
  return (
    <FormInput
      {...props}
      renderInput={(field) => (
        <Input
          {...field}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          className={className}
          value={formatDisplay(field.value)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            field.onChange(digits ? Number(digits) : '');
          }}
        />
      )}
    />
  );
}
