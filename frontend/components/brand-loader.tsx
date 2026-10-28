
export function BrandLoader() {
  return (
    <div
      role="status"
      aria-label="Loading Trenza"
      className="fixed inset-0 z-9999 flex min-h-screen items-center justify-center bg-[#faf9f6]"
    >
      <div className="flex flex-col items-center">
        {/* Brand mark */}
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border border-[#c6a56b]/40 rotate-45" />

          <span className="font-serif text-5xl text-[#303629]">
            T
          </span>

          <span className="absolute right-1 top-0 text-lg text-[#b99a62]">
            ✦
          </span>
        </div>

        {/* Wordmark */}
        <h1 className="font-serif text-4xl tracking-[0.22em] text-[#303629]">
          TRENZA
        </h1>

        <p className="mt-2 text-[10px] tracking-[0.35em] text-[#77796f]">
          ELEVATE YOUR EVERYDAY
        </p>

        {/* Loading indicator */}
        <div className="mt-10 h-0.5 w-36 overflow-hidden rounded-full bg-[#e8e4db]">
      <div className="h-full w-1/3 animate-pulse rounded-full bg-[#b99a62]" />
        </div>

        <p className="mt-4 text-xs tracking-widest text-[#85857c]">
          PREPARING YOUR EXPERIENCE
        </p>
      </div>
    </div>
  );
}
