import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2 py-0.5 font-sans text-body font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
        secondary:   'border-[#334155] bg-[#334155] text-[#94A3B8]',
        outline:     'border-[#334155] text-[#94A3B8]',
        success:     'border-green-500/30 bg-green-500/10 text-green-400',
        warning:     'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]',
        destructive: 'border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
