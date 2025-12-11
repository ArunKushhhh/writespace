"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center py-4">
      {/* left: logo and nav-tabs */}
      <div className="relative flex gap-6">
        <Link href={"/"} className="flex gap-2 items-center">
          <Image src={"/logo.svg"} alt="logo" width={36} height={36} />
          <p className="font-bold">WriteSpace</p>
        </Link>
        <nav>
          <ul className="hidden sm:flex gap-2">
            <li>
              <Link href={"/"} className={buttonVariants({ variant: "ghost" })}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href={"/blogs"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Blogs
              </Link>
            </li>
            <li>
              <Link
                href={"/create"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Create
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* right: login/sign-up and theme toggle */}
      <div className="flex gap-2 items-center">
        {isLoading ? null : isAuthenticated ? (
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    toast.success("Logged out successfully!");
                    router.push("/");
                  },
                  onError: (error) => {
                    toast.error(error.error.message);
                  },
                },
              })
            }
          >
            Log out
          </Button>
        ) : (
          <>
            <Link href={"/auth/sign-up"} className={buttonVariants()}>
              Sign up
            </Link>
            <Link
              href={"/auth/login"}
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
          </>
        )}

        <ThemeToggle />
      </div>
    </div>
  );
}
