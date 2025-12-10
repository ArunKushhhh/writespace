import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { authComponent } from "./auth";

export const createBlog = mutation({
  args: {
    title: v.string(),
    body: v.string(),
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
    });

    return blogArticle;
  },
});

