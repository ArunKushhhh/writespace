import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface BlogIdRouteProps {
  params: Promise<{ blogId: Id<"blogs"> }>;
}

export async function generateMetadata({
  params,
}: BlogIdRouteProps): Promise<Metadata> {
  const { blogId } = await params;

  const blog = await fetchQuery(api.blogs.getBlogById, { blogId: blogId });

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The blog you are looking for does not exist.",
    };
  }

  return {
    title: blog.title,
    description: blog.body,
  };
}

export default async function BlogDetailsPage({ params }: BlogIdRouteProps) {
  const { blogId } = await params;

  const token = await getToken();

  // performance optimization: when we want to run two queries at the same time in parallel to reduce the render time
  const [blog, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.blogs.getBlogById, { blogId: blogId }),
    await preloadQuery(api.comments.getCommentsByBlogId, { blogId: blogId }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  // multi layer auth check in case the proxy fails
  // this is a server side check, hence it won't fail
  if (!userId) {
    return redirect("/auth/sign-up");
  }

  if (!blog) {
    return (
      <div className="py-12 w-full h-full flex flex-col items-start justify-center gap-4">
        <div className="text-4xl sm:text-5xl font-bold">No Blogs Found</div>
        <div>
          Start creating
          <Link href={"/create"} className="text-red-500 hover:underline ">
            {" "}
            your own blogs
          </Link>{" "}
          or{" "}
          <Link href={"/blogs"} className="text-red-500 hover:underline ">
            Read other Blogs
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href={"/blogs"}
        className={`gap-2 flex mb-4 ${buttonVariants({ variant: "secondary" })}`}
      >
        <ArrowLeft size={4} />
        Back to Blogs
      </Link>

      <div className="relative w-full h-[400px] mb-8  overflow-hidden shadow-sm">
        <Image
          src={blog.imageUrl ?? "/Error-404.png"}
          alt={blog.title}
          fill
          className="object-center object-cover hover:scale-110 transition-all duration-300 ease-in-out"
        />
      </div>

      <div className="flex gap-4 items-start">
        <div className="bg-primary w-2 h-20" />
        <div className="space-y-4">
          <h1 className="w-full text-3xl sm:text-4xl font-bold tracking-tight">
            {blog.title}
          </h1>
          <div className="flex gap-4 items-center">
            <p className="text-muted-foreground">
              Posted on: {new Date(blog._creationTime).toLocaleDateString()}
            </p>
            {userId && <PostPresence roomId={blog._id} userId={userId} />}
          </div>
        </div>
      </div>

      <Separator className="mt-8 mb-4" />

      <div className="text-lg leading-relaxed text-primary/90 whitespace-pre-wrap">
        <p>{blog.body}</p>
      </div>

      <Separator className="mb-8 mt-4" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
