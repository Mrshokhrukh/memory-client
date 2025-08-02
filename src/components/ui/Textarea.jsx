import { forwardRef } from "react"

const Textarea = forwardRef(({ label, error, rows = 3, className = "", containerClassName = "", ...props }, ref) => {
  return (
    <div className={`${containerClassName}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-primary-500 focus:border-primary-500
            disabled:bg-gray-50 disabled:text-gray-500 resize-vertical
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${className}
          `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
})

Textarea.displayName = "Textarea"

export default Textarea
