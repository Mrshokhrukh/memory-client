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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500 shadow-soft hover:shadow-medium",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500 shadow-soft hover:shadow-medium",
    accent: "bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500 shadow-soft hover:shadow-medium",
    outline: "border-2 border-neutral-300 hover:border-neutral-400 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-500",
    ghost: "hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 focus:ring-neutral-500",
    danger: "bg-error-500 hover:bg-error-600 text-white focus:ring-error-500 shadow-soft hover:shadow-medium",
    success: "bg-success-500 hover:bg-success-600 text-white focus:ring-success-500 shadow-soft hover:shadow-medium",
    warning: "bg-warning-500 hover:bg-warning-600 text-white focus:ring-warning-500 shadow-soft hover:shadow-medium",
  }

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "button-hover"}
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
