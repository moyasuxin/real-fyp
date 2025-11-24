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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="glass border-white/30 text-white p-8 rounded-2xl shadow-2xl w-[380px] text-center space-y-4 animate-scale-in">
        <div className="w-24 h-24 mx-auto">
          {animationData ? (
            <Lottie animationData={animationData} loop autoplay />
          ) : (
            <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>

        <h2 className="text-xl font-semibold text-white">
          Machine Learning Process
        </h2>
        <p className="text-white/80">{stage}</p>
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full animate-pulse"
            style={{ width: stage.includes("✅") ? "100%" : "60%" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
