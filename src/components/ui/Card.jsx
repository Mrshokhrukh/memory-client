const Card = ({ children, className = "", padding = "medium", hover = false, ...props }) => {
  const paddingClasses = {
    none: "",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  }

  return (
    <div
      className={`
        bg-white rounded-lg shadow-soft border border-gray-200
        ${paddingClasses[padding]}
        ${hover ? "hover:shadow-medium transition-shadow duration-200" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
