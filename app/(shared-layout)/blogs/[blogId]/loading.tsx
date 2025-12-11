import { Skeleton } from "@/components/ui/skeleton";

// instead of using custom suspense boundaries for this route, we are creating a loading.tsx file because almost everything in this route is dynamically fetched from the server; there are no static components

// internally loading.tsx creates suspense boundaries at the top and bottom of the component tree; it also creates a fallback that is shown while the component is loading
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <Skeleton className="h-8 w-32 mb-4" />
      <Skeleton className="h-[400px] w-full mb-8" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="mt-8 space-y-2">
        <Skeleton className="h-full w-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
