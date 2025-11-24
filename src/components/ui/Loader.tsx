"use client";
import React from "react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "spinner",
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (variant === "spinner") {
    return (
      <div
        className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={`flex gap-1 ${className}`}>
        <div
          className={`${
            size === "sm"
              ? "w-1.5 h-1.5"
              : size === "md"
              ? "w-2 h-2"
              : "w-3 h-3"
          } bg-current rounded-full animate-bounce [animation-delay:-0.3s]`}
        />
        <div
          className={`${
            size === "sm"
              ? "w-1.5 h-1.5"
              : size === "md"
              ? "w-2 h-2"
              : "w-3 h-3"
          } bg-current rounded-full animate-bounce [animation-delay:-0.15s]`}
        />
        <div
          className={`${
            size === "sm"
              ? "w-1.5 h-1.5"
              : size === "md"
              ? "w-2 h-2"
              : "w-3 h-3"
          } bg-current rounded-full animate-bounce`}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={`${sizes[size]} bg-current rounded-full animate-pulse ${className}`}
      />
    );
  }

  return null;
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`animate-shimmer bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  );
};
