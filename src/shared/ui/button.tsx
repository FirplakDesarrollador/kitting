import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary: 'bg-[#2a4a54] hover:bg-[#1e3940] text-white shadow-sm hover:shadow-md',
            secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
            outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
            ghost: 'hover:bg-gray-100 text-gray-700',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-sm rounded-md',
            md: 'px-4 py-2.5 text-sm rounded-lg',
            lg: 'px-6 py-3.5 text-base rounded-full',
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {children}
                    </span>
                ) : children}
            </button>
        )
    }
)

Button.displayName = 'Button'
