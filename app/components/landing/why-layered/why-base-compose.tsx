"use client";

const WhyBaseCompose = () => {
  const reasons = [
    {
      icon: "→",
      label: "Incremental",
      description: "Works with existing repos. Add to what you have, not replace it.",
      accent: "from-emerald-500/20 to-transparent",
    },
    {
      icon: "⊙",
      label: "Your Ownership",
      description: "Code lives in your GitHub. Full history, zero lock-in, complete control.",
      accent: "from-blue-500/20 to-transparent",
    },
    {
      icon: "⚙",
      label: "Production Ready",
      description: "Environment configs, Docker, deployments included. Not templates.",
      accent: "from-purple-500/20 to-transparent",
    },
    {
      icon: "◎",
      label: "Built for Teams",
      description: "Enforce once, reuse everywhere. Standards become inheritance.",
      accent: "from-pink-500/20 to-transparent",
    },
  ];

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-24">
        <div className="max-w-2xl mb-16 px-2">
          <h2 className="text-3xl sm:text-4xl font-normal text-white leading-[1.3] mb-3">
            Why BaseCompose?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-light">
            Four reasons this isn't just another boilerplate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-2">
          {reasons.map((reason, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded border border-gray-800/50 hover:border-gray-700/80 transition-all duration-300 p-6 bg-linear-to-br from-gray-900/30 to-black/50 hover:from-gray-900/50 hover:to-black/70"
            >
              {/* Background accent */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-linear-to-br ${reason.accent}`}
              ></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-xl sm:text-2xl font-light text-emerald-400/60 group-hover:text-emerald-400 transition-colors mb-3">
                  {reason.icon}
                </div>

                {/* Label */}
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {reason.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  {reason.description}
                </p>
              </div>
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBaseCompose;
