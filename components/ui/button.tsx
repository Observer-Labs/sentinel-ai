import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF4444] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-[#EF4444] text-white hover:bg-[#DC2626]',
        outline:     'border border-[#334155] bg-transparent text-[#F1F5F9] hover:bg-[#1E293B]',
        ghost:       'bg-transparent text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F1F5F9]',
        destructive: 'bg-[#991B1B] text-white hover:bg-[#7F1D1D]',
        secondary:   'bg-[#1E293B] text-[#F1F5F9] hover:bg-[#334155]',
        link:        'text-[#EF4444] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 min-h-touch px-4 py-2 rounded-btn text-body',
        sm:      'h-9 min-h-touch px-3 rounded-btn text-body',
        lg:      'h-12 min-h-touch px-6 rounded-btn text-body',
        icon:    'h-11 w-11 min-h-touch min-w-touch rounded-btn',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
