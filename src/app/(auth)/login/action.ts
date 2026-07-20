"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { loginSchema } from "@/validation/auth-validation";
import { createClient } from "@/lib/supabase/server";
import { LoginFormState } from "@/types/auth";

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData | null,
): Promise<LoginFormState> {
  if (!formData) {
    return {
      status: "idle",
      errors: {
        email: [],
        password: [],
        _form: [],
      },
    };
  }

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
    const supabase = await createClient({});

    const {
      error,
      data: { user },
    } = await supabase.auth.signInWithPassword(validatedFields.data);

    if (error) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [error.message],
        },
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (profile) {
      const cookiesStore = await cookies();
      cookiesStore.set("user_profile", JSON.stringify(profile), {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
  } catch (err: any) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [err?.message || "An unexpected error occurred"],
      },
    };
  }

  revalidatePath("/", "layout");
  return {
    status: "success",
    message: "Login successful",
    errors: {},
  };
}
