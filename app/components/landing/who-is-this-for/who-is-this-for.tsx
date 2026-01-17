"use client";

const WhoIsThisFor = () => {
  const useCases = [
    {
      icon: "🚀",
      title: "Startup founders",
      description: "Launch backends that scale from day one. Skip the infrastructure headache.",
    },
    {
      icon: "👥",
      title: "Engineering teams",
      description: "Enforce consistency across services. New projects follow the same patterns automatically.",
    },
    {
      icon: "🔧",
      title: "Full-stack developers",
      description: "Spend time on business logic, not boilerplate. Generate auth, APIs, and databases in seconds.",
    },
    {
      icon: "📦",
      title: "Product teams shipping fast",
      description: "Move from MVP to production-ready in one step. Real deployments, not prototypes.",
    },
  ];

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-24">
        {/* Header */}
        <div className="mb-12 px-2">
          <h2 className="text-3xl sm:text-4xl font-normal text-white leading-[1.3] mb-4">
            Built for teams shipping code, not infrastructure
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-light max-w-3xl">
            Whether you're bootstrapping or scaling, BaseCompose handles the patterns you'd build anyway.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className="flex gap-4 sm:gap-5 p-5 sm:p-6 rounded-lg border border-gray-800/50 hover:border-emerald-500/30 hover:bg-emerald-950/5 transition-all duration-300 group"
            >
              <div className="shrink-0 text-2xl sm:text-3xl">{useCase.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-normal text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoIsThisFor;
