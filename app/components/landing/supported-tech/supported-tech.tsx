"use client";

import { NextjsIcon } from "@/lib/icons/frontend";
import { NodejsIcon } from "@/lib/icons/backend";
import { MongodbIcon } from "@/lib/icons/database";
import { PostgresqlIcon } from "@/lib/icons/database";
import { NextAuthIcon } from "@/lib/icons/auth";

const SupportedTech = () => {
  const techs = [
    { category: "Frontend", items: [{ name: "Next.js", icon: NextjsIcon }] },
    { category: "Backend", items: [{ name: "Node.js", icon: NodejsIcon }] },
    { category: "Database", items: [{ name: "PostgreSQL", icon: PostgresqlIcon }, { name: "MongoDB", icon: MongodbIcon }] },
    { category: "Auth", items: [{ name: "NextAuth", icon: NextAuthIcon }] },
  ];

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-24">
        {/* Header */}
        <div className="mb-16 px-2">
          <h2 className="text-3xl sm:text-4xl font-normal text-white leading-[1.3] mb-3">
            Works with what you're already using
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-light max-w-2xl">
            Compatible with modern frameworks. No vendor lock-in. Mix and match as needed.
          </p>
        </div>

        {/* Tech Showcase - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
          {techs.map((tech, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">
                {tech.category}
              </h3>
              <div className="flex flex-col gap-2">
                {tech.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIdx}
                      className="group relative overflow-hidden rounded border border-gray-800/50 hover:border-emerald-500/40 transition-all duration-300 p-3 bg-gradient-to-br from-gray-900/20 to-black/40 hover:from-gray-900/40 hover:to-emerald-950/20"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-emerald-500/20 to-transparent transition-opacity"></div>
                      
                      <div className="relative z-10 flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                        <span className="text-xs sm:text-sm text-gray-300 group-hover:text-emerald-300 transition-colors font-medium">
                          {item.name}
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Integration note */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 px-2">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-gray-500">
              More frameworks coming. <a href="https://github.com/icancodefyi/BaseCompose" className="text-emerald-400 hover:text-emerald-300 transition-colors underline">Contribute on GitHub</a> to expand support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportedTech;
