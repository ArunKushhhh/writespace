"use client";

import { Loader2, MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByBlogId>;
}) {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ blogId: Id<"blogs"> }>();

  // loading a reactive query within a client component
  // const comments = useQuery(api.comments.getCommentsByBlogId, {
  //   blogId: params.blogId,
  // });

  // use preload Query for server side rendering and still maintaining the application realtime
  const comments = usePreloadedQuery(props.preloadedComments);

  const createCommentMutation = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.blogId, //get data from the params from  a client component, we use useParams from next/navigation
    },
  });

  const onSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await createCommentMutation({
          blogId: params.blogId,
          body: data.body,
        });
        form.reset();
        toast.success("Comment Posted!");
      } catch {
        toast.error("Failed to create comment!");
      }
    });
  };

  if (comments === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <MessageSquare className="size-4" />
          <h2 className="text-xl font-semibold">Comments</h2>
        </CardTitle>
        <CardDescription>
          {comments.length === 0
            ? "No Comments"
            : comments.length + " Comments"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts..."
                  {...field}
                />
              </Field>
            )}
          />
          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </form>

        {comments.length >> 0 && <Separator />}

        <section className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-2">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
