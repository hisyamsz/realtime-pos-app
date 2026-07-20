import * as React from "react";
import { Control, FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BaseFormInputProps } from "@/types/form";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormInputProps<TFieldValues, TName> {
  renderInput?: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactNode;
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
}: FormInputProps<TFieldValues, TName> & { ref?: React.Ref<HTMLInputElement> }) {
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1 space-y-2">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {renderInput ? (
                renderInput(field)
              ) : (
                <Input {...props} {...field} />
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
      <div className="flex flex-col gap-1 space-y-2 w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <Input ref={ref} {...props} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return <Input ref={ref} {...props} />;
}
