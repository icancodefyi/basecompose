"use client";

const FinalCTA = () => {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="w-full max-w-7xl mx-auto py-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto px-4 sm:px-2">
          <p className="text-xs uppercase tracking-wider text-gray-600 mb-6">Ready to ship</p>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.2] mb-6">
            Stop boilerplating. Start shipping.
          </h2>
          
          <p className="text-sm sm:text-base text-gray-400 font-light mb-8 leading-relaxed max-w-2xl">
            Your stack. Your repo. Five minutes from now. Let Layered generate everything so you can focus on what makes your app different.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full">
            <a
              href="https://github.com/icancodefyi/layered"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded border border-emerald-500/60 text-emerald-400 hover:border-emerald-400 hover:bg-emerald-950/30 transition-all text-xs sm:text-sm font-medium w-full sm:w-auto text-center"
            >
              Explore on GitHub
            </a>
            <a
              href="/chat"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded bg-emerald-600 text-white hover:bg-emerald-500 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto text-center"
            >
              Generate Your Setup
            </a>
          </div>

          <p className="text-xs text-gray-600 mt-8">
            MIT License. Open source. Contribute anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
