"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/validation/auth-validation";
import { loginWithPassword } from "./server";
import { LoginFormState } from "@/types/auth";

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: {
        email: fieldErrors.email || [],
        password: fieldErrors.password || [],
        _form: [],
      },
    };
  }

  try {
    const { error } = await loginWithPassword(validatedFields.data);

    if (error) {
      return {
        status: "error",
        errors: {
          email: [],
          password: [],
          _form: [error.message],
        },
      };
    }
  } catch (err: any) {
    return {
      status: "error",
      errors: {
        email: [],
        password: [],
        _form: [err?.message || "An unexpected error occurred"],
      },
    };
  }

  redirect("/admin");
}
