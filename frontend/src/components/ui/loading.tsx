"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizes = {
  sm: { width: 80, image: 48 },
  md: { width: 100, image: 64 },
  lg: { width: 140, image: 80 },
};

function HorizontalLoader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const { theme } = useTheme();
  const s = sizes[size];
  const llamaSrc = theme === 'dark' ? '/hero-llama-white.png' : '/hero-llama.png';
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-bounce-slow">
        <Image
          src={llamaSrc}
          alt="Loading"
          width={s.image}
          height={s.image * 1.25}
          className="object-contain object-top"
        />
      </div>
      
      {/* Horizontal progress bar */}
      <div className={`h-1 bg-border rounded-full overflow-hidden`} style={{ width: s.width }}>
        <div className="h-full bg-[#FFCC00] rounded-full animate-progress" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md", fullScreen = false }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md z-50 gap-6">
        <HorizontalLoader size="lg" />
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return <HorizontalLoader size={size} />;
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
      <HorizontalLoader size="lg" />
      <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-[#132A4B] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
    </div>
  );
}