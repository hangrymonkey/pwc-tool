import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronDown, Settings, CircleHelp, BellDot } from 'lucide-react';
import UserAccountNav from "./UserAccountNav";

const Navbar = () => {
  const user = undefined;
  const isAdmin = false;

  return (
    <nav className="z-[100] h-18 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-18 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <Image src="/pwc.png" alt="logo" width={70} height={70} />
          </Link>

          <div className="h-full flex items-center space-x-4">
            <>
              <Link
                href=""
                className={cn(buttonVariants({
                  size: "lg",
                  variant: "ghost",
                }), "text-lg")}
              >
                Assurance 
                <ChevronDown className="h-6 w-6" /> 
              </Link>

              <Link
                href=""
                className={cn(buttonVariants({
                  size: "lg",
                  variant: "ghost",
                }), "text-lg")}
              >
                Consulting
                <ChevronDown className="h-6 w-6" /> 
              </Link>

              <Link
                  href="#whytuition"
                  className={cn(buttonVariants({
                    size: "lg",
                    variant: "ghost",
                  }), "text-lg")}
                >
                  Tax
                  <ChevronDown className="h-6 w-6" /> 
              </Link>

              <Link
                  href="#whytuition"
                  className={cn(buttonVariants({
                    size: "lg",
                    variant: "ghost",
                  }), "text-lg")}
                >
                  Deals
                  <ChevronDown className="h-6 w-6" /> 
              </Link>

              <BellDot />
              <Settings />
              <CircleHelp />
              

              <UserAccountNav
                    name="Beverly Guo"
                    email="beverlyyb@pwc.com"
                    imageUrl="/beverlyguo.jpeg"
                  />
              {/* <Link
                  href="#getstarted"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Get Started!
              </Link> */}


            </>
            
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
