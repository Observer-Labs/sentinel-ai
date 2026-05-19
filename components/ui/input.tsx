import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 min-h-touch w-full rounded-input border border-[#1E293B] bg-[#1E293B] px-4 py-2',
          'font-sans text-body text-[#F1F5F9] placeholder:text-[#64748B]',
          'focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
