"use client";

import { Github, Github as GithubIcon } from "lucide-react";

const Footer = () => {
  const links = [
    {
      label: "GitHub",
      href: "https://github.com/icancodefyi/BaseCompose",
    },
    {
      label: "License",
      href: "https://github.com/icancodefyi/BaseCompose/blob/main/LICENSE",
    },
    {
      label: "Docs",
      href: "https://github.com/icancodefyi/BaseCompose#readme",
    },
  ];

  return (
    <footer className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-12 sm:py-16">
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Main footer content */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs sm:text-sm text-gray-600">
                BaseCompose — Build modern web apps, faster.
              </p>
              <p className="text-xs text-gray-700">
                MIT License. Open source.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-emerald-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-800/30"></div>

          <p className="text-xs text-gray-700 text-center">
            © 2025 BaseCompose. Built by developers, for developers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
