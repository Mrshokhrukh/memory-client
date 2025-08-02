const Avatar = ({ src, alt, size = "medium", className = "", fallback }) => {
  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-base",
    large: "w-12 h-12 text-lg",
    xlarge: "w-16 h-16 text-xl",
  }

  const getFallbackText = () => {
    if (fallback) return fallback
    if (alt) {
      return alt
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return "?"
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-300 flex items-center justify-center ${className}`}
    >
      {src ? (
        <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-gray-600">{getFallbackText()}</span>
      )}
    </div>
  )
}

export default Avatar
