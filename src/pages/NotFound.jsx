import { Link } from "react-router-dom"
import Button from "../components/ui/Button"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
