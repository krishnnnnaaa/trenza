
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function InitialLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);

 
useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling while the loader is visible
  const timer = window.setTimeout(() => {
    setVisible(false);
    document.body.style.overflow = "auto"; // Restore scrolling after the loader is hidden
}, 2000);

return () => {
    window.clearTimeout(timer);
    document.body.style.overflow = "auto"; // Restore scrolling after the loader is hidden
  };
}, []);


  return (
    <>
      {children}

      {visible && (
        <div
          role="status"
          aria-label="Loading Trenza"
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#faf9f6]"
        >
          <div className="flex flex-col items-center  animate-fade">
            <Image src="/logo.png" alt="Trenza Logo" width={200} height={200} />

            <p className="mt-4 text-xs tracking-widest text-[#85857c]">
              PREPARING YOUR EXPERIENCE
            </p>
          </div>
        </div>
      )}
    </>
  );
}
