//src/app/studentmanager/components/MLLoadingModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface MLLoadingModalProps {
  show: boolean;
  stage: string;
}

// Type-safe Lottie JSON
type LottieJSON = Record<string, unknown>;

export default function MLLoadingModal({ show, stage }: MLLoadingModalProps) {
  const [animationData, setAnimationData] = useState<LottieJSON | null>(null);

  useEffect(() => {
    if (!show) return;

    const loadAnimation = async () => {
      try {
        // Alternative working Lottie animation URL
        const res = await fetch(
          "https://assets5.lottiefiles.com/packages/lf20_p8bfn5to.json"
        );

        if (!res.ok) {
          console.error("Lottie fetch failed:", res.status);
          return;
        }

        const json: LottieJSON = await res.json();
        setAnimationData(json);
      } catch (err) {
        console.error("Failed to load Lottie animation", err);
      }
    };

    loadAnimation();
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-2xl w-[340px] text-center space-y-4">
        <div className="w-24 h-24 mx-auto">
          {animationData ? (
            <Lottie animationData={animationData} loop autoplay />
          ) : (
            <div className="animate-pulse text-gray-400">Loading ML...</div>
          )}
        </div>

        <h2 className="text-xl font-semibold">Machine Learning Process</h2>
        <p className="text-gray-300">{stage}</p>
      </div>
    </div>
  );
}
