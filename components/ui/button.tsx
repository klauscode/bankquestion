import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[#050816]",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_14px_30px_rgba(34,211,238,0.28)] hover:from-cyan-300 hover:to-blue-400 focus-visible:ring-cyan-400",
        secondary:
          "bg-white/[0.04] text-slate-100 shadow-sm ring-1 ring-white/10 hover:bg-white/[0.08] hover:ring-cyan-400/20 focus-visible:ring-cyan-400",
        ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white focus-visible:ring-cyan-400",
        destructive: "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-600",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
