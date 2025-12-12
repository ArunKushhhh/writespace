import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* heading */}
      <div className="flex flex-col lg:flex-row lg:items-end">
        <h1 className="text-7xl md:text-9xl font-bold py-8">WriteSpace.</h1>
        <p className="text-2xl mb-8 text-right w-full text-muted-foreground">
          A Personalised Writing Space for you
        </p>
      </div>

      {/* darth vader image */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
        <Image
          src={"/jedi-temple.jpg"}
          alt="jedi-temple"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* about section */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* left: title and creted and maintained by Austen */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <h1 className="text-5xl md:text-6xl font-semibold hover:underline">
            Your One Space Writing Platform:
          </h1>
          <p className="text-muted-foreground">
            Created and maintained by Austen
          </p>
        </div>
        {/* right: description and github profile */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <p className="text-xl">
            Embracing the habit of writing — capturing your ideas, stories,
            insights, and experiences — can sharpen your thinking, amplify your
            voice, and unlock new levels of clarity, creativity, and impact in
            both your personal growth and professional journey.
          </p>
          <div className="flex gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden">
              <Image src={"/githubProfile.jpg"} alt={""} fill />
            </div>
            <div>
              <h1 className="text-xl font-medium">ArunKushhhh</h1>
              <Link
                href={"https://github.com/ArunKushhhh"}
                className="text-muted-foreground hover:underline"
              >
                View Profile on Github
              </Link>
            </div>
            <p></p>
          </div>
        </div>
      </div>

      {/* star repository section */}
      <div className="bg-linear-to-br from-transparent to-secondary min-h-[300px] my-24 flex justify-center items-center flex-col gap-4 rounded-2xl">
        <h1 className="text-3xl font-semibold">Star repository on Github</h1>
        <Link
          href={"https://github.com/ArunKushhhh/writespace"}
          className={`flex gap-2 items-center px-4 py-4 ${buttonVariants({ variant: "secondary", size: "lg" })} group`}
        >
          <Star className="size-4 group-hover:text-yellow-500 duration-300 ease-in-out" /> 
          Star Repository
        </Link>
      </div>

      {/* footer */}
      <footer className="flex flex-col my-6 gap-6 items-center w-full">
        <div className="flex justify-between items-end w-full">
          <h1 className="text-5xl md:text-6xl font-semibold">
            Built with Next.js
          </h1>
          <Link
            href={"https://github.com/ArunKushhhh/writespace"}
            target="_blank"
            className={`flex gap-2 items-center px-4 py-4 ${buttonVariants({ variant: "secondary", size: "lg" })}`}
          >
            <Github />
            View On Github
          </Link>
        </div>
        <Separator />
        <p>© 2025 WriteSpace. All rights reserved.</p>
      </footer>
    </div>
  );
}
