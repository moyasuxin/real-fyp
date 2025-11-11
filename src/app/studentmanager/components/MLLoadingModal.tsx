"use client";
import React from "react";
import Lottie from "lottie-react";

interface MLLoadingModalProps {
  show: boolean;
  stage: string;
}

export default function MLLoadingModal({ show, stage }: MLLoadingModalProps) {
  if (!show) return null;

  // 🌀 You can replace this URL with any Lottie animation you like from lottiefiles.com
  const loadingAnimation =
    "https://assets5.lottiefiles.com/packages/lf20_usmfx6bp.json";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-2xl w-[340px] text-center space-y-4">
        <div className="w-24 h-24 mx-auto">
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
        <h2 className="text-xl font-semibold">Machine Learning Process</h2>
        <p className="text-gray-300">{stage}</p>
      </div>
    </div>
  );
}
