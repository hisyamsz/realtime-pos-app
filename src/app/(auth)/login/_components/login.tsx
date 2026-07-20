"use client";

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

import { INITIAL_LOGIN_FORM } from "@/constants/auth-constants";
import { loginSchema, type LoginForm } from "@/validation/auth-validation";
import { PasswordInput } from "@/components/common/password-input";
import { FormInput } from "@/components/common/FormInput";

export default function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = (data: LoginForm) => {
    console.log("Login Form Data Submitted:", data);
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
              <FormInput
                control={form.control}
                name="email"
                label="Email Address:"
                placeholder="name@example.com"
                type="email"
              />
              <PasswordInput
                control={form.control}
                name="password"
                label="Password:"
                placeholder="Enter your password"
              />
              <Button type="submit" className="w-full mt-4">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
