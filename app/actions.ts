"use server";

import z from "zod";
import { blogSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

export async function createBlogAction(data: z.infer<typeof blogSchema>) {
  const token = await getToken();
  
  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Something went wrong!");
  }
  await fetchMutation(
    api.blogs.createBlog,
    {
      body: parsed.data.content,
      title: parsed.data.title,
    },
    { token }
  );

  redirect("/");
}
