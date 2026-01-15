"use client";

import { useState, useEffect, useRef } from "react";

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);

  const files = [
    { name: "auth.controller.ts", lines: 128 },
    { name: "auth.service.ts", lines: 256 },
    { name: "auth.routes.ts", lines: 64 },
    { name: ".env.example", lines: 12 },
    { name: "docker-compose.yml", lines: 48 },
  ];

  // IntersectionObserver - detect when in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setActiveStep(1);
        } else {
          setIsInView(false);
        }
      });
    }, { threshold: 0.8 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Scroll hijacking
  useEffect(() => {
    if (!isInView) return;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTimeRef.current < 350) return;

      let shouldPrevent = false;

      if (e.deltaY > 0 && activeStep < 4) {
        // Scrolling down
        e.preventDefault();
        lastTimeRef.current = now;
        setActiveStep((p) => Math.min(p + 1, 4));
        shouldPrevent = true;
      } else if (e.deltaY < 0 && activeStep > 1) {
        // Scrolling up
        e.preventDefault();
        lastTimeRef.current = now;
        setActiveStep((p) => Math.max(p - 1, 1));
        shouldPrevent = true;
      }

      if (shouldPrevent) {
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isInView, activeStep]);

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50" ref={containerRef}>
      <div className="w-full max-w-7xl mx-auto py-24">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-normal text-white leading-[1.3] mb-3">
            How it works
          </h2>
          <p className="text-base text-gray-400 font-light max-w-2xl">
            From request to ready-to-pull code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Step 1 */}
          <div
            className={`border rounded-lg p-8 transition-all duration-300 ${
              activeStep === 1
                ? "border-emerald-400/60 bg-emerald-950/10 shadow-lg shadow-emerald-500/10"
                : "border-gray-800/50 opacity-60"
            }`}
            onMouseEnter={() => setActiveStep(1)}
            onMouseLeave={() => setActiveStep(1)}
          >
            <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 transition-colors ${
              activeStep === 1 ? "text-emerald-300" : "text-gray-500"
            }`}>
              Step 1
            </h3>
            <p className={`text-sm mb-4 transition-colors ${
              activeStep === 1 ? "text-white" : "text-gray-400"
            }`}>
              Describe what you need
            </p>
            <div className={`font-mono text-xs space-y-1 ${
              activeStep === 1 ? "text-gray-300" : "text-gray-600"
            }`}>
              <div>&gt; ask-layered</div>
              <div>Add authentication to my application</div>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`border rounded-lg p-8 transition-all duration-300 ${
              activeStep === 2
                ? "border-emerald-400/60 bg-emerald-950/15 shadow-lg shadow-emerald-500/10"
                : "border-gray-800/50 opacity-60"
            }`}
            onMouseEnter={() => setActiveStep(2)}
            onMouseLeave={() => setActiveStep(1)}
          >
            <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 transition-colors ${
              activeStep === 2 ? "text-emerald-300" : "text-gray-500"
            }`}>
              Layered applies
            </h3>
            <p className={`font-medium mb-4 transition-all ${
              activeStep === 2 ? "text-white text-base" : "text-gray-400 text-sm"
            }`}>
              Files changed
            </p>
            <div className="font-mono text-xs space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`transition-colors ${
                    activeStep === 2 ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {file.name}
                  </span>
                  <span className={`font-bold transition-all ${
                    activeStep === 2 ? "text-emerald-300 text-sm" : "text-emerald-400/50 text-xs"
                  }`}>
                    +{file.lines}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`border rounded-lg p-8 transition-all duration-300 ${
              activeStep === 3
                ? "border-emerald-400/60 bg-emerald-950/10 shadow-lg shadow-emerald-500/10"
                : "border-gray-800/50 opacity-60"
            }`}
            onMouseEnter={() => setActiveStep(3)}
            onMouseLeave={() => setActiveStep(1)}
          >
            <h3 className={`text-sm font-semibold uppercase tracking-wide mb-3 transition-colors ${
              activeStep === 3 ? "text-emerald-300" : "text-gray-500"
            }`}>
              Step 3
            </h3>
            <p className={`text-sm transition-colors ${
              activeStep === 3 ? "text-white" : "text-gray-400"
            }`}>
              Review what was added
            </p>
            <p className={`font-mono text-xs mt-4 leading-relaxed transition-colors ${
              activeStep === 3 ? "text-gray-300" : "text-gray-600"
            }`}>
              Authentication wired with environment variables and Docker support.
            </p>
          </div>

          {/* Step 4 */}
          <div
            className={`border rounded-lg p-8 transition-all duration-300 ${
              activeStep === 4
                ? "border-emerald-400/60 bg-emerald-950/10 shadow-lg shadow-emerald-500/10"
                : "border-gray-800/50 opacity-60"
            }`}
            onMouseEnter={() => setActiveStep(4)}
            onMouseLeave={() => setActiveStep(1)}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className={`w-5 h-5 transition-all ${
                activeStep === 4 ? "text-emerald-300" : "text-gray-500"
              }`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <h3 className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeStep === 4 ? "text-emerald-300" : "text-gray-500"
              }`}>
                Ready to pull
              </h3>
            </div>
            <p className={`text-sm mb-4 transition-colors ${
              activeStep === 4 ? "text-white" : "text-gray-400"
            }`}>
              Push to GitHub, pull locally
            </p>
            <div className="font-mono text-xs space-y-2">
              <div className={`flex items-center gap-2 transition-colors ${
                activeStep === 4 ? "text-gray-300" : "text-gray-600"
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>github.com/username/my-app</span>
              </div>
              <div className={`space-y-1 transition-colors ${
                activeStep === 4 ? "text-gray-300" : "text-gray-600"
              }`}>
                <div>git pull origin main</div>
                <div>npm install</div>
                <div>docker compose up</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default HowItWorks;
