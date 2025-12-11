import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "WriteSpace | Blogs",
  description: "Find what people around the globe think...",
  category: "Blogs",
  authors: [{
    name: "Austen"
  }]
};

export const dynamic = "force-static"; // 'force-dynamic' | 'force-static' | "auto" | "error"

// time based revalidation
export const revalidate = 60; // false | 0 | number

//on demand validation

export default function BlogsPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Blogs
        </h1>
        <p className="text-xl text-muted-foreground">
          Find what people around the globe think...
        </p>
      </div>

      {/* blogs */}
      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  const data = await fetchQuery(api.blogs.getBlogs);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((blog) => (
        <Card
          key={blog._id}
          className="hover:-translate-y-1 duration-300 ease-in-out group gap-6 pt-0 overflow-hidden"
        >
          <div className="h-52 w-full overflow-hidden">
            <div className="relative h-52 w-full overflow-hidden group-hover:scale-120 transition-all duration-300 ease-in-out object-top">
              <Image
                src={blog.imageUrl ?? "/Error-404.png"}
                alt=""
                fill
                className="object-top object-cover"
              />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-bold group-hover:text-primary">
              {blog.title}
            </CardTitle>
            {/* <CardDescription></CardDescription> */}
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <p className="line-clamp-3 text-muted-foreground">{blog.body}</p>
            <Link
              href={`/blogs/${blog._id}`}
              className="hover:-translate-y-1 duration-300 ease-in-out"
            >
              <Button className="w-full">Read More</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div className="flex flex-col space-y-6" key={i}>
          <Skeleton className="h-52 w-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
