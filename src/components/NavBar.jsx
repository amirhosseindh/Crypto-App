import React from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./shared/ThemeToggle";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Coins", path: "/coins" },
  { name: "Trade", path: "/trade" },
];

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 sm:px-10 py-4 bg-white dark:bg-[#041a21] border-b border-gray-200 dark:border-gray-800 transition-colors">
      <section className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
        CryptoApp
      </section>

      <ul className="flex items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-cyan-500 dark:text-cyan-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                }`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <ThemeToggle />
    </nav>
  );
};

export default Navbar;