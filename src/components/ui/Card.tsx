import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-neutral-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,15,15,0.06)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
