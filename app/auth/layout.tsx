import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="absolute top-4 left-4">
        <Link href={"/"} className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft size={4} />
          <p>Go back</p>
        </Link>
      </div>
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}
