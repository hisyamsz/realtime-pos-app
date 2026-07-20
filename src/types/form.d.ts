import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";

export interface BaseFormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name" | "defaultValue"> {
  control?: Control<TFieldValues>;
  name?: TName;
  label?: string;
  error?: string;
}
