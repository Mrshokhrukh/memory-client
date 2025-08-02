"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchCapsules } from "../store/slices/capsuleSlice"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Avatar from "../components/ui/Avatar"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { formatRelativeTime } from "../utils/helpers"

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { capsules, loading: capsulesLoading } = useSelector((state) => state.capsules)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    dispatch(fetchCapsules({ limit: 6 }))
  }, [dispatch])

  const stats = {
    totalCapsules: capsules.length,
    totalMemories: capsules.reduce((sum, capsule) => sum + (capsule.stats?.totalMemories || 0), 0),
    totalContributors: new Set(capsules.flatMap((capsule) => capsule.contributors?.map((c) => c.user._id) || [])).size,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your memory capsules</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">{stats.totalCapsules}</div>
            <div className="text-sm text-gray-600">Memory Capsules</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-secondary-600 mb-2">{stats.totalMemories}</div>
            <div className="text-sm text-gray-600">Total Memories</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-success-600 mb-2">{stats.totalContributors}</div>
            <div className="text-sm text-gray-600">Contributors</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Capsules */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Capsules</h2>
              <Link to="/capsules">
                <Button variant="outline" size="small">
                  View All
                </Button>
              </Link>
            </div>

            {capsulesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="large" />
              </div>
            ) : capsules.length === 0 ? (
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No capsules yet</h3>
                <p className="text-gray-600 mb-4">Create your first memory capsule to get started</p>
                <Link to="/create-capsule">
                  <Button>Create Your First Capsule</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {capsules.slice(0, 4).map((capsule) => (
                  <Link key={capsule._id} to={`/capsule/${capsule._id}`}>
                    <Card hover className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{capsule.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{capsule.description}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            capsule.type === "public"
                              ? "bg-green-100 text-green-800"
                              : capsule.type === "private"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {capsule.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{capsule.stats?.totalMemories || 0} memories</span>
                          <span>{capsule.contributors?.length || 0} contributors</span>
                        </div>
                        <span>{formatRelativeTime(capsule.stats?.lastActivity || capsule.createdAt)}</span>
                      </div>

                      <div className="flex items-center mt-4 -space-x-2">
                        {capsule.contributors?.slice(0, 3).map((contributor, index) => (
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
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/create-capsule" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Capsule
                  </Button>
                </Link>
                <Link to="/explore" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Explore Public Capsules
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {capsules.slice(0, 3).map((capsule) => (
                  <div key={capsule._id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{capsule.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(capsule.stats?.lastActivity || capsule.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {capsules.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
