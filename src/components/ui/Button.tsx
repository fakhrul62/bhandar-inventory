import { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost" | "default";
  size?: "icon" | "sm" | "default" | "lg";
  asChild?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-neutral-950 text-white hover:bg-neutral-800",
  primary: "bg-neutral-950 text-white hover:bg-neutral-800",
  secondary: "bg-[#d4af37] text-neutral-950 hover:bg-[#c9a42f]",
  outline: "border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-950 hover:bg-neutral-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  icon: "h-10 w-10 p-0",
  sm: "px-3 py-1.5 text-sm",
  default: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

export function Button({
  variant = "default",
  size = "default",
  className = "",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
