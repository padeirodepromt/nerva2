/* src/components/icons/BrandCodeLogo.jsx
   desc: BrandCode Mark V1 (Organic + Vibrant)
   use : <BrandCodeLogo className="w-6 h-6" tone="indigo" />
*/

import React from "react";
import { cn } from "@/lib/utils";

export default function BrandCodeLogo({
  className,
  tone = "indigo", // indigo | emerald | amber | neutral
  ...props
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "amber"
        ? "text-amber-300"
        : tone === "neutral"
          ? "text-zinc-200"
          : "text-indigo-300";

  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("inline-block", toneClass, className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BrandCode"
      {...props}
    >
      {/* Halo orgânico */}
      <path
        d="M32 7C18.2 7 7 18.2 7 32s11.2 25 25 25 25-11.2 25-25S45.8 7 32 7Z"
        stroke="currentColor"
        strokeOpacity="0.22"
        strokeWidth="2"
      />

      {/* “DNA” minimal: duas curvas que se cruzam (vivo, não tech demais) */}
      <path
        d="M22 18c10 0 20 28 20 28s-6 0-10-6c-4-6-6-22-10-22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />
      <path
        d="M42 18c-10 0-20 28-20 28s6 0 10-6c4-6 6-22 10-22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.72"
      />

      {/* “Genes” */}
      <path
        d="M25 26h14"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M23 34h18"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 42h14"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Ponto “vital” */}
      <circle cx="32" cy="16" r="2.2" fill="currentColor" opacity="0.55" />
    </svg>
  );
}