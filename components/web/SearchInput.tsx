"use client";

import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const results = useQuery(
    api.blogs.searchBlogs,
    term.length > 2
      ? {
          limit: 5,
          term: term,
        }
      : "skip"
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }
  return (
    <div className="relative w-full sm:max-w-sm z-10">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Blogs..."
          className="pl-8 bg-background text-sm w-full"
          value={term}
          onChange={handleInputChange}
        />
      </div>

      {open && term.length > 2 && (
        <div className="absolute top-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin mr-2" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              No results found!
            </div>
          ) : (
            <div className="py-1">
              {results.map((result) => (
                <Link
                  className="flex flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  href={`/blogs/${result._id}`}
                  key={result._id}
                  onClick={() => {
                    setOpen(false);
                    setTerm("");
                  }}
                >
                  <p className="font-medium line-clamp-1">{result.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {result.body}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
