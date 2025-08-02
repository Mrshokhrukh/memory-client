"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchCapsules } from "../store/slices/capsuleSlice"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Avatar from "../components/ui/Avatar"
import { formatRelativeTime } from "../utils/helpers"

const Capsules = () => {
  const dispatch = useDispatch()
  const { capsules, loading, pagination } = useSelector((state) => state.capsules)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    dispatch(fetchCapsules())
  }, [dispatch])

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch =
      capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      capsule.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || capsule.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type) => {
    switch (type) {
      case "public":
        return "bg-green-100 text-green-800"
      case "private":
        return "bg-blue-100 text-blue-800"
      case "timed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Capsules</h1>
            <p className="text-gray-600 mt-2">Manage all your memory capsules</p>
          </div>
          <Link to="/create-capsule">
            <Button>Create New Capsule</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search capsules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="timed">Timed</option>
          </select>
        </div>

        {/* Capsules Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredCapsules.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No capsules found" : "No capsules yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Create your first memory capsule to get started"}
            </p>
            {!searchTerm && (
              <Link to="/create-capsule">
                <Button>Create Your First Capsule</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapsules.map((capsule) => (
              <Link key={capsule._id} to={`/capsule/${capsule._id}`}>
                <Card hover className="h-full">
                  {/* Cover Image */}
                  {capsule.coverImage && (
                    <img
                      src={capsule.coverImage || "/placeholder.svg"}
                      alt={capsule.title}
                      className="w-full h-48 object-cover rounded-t-lg -m-6 mb-4"
                    />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{capsule.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{capsule.description}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(capsule.type)}`}>
                      {capsule.type}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span>{capsule.stats?.totalMemories || 0} memories</span>
                      <span>{capsule.contributors?.length || 0} contributors</span>
                    </div>
                    <span>{formatRelativeTime(capsule.stats?.lastActivity || capsule.createdAt)}</span>
                  </div>

                  {/* Contributors */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-2">
                      <Avatar
                        src={capsule.owner.avatarUrl}
                        alt={capsule.owner.name}
                        size="small"
                        className="border-2 border-white ring-2 ring-yellow-400"
                      />
                      {capsule.contributors?.slice(0, 3).map((contributor) => (
                        <Avatar
                          key={contributor.user._id}
                          src={contributor.user.avatarUrl}
                          alt={contributor.user.name}
                          size="small"
                          className="border-2 border-white"
                        />
                      ))}
                      {capsule.contributors?.length > 3 && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                          +{capsule.contributors.length - 3}
                        </div>
                      )}
                    </div>

                    {capsule.type === "timed" && capsule.releaseDate && new Date() < new Date(capsule.releaseDate) && (
                      <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        Opens {formatRelativeTime(capsule.releaseDate)}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Capsules
