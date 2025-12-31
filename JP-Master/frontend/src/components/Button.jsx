export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    ...props
}) {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg disabled:bg-green-400',
        secondary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg disabled:bg-blue-400',
        ghost: 'bg-transparent text-green-600 border-2 border-green-600 hover:bg-green-50 focus:ring-green-500 disabled:border-gray-400 disabled:text-gray-400',
        outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:border-gray-400 disabled:text-gray-400',
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
