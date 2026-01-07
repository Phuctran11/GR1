export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const baseClasses = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-100 shadow-md hover:shadow-lg disabled:bg-brand-200',
        secondary: 'bg-slate-700 text-white hover:bg-slate-800 focus:ring-slate-200 shadow-md hover:shadow-lg disabled:bg-slate-400',
        correct: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-200 shadow-md hover:shadow-lg disabled:bg-emerald-300',
        incorrect: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 shadow-md hover:shadow-lg disabled:bg-red-300',
        ghost: 'bg-transparent text-brand-500 border-2 border-brand-500 hover:bg-brand-50 focus:ring-brand-100 disabled:border-gray-300 disabled:text-gray-400',
        outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50 focus:ring-brand-100 disabled:border-gray-300 disabled:text-gray-400',
    }

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
    }

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}
