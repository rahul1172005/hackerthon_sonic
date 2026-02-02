import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        physical:
          "relative h-[56px] px-12 rounded-full bg-[#0d0d0d] border-none cursor-pointer overflow-hidden shadow-[0_0_0_1.5px_rgba(255,255,255,0.1),0_28px_56px_rgba(0,0,0,0.75),inset_0_0.5px_1px_rgba(255,255,255,0.06)] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[6px] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.15),0_36px_72px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.1)] active:translate-y-[1px] active:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_16px_32px_rgba(0,0,0,0.7)] before:content-[''] before:absolute before:inset-[0.5px] before:rounded-full before:bg-gradient-to-b before:from-white/[0.18] before:via-white/[0.04] before:via-35% before:to-transparent before:to-70% before:z-[1] before:pointer-events-none after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-[linear-gradient(140deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.03)_45%,rgba(255,255,255,0.45)_100%)] after:p-[0.5px] after:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:[mask-composite:exclude] after:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] after:[-webkit-mask-composite:xor] after:pointer-events-none after:z-[4] after:opacity-80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {variant === "physical" && !asChild ? (
        <>
          <span className="relative z-[5] text-white font-medium text-[15px] tracking-[0.4px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] [text-shadow:0_0_20px_rgba(255,255,255,0.15)]">{children}</span>
          <span className="absolute inset-0 rounded-full z-[2] opacity-95 mix-blend-screen">
            <span className="absolute inset-0 bg-[radial-gradient(ellipse_150px_75px_at_65%_48%,rgba(255,255,255,0.42),rgba(255,255,255,0.08)_50%,transparent_68%)] blur-[10px]" />
            <span className="absolute top-[28%] right-[22%] w-[4px] h-[4px] bg-white/70 rounded-full blur-[0.5px] shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
            <span className="absolute top-[42%] right-[28%] w-[5px] h-[5px] bg-white/50 rounded-full blur-[1.5px] shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <span className="absolute top-[58%] right-[32%] w-[3px] h-[3px] bg-white/60 rounded-full blur-[1px] shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
            <span className="absolute top-[35%] right-[38%] w-[2px] h-[2px] bg-white/40 rounded-full blur-[1px] shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
            <span className="absolute top-[50%] right-[42%] w-[2px] h-[2px] bg-white/35 rounded-full blur-[1.5px]" />
          </span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
