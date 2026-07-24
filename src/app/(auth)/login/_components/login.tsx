'use client';

import { useActionState, useEffect, useState, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';

import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from '@/constants/auth-constants';
import { loginSchema, type LoginForm } from '@/validation/auth-validation';
import { PasswordInput } from '@/components/common/password-input';
import { FormInput } from '@/components/common/form-input';
import { DarkmodeToggle } from '@/components/common/darkmode-toggle';
import { loginAction as loginServerAction } from '../action';

export default function Login() {
  const searchParams = useSearchParams();
  const [loginState, loginAction, isPending] = useActionState(
    loginServerAction,
    INITIAL_STATE_LOGIN_FORM,
  );

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  useEffect(() => {
    if (loginState?.status === 'error') {
      toast.error('Login Failed', {
        description: loginState.errors?._form?.[0],
        position: 'top-right',
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState]);

  useEffect(() => {
    if (loginState.errors) {
      if (loginState.errors.email && loginState.errors.email.length > 0) {
        form.setError('email', {
          type: 'server',
          message: loginState.errors.email[0],
        });
      }
      if (loginState.errors.password && loginState.errors.password.length > 0) {
        form.setError('password', {
          type: 'server',
          message: loginState.errors.password[0],
        });
      }
      if (loginState.errors._form && loginState.errors._form.length > 0) {
        setFormError(loginState.errors._form[0]);
      }
    }
  }, [loginState, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (formError) {
        setFormError(null);
      }
      if (name) {
        form.clearErrors(name as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, formError]);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const callbackUrl = searchParams.get('callbackUrl');
    if (callbackUrl) {
      formData.append('callbackUrl', callbackUrl);
    }

    startTransition(() => {
      loginAction(formData);
    });
  });

  return (
    <div className="bg-soft-cloud relative flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <DarkmodeToggle />
      </div>
      <Card className="bg-canvas w-full max-w-[500px] p-4 shadow-none md:p-8">
        <CardHeader className="!flex flex-col items-center gap-4 px-0 pt-0 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-ink text-canvas flex aspect-square size-10 items-center justify-center rounded-lg">
              <Store className="size-5" />
            </div>
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
              onSubmit={onSubmit}
              className="flex flex-col gap-6"
              noValidate
            >
              {formError && (
                <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm font-medium">
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
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isPending}
              >
                {isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
