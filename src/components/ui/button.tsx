import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950",
  {
    variants: {
      variant: {
        default: "bg-white hover:bg-slate-200",
        destructive:
          "bg-red-500 text-zinc-50 hover:bg-red-500/90",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        link: "text-zinc-900 underline-offset-4 hover:underline",
        dark: "bg-zinc-950 text-zinc-50 hover:bg-zinc-950/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        rounded: "h-10 py-4 px-2",
        sm: "h-9 rounded-md px-3",
        xs: "h-7 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
