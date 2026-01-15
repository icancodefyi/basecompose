"use client";

import { Github, Github as GithubIcon } from "lucide-react";

const Footer = () => {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/icancodefyi/layered",
      icon: true,
    },
    {
      label: "Docs",
      href: "https://github.com/icancodefyi/layered#readme",
    },
    {
      label: "Status",
      href: "/system-status",
    },
  ];

  return (
    <footer className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <p className="text-xs text-gray-600">
              Layered — Build modern web apps, faster.
            </p>
            <div className="hidden sm:block w-px h-4 bg-gray-800/50"></div>
            <p className="text-xs text-gray-600">
              MIT License
            </p>
          </div>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800/30">
          <p className="text-xs text-gray-700 text-center">
            © 2025 Layered. Built by developers, for developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
