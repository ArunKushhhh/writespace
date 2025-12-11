import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const createBlog = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // we want to ensure only the authenticated users are able to create blogs
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("User not authenticated");
    }
    const blogArticle = await ctx.db.insert("blogs", {
      title: args.title,
      body: args.body,
      authorId: user._id,
      imageStorageId: args.imageStorageId,
    });

    return blogArticle;
  },
});

export const getBlogs = query({
  args: {},
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").order("desc").collect();

    return await Promise.all(
      blogs.map(async (blog) => {
        const resolvedImageUrl =
          blog.imageStorageId !== undefined
            ? await ctx.storage.getUrl(blog.imageStorageId)
            : null;

        return {
          ...blog,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("User not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});
