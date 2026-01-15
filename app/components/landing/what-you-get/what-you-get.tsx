"use client";

const WhatYouGet = () => {
  const deliverables = [
    {
      icon: "🔐",
      title: "Authentication",
      description: "NextAuth.js configured with provider strategies, sessions, and JWT tokens.",
      features: ["Multiple OAuth providers", "Session management", "Type-safe auth"],
    },
    {
      icon: "🗄️",
      title: "Database Setup",
      description: "MongoDB or PostgreSQL pre-configured with migrations and type definitions.",
      features: ["Schema migrations", "ORM integration", "Type generation"],
    },
    {
      icon: "🔌",
      title: "API Layer",
      description: "RESTful endpoints scaffolded following your patterns and best practices.",
      features: ["Route handlers", "Type safety", "Error handling"],
    },
    {
      icon: "🐳",
      title: "Docker & DevOps",
      description: "Compose files for local development and production environments.",
      features: ["Local development", "Production configs", "Database containers"],
    },
    {
      icon: "⚙️",
      title: "Environment Config",
      description: ".env templates with all required variables documented and validated.",
      features: ["Variable templates", "Documentation", "Validation"],
    },
    {
      icon: "✓",
      title: "Code Quality",
      description: "ESLint, TypeScript, and prettier configs matching industry standards.",
      features: ["Linting rules", "Type checking", "Code formatting"],
    },
  ];

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-24">
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl font-normal text-white leading-[1.3] mb-3">
            What you get
          </h2>
          <p className="text-base text-gray-500 font-light">
            Everything a production app needs. Generated, customized, and pushed to your repo in one command.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliverables.map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded border border-gray-800/50 hover:border-emerald-500/40 transition-all duration-300 p-6 bg-gradient-to-br from-gray-900/20 to-black/40 hover:from-gray-900/40 hover:to-emerald-950/20"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-emerald-500/20 to-transparent transition-opacity"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-2xl">
                    {item.icon}
                  </span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {item.features.map((feature, fidx) => (
                    <span
                      key={fidx}
                      className="inline-block px-2 py-1 text-xs bg-emerald-950/30 text-emerald-400/70 rounded border border-emerald-500/20 group-hover:border-emerald-500/40 group-hover:bg-emerald-950/50 group-hover:text-emerald-400 transition-all"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
