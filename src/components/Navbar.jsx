// Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

/* resizable-navbar primitives you provided */
import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Blogs", to: "/blogs" },
    { name: "Create", to: "/create" },
    { name: "Contact", to: "/contact" },
  ];

  const isActive = (to) => location.pathname === to;

  // safe navigate helper used by buttons
  const go = (to) => {
    setIsMobileMenuOpen(false);
    // stop possible event interference, then navigate
    navigate(to);
  };

  return (
    <>
      <ResizableNavbar className="fixed top-0 left-0 w-full z-20">
        <NavBody>
          {/* LEFT: logo */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
              <img src={logo} className="h-12 rounded-full" alt="ColdHours Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white ml-3">
                ColdHours
              </span>
            </Link>
          </div>

          {/* CENTER: nav links
              note: we make the parent non-interactive to avoid it blocking the right-side links.
              children are pointer-events-auto so they remain clickable.
          */}
          <div
            className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 lg:flex lg:space-x-2 pointer-events-none"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={
                  (isActive(item.to)
                    ? "relative px-4 py-2 text-white bg-blue-700 rounded-full z-10"
                    : "relative px-4 py-2 text-neutral-600 hover:text-neutral-800 rounded-full") +
                  " pointer-events-auto"
                }
                aria-current={isActive(item.to) ? "page" : undefined}
              >
                <span className="relative z-20">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* RIGHT: action buttons
              Use buttons which call navigate() — robust even if Link clicks are intercepted.
          */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go("/login")}
              className="inline-flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login/Signup
            </button>
          </div>
        </NavBody>

        {/* Mobile navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                <img src={logo} className="h-10 rounded-full" alt="ColdHours Logo" />
                <span className="ml-3 text-lg font-semibold dark:text-white">ColdHours</span>
              </Link>
            </div>

            <div>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((s) => !s)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex w-full flex-col gap-4">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2 px-3 text-neutral-700 dark:text-neutral-300"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex w-full flex-col gap-3 mt-2">
                {/* mobile button uses navigate helper */}
                <button
                  onClick={() => go("/login")}
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-blue-700"
                >
                  Login/Signup
                </button>

                <button
                  onClick={() => go("/create")}
                  className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200"
                >
                  Create
                </button>
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>

      <div className="h-16" />
    </>
  );
};

export default Navbar;
