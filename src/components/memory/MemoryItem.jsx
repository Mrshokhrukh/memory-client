"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { reactToMemory, addComment, deleteMemory, pinMemory } from "../../store/slices/memorySlice"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import Card from "../ui/Card"
import EmojiPicker from "./EmojiPicker"
import { formatRelativeTime } from "../../utils/helpers"
import toast from "react-hot-toast"

const MemoryItem = ({ memory }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { currentCapsule } = useSelector((state) => state.capsules)

  const [showComments, setShowComments] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  const isAuthor = memory.author._id === user._id
  const isOwner = currentCapsule?.owner._id === user._id
  const isAdmin = currentCapsule?.contributors?.some((c) => c.user._id === user._id && c.role === "admin")

  const canDelete = isAuthor || isOwner || isAdmin
  const canPin = isOwner || isAdmin

  const handleReaction = async (emoji) => {
    await dispatch(reactToMemory({ memoryId: memory._id, emoji }))
    setShowEmojiPicker(false)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setSubmittingComment(true)
    await dispatch(addComment({ memoryId: memory._id, text: commentText.trim() }))
    setCommentText("")
    setSubmittingComment(false)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      const result = await dispatch(deleteMemory(memory._id))
      if (deleteMemory.fulfilled.match(result)) {
        toast.success("Memory deleted successfully")
      }
    }
  }

  const handlePin = async () => {
    await dispatch(pinMemory(memory._id))
    toast.success(memory.isPinned ? "Memory unpinned" : "Memory pinned")
  }

  const renderMedia = () => {
    switch (memory.type) {
      case "image":
        return (
          <img
            src={memory.mediaUrl || "/placeholder.svg"}
            alt={memory.title}
            className="w-full rounded-lg object-cover max-h-96"
          />
        )
      case "video":
        return (
          <video src={memory.mediaUrl} poster={memory.thumbnailUrl} controls className="w-full rounded-lg max-h-96" />
        )
      case "audio":
        return (
          <div className="bg-gray-100 rounded-lg p-4">
            <audio src={memory.mediaUrl} controls className="w-full" />
          </div>
        )
      case "voice":
        return (
          <div className="bg-primary-50 rounded-lg p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <audio src={memory.mediaUrl} controls className="w-full" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getReactionCounts = () => {
    const counts = {}
    memory.reactions?.forEach((reaction) => {
      counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1
    })
    return counts
  }

  const hasUserReacted = (emoji) => {
    return memory.reactions?.some((r) => r.user._id === user._id && r.emoji === emoji)
  }

  return (
    <Card className="memory-item">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar src={memory.author.avatarUrl} alt={memory.author.name} />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{memory.author.name}</h3>
              {memory.isPinned && (
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500">{formatRelativeTime(memory.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {canPin && (
            <Button variant="ghost" size="small" onClick={handlePin}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </Button>
          )}
          {canDelete && (
            <Button variant="ghost" size="small" onClick={handleDelete}>
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Title */}
      {memory.title && <h4 className="text-lg font-medium text-gray-900 mb-2">{memory.title}</h4>}

      {/* Text Content */}
      {memory.text && <p className="text-gray-700 mb-4 whitespace-pre-wrap">{memory.text}</p>}

      {/* Media */}
      {memory.mediaUrl && <div className="mb-4">{renderMedia()}</div>}

      {/* Tags */}
      {memory.tags && memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {memory.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-4">
          {/* Reaction counts */}
          <div className="flex items-center space-x-2">
            {Object.entries(getReactionCounts()).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors ${
                  hasUserReacted(emoji)
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>

          {/* Add reaction */}
          <div className="relative">
            <Button variant="ghost" size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
            {showEmojiPicker && (
              <EmojiPicker onEmojiSelect={handleReaction} onClose={() => setShowEmojiPicker(false)} />
            )}
          </div>
        </div>

        {/* Comment toggle */}
        <Button variant="ghost" size="small" onClick={() => setShowComments(!showComments)}>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {memory.comments?.length || 0} comments
        </Button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-gray-100 pt-4 mt-4">
          {/* Comment form */}
          <form onSubmit={handleComment} className="flex space-x-3 mb-4">
            <Avatar src={user.avatarUrl} alt={user.name} size="small" />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" size="small" loading={submittingComment} disabled={!commentText.trim()}>
                  Comment
                </Button>
              </div>
            </div>
          </form>

          {/* Comments list */}
          <div className="space-y-3">
            {memory.comments?.map((comment) => (
              <div key={comment._id} className="flex space-x-3">
                <Avatar src={comment.user.avatarUrl} alt={comment.user.name} size="small" />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                      <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default MemoryItem
