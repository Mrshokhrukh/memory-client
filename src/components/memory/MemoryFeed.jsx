"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMemories } from "../../store/slices/memorySlice"
import MemoryItem from "./MemoryItem"
import LoadingSpinner from "../ui/LoadingSpinner"
import Button from "../ui/Button"

const MemoryFeed = ({ memories, loading, capsuleId }) => {
  const dispatch = useDispatch()
  const { pagination } = useSelector((state) => state.memories)
  const [loadingMore, setLoadingMore] = useState(false)

  const handleLoadMore = async () => {
    if (pagination.page < pagination.pages) {
      setLoadingMore(true)
      await dispatch(
        fetchMemories({
          capsuleId,
          page: pagination.page + 1,
          limit: pagination.limit,
        }),
      )
      setLoadingMore(false)
    }
  }

  if (loading && memories.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
        <p className="text-gray-600">Be the first to add a memory to this capsule!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {memories.map((memory) => (
        <MemoryItem key={memory._id} memory={memory} />
      ))}

      {pagination.page < pagination.pages && (
        <div className="text-center py-6">
          <Button variant="outline" onClick={handleLoadMore} loading={loadingMore}>
            Load More Memories
          </Button>
        </div>
      )}
    </div>
  )
}

export default MemoryFeed
