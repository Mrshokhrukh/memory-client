"use client"
import LoadingSpinner from "./LoadingSpinner"

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantClasses = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-primary-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
  }

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading && <LoadingSpinner size="small" className="mr-2" />}
      {children}
    </button>
  )
}

export default Button
