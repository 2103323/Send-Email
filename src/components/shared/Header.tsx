import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <>
      <nav
        className="container mt-3 flex items-center justify-between rounded-full
    border-violet-700 border-2 border-secondary py-6"
      >
        <Link href="/" className="relative">
          <h1 className="text-xl font-semibold">Company</h1>
          <Badge variant="default" className="absolute -right-8 -top-3">
            Admin
          </Badge>
        </Link>

        <ThemeToggle />
      </nav>
    </>
  );
};

export default Header;
