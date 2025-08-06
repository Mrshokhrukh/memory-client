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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-neutral-600 text-lg">
                Here's what's happening with your memory capsules
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow animate-float">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slideUp">
          <Card variant="elevated" className="text-center group hover:shadow-glow transition-all duration-300">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">{stats.totalCapsules}</div>
            <div className="text-sm text-neutral-600">Memory Capsules</div>
          </Card>
          
          <Card variant="elevated" className="text-center group hover:shadow-glow transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors duration-300">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-secondary-600 mb-2">{stats.totalMemories}</div>
            <div className="text-sm text-neutral-600">Total Memories</div>
          </Card>
          
          <Card variant="elevated" className="text-center group hover:shadow-glow transition-all duration-300">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-success-200 transition-colors duration-300">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-success-600 mb-2">{stats.totalContributors}</div>
            <div className="text-sm text-neutral-600">Contributors</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Capsules */}
          <div className="lg:col-span-2 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Your Capsules</h2>
              <Link to="/capsules">
                <Button variant="outline" size="small" className="group">
                  View All
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>

            {capsulesLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : capsules.length === 0 ? (
              <Card variant="gradient" className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">No capsules yet</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Create your first memory capsule to start preserving and sharing your precious moments
                </p>
                <Link to="/create-capsule">
                  <Button size="large" className="group">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Your First Capsule
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {capsules.slice(0, 4).map((capsule, index) => (
                  <Link key={capsule._id} to={`/capsule/${capsule._id}`}>
                    <Card 
                      hover 
                      variant="elevated" 
                      className="h-full group animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                            {capsule.title}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2">{capsule.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${
                            capsule.type === "public"
                              ? "bg-success-100 text-success-700"
                              : capsule.type === "private"
                                ? "bg-primary-100 text-primary-700"
                                : "bg-secondary-100 text-secondary-700"
                          }`}
                        >
                          {capsule.type}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {capsule.stats?.totalMemories || 0}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            {capsule.contributors?.length || 0}
                          </span>
                        </div>
                        <span className="text-xs">{formatRelativeTime(capsule.stats?.lastActivity || capsule.createdAt)}</span>
                      </div>

                      <div className="flex items-center -space-x-2">
                        {capsule.contributors?.slice(0, 3).map((contributor, index) => (
                          <Avatar
                            key={contributor.user._id}
                            src={contributor.user.avatarUrl}
                            alt={contributor.user.name}
                            size="small"
                            className="border-2 border-white ring-2 ring-neutral-100"
                          />
                        ))}
                        {capsule.contributors?.length > 3 && (
                          <div className="w-8 h-8 bg-neutral-200 rounded-full border-2 border-white ring-2 ring-neutral-100 flex items-center justify-center text-xs text-neutral-600 font-medium">
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
          <div className="space-y-6 animate-slideUp">
            {/* Quick Actions */}
            <Card variant="elevated">
              <h3 className="font-bold text-neutral-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="space-y-3">
                {[
                  { path: "/create-capsule", label: "Create New Capsule", icon: "M12 4v16m8-8H4", color: "primary" },
                  { path: "/explore", label: "Explore Public Capsules", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", color: "secondary" },
                  { path: "/profile", label: "Edit Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "accent" }
                ].map((action) => (
                  <Link key={action.path} to={action.path} className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start group hover:bg-neutral-50"
                    >
                      <div className={`w-8 h-8 bg-${action.color}-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-${action.color}-200 transition-colors duration-200`}>
                        <svg className={`w-4 h-4 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                        </svg>
                      </div>
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated">
              <h3 className="font-bold text-neutral-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {capsules.slice(0, 3).map((capsule, index) => (
                  <div key={capsule._id} className="flex items-center space-x-3 group">
                    <div className="w-2 h-2 bg-primary-500 rounded-full group-hover:bg-primary-600 transition-colors duration-200"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-900 truncate font-medium">{capsule.title}</p>
                      <p className="text-xs text-neutral-500">
                        {formatRelativeTime(capsule.stats?.lastActivity || capsule.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {capsules.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-neutral-500">No recent activity</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
