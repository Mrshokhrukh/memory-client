const Card = ({ children, className = "", padding = "medium", hover = false, variant = "default", ...props }) => {
  const paddingClasses = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
    xl: "p-10",
  }

  const variantClasses = {
    default: "bg-white border border-neutral-200",
    elevated: "bg-white border border-neutral-200 shadow-soft",
    glass: "bg-white/80 backdrop-blur-sm border border-neutral-200/50",
    gradient: "bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200",
  }

  return (
    <div
      className={`
        rounded-xl transition-all duration-300
        ${paddingClasses[padding]}
        ${variantClasses[variant]}
        ${hover ? "card-hover" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
