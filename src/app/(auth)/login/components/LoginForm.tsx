"use client";

import { loginSchema } from "@/lib/zodValidation";
import React, { Fragment, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import login from "@/app/actions/login";
import toast from "react-hot-toast";
import SearchErrorHandler from "./SearchErrorHandler";

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const data = await login(values);

    if (data?.error) {
      toast.error(data.error);
    } else {
      toast.success("Login successfully");
    }
  };

  return (
    <Fragment>
      <Suspense fallback={null}>
        <SearchErrorHandler />
      </Suspense>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>Password</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your password"
                    {...field}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full mt-3">
            {loading && <Loader2 className="animate-spin" />}
            Login
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default LoginForm;
