"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { INITIAL_LOGIN_FORM, INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constants";
import { loginSchema, type LoginForm } from "@/validation/auth-validation";
import { PasswordInput } from "@/components/common/password-input";
import { FormInput } from "@/components/common/FormInput";
import { loginAction } from "../action";

export default function Login() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_STATE_LOGIN_FORM
  );

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  useEffect(() => {
    if (state.errors) {
      if (state.errors.email && state.errors.email.length > 0) {
        form.setError("email", {
          type: "server",
          message: state.errors.email[0],
        });
      }
      if (state.errors.password && state.errors.password.length > 0) {
        form.setError("password", {
          type: "server",
          message: state.errors.password[0],
        });
      }
      if (state.errors._form && state.errors._form.length > 0) {
        setFormError(state.errors._form[0]);
      }
    }
  }, [state, form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (formError) {
        setFormError(null);
      }
      form.clearErrors();
    });
    return () => subscription.unsubscribe();
  }, [form, formError]);

  const onSubmit = async (data: LoginForm) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-cloud p-4 md:p-8">
      <Card className="w-full max-w-[500px] rounded-none shadow-none bg-canvas p-4 md:p-8">
        <CardHeader className="!flex flex-col items-center gap-4 text-center px-0 pt-0">
          <div className="flex items-center justify-center gap-3">
            <Store className="h-10 w-10 text-foreground" />
            <CardTitle className="text-heading-xl">Omni POS</CardTitle>
          </div>
          <CardDescription className="text-body-md text-muted-foreground mt-2">
            Welcome back! Please enter your details to sign in to your
            dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
              noValidate
            >
              {formError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 font-medium">
                  {formError}
                </div>
              )}

              <FormInput
                control={form.control}
                name="email"
                label="Email Address:"
                placeholder="name@example.com"
                type="email"
                disabled={isPending}
              />
              <PasswordInput
                control={form.control}
                name="password"
                label="Password:"
                placeholder="Enter your password"
                disabled={isPending}
              />
              <Button type="submit" className="w-full mt-4" disabled={isPending}>
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
