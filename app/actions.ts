"use server";

import z from "zod";
import { blogSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { revalidatePath } from "next/cache";

export async function createBlogAction(data: z.infer<typeof blogSchema>) {
  try {
    const token = await getToken();

    const parsed = blogSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error("Something went wrong!");
    }
    const imageUrl = await fetchMutation(
      api.blogs.generateImageUploadUrl,
      {},
      { token }
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      throw new Error("Failed to upload image!");
    }

    const { storageId } = await uploadResult.json();
    if (!storageId) {
      throw new Error("Failed to upload image!");
    }

    await fetchMutation(
      api.blogs.createBlog,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      { token }
    );
  } catch (error) {
    throw new Error("Failed to create blog!");
  }
  revalidatePath("/blogs");

  return redirect("/blogs");
}
