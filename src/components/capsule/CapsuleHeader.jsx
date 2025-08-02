"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import { formatRelativeTime, copyToClipboard, generateInviteLink } from "../../utils/helpers"
import toast from "react-hot-toast"

const CapsuleHeader = ({ capsule, onCreateMemory }) => {
  const { user } = useSelector((state) => state.auth)
  const [showInvite, setShowInvite] = useState(false)

  const isOwner = capsule.owner._id === user._id
  const canContribute = capsule.contributors?.some((c) => c.user._id === user._id) || isOwner

  const handleCopyInvite = async () => {
    const inviteLink = generateInviteLink(capsule._id, capsule.inviteCode)
    const success = await copyToClipboard(inviteLink)
    if (success) {
      toast.success("Invite link copied to clipboard!")
    } else {
      toast.error("Failed to copy invite link")
    }
  }

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
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{capsule.title}</h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(capsule.type)}`}>
                {capsule.type}
              </span>
            </div>

            {capsule.description && <p className="text-gray-600 mb-4">{capsule.description}</p>}

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{capsule.stats?.totalMemories || 0} memories</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{capsule.contributors?.length || 0} contributors</span>
              </div>
              <span>Created {formatRelativeTime(capsule.createdAt)}</span>
            </div>

            {/* Contributors */}
            <div className="flex items-center mt-4">
              <div className="flex -space-x-2 mr-3">
                <Avatar
                  src={capsule.owner.avatarUrl}
                  alt={capsule.owner.name}
                  size="small"
                  className="border-2 border-white ring-2 ring-yellow-400"
                />
                {capsule.contributors?.slice(0, 4).map((contributor) => (
                  <Avatar
                    key={contributor.user._id}
                    src={contributor.user.avatarUrl}
                    alt={contributor.user.name}
                    size="small"
                    className="border-2 border-white"
                  />
                ))}
                {capsule.contributors?.length > 4 && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                    +{capsule.contributors.length - 4}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">{capsule.owner.name}</span> (owner)
                {capsule.contributors?.length > 0 && (
                  <>
                    {" "}
                    and {capsule.contributors.length} other{capsule.contributors.length !== 1 ? "s" : ""}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {canContribute && (
              <Button onClick={onCreateMemory}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Memory
              </Button>
            )}

            {(isOwner || capsule.type === "public") && (
              <Button variant="outline" onClick={handleCopyInvite}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CapsuleHeader
