import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Varianten + Größen
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md border text-sm font-medium shadow-sm hover:bg-gray-200 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 bg-gray-100 text-black",
        outline: "border-gray-300 bg-transparent text-black",
        destructive: "bg-red-500 text-white hover:bg-red-600 border-red-500",
        ghost: "border-transparent bg-transparent text-black hover:bg-gray-100",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-2 py-1 text-xs",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
