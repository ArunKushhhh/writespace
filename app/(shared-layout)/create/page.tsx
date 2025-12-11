"use client";

import { createBlogAction } from "@/app/actions";
import { blogSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function CreateRoute() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof blogSchema>) {
    startTransition(async () => {
      console.log("This function runs on the client side");
      await createBlogAction(data);
    });
  }
  return (
    <div className="py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Blog
        </h1>
        <p className="text-xl text-muted-foreground">Share your thoughts...</p>
      </div>

      {/* Cards */}
      <Card className="w-full lg:max-w-xl">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Blog Title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Blog Content..."
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Blog Image..."
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin size-4" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Create Blog</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
