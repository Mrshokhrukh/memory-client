"use client"

import { useState } from "react"
import Button from "../ui/Button"
import LoadingSpinner from "../ui/LoadingSpinner"
import api from "../../services/api"
import toast from "react-hot-toast"

const AIAssistant = ({ text, onTitleGenerated, onTextEnhanced, onTagsGenerated, onMoodAnalyzed }) => {
  const [loading, setLoading] = useState({
    title: false,
    enhance: false,
    tags: false,
    mood: false,
  })

  const handleGenerateTitle = async () => {
    if (!text || text.trim().length === 0) {
      toast.error("Please add some content first")
      return
    }

    setLoading({ ...loading, title: true })

    try {
      const response = await api.post("/ai/generate-title", { text })
      const { title } = response.data.data

      if (onTitleGenerated) {
        onTitleGenerated(title)
      }

      toast.success("Title generated!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate title")
    } finally {
      setLoading({ ...loading, title: false })
    }
  }

  const handleEnhanceText = async () => {
    if (!text || text.trim().length === 0) {
      toast.error("Please add some content first")
      return
    }

    if (text.length > 2000) {
      toast.error("Text too long for enhancement (max 2000 characters)")
      return
    }

    setLoading({ ...loading, enhance: true })

    try {
      const response = await api.post("/ai/enhance-text", { text })
      const { enhancedText } = response.data.data

      if (onTextEnhanced) {
        onTextEnhanced(enhancedText)
      }

      toast.success("Text enhanced!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enhance text")
    } finally {
      setLoading({ ...loading, enhance: false })
    }
  }

  const handleGenerateTags = async (existingTags = []) => {
    if (!text || text.trim().length === 0) {
      toast.error("Please add some content first")
      return
    }

    setLoading({ ...loading, tags: true })

    try {
      const response = await api.post("/ai/generate-tags", { text, existingTags })
      const { tags } = response.data.data

      if (onTagsGenerated) {
        onTagsGenerated(tags)
      }

      toast.success(`Generated ${tags.length} tags!`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate tags")
    } finally {
      setLoading({ ...loading, tags: false })
    }
  }

  const handleAnalyzeMood = async () => {
    if (!text || text.trim().length === 0) {
      toast.error("Please add some content first")
      return
    }

    setLoading({ ...loading, mood: true })

    try {
      const response = await api.post("/ai/analyze-mood", { text })
      const { mood } = response.data.data

      if (onMoodAnalyzed) {
        onMoodAnalyzed(mood)
      }

      toast.success(`Mood detected: ${mood}`)
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to analyze mood")
    } finally {
      setLoading({ ...loading, mood: false })
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">🤖</span>
        </div>
        <h3 className="font-semibold text-gray-900">AI Assistant</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">Let AI help enhance your memory with smart suggestions</p>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="small"
          onClick={handleGenerateTitle}
          disabled={loading.title || !text}
          className="text-xs bg-transparent"
        >
          {loading.title ? <LoadingSpinner size="small" /> : "✨ Generate Title"}
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={handleEnhanceText}
          disabled={loading.enhance || !text}
          className="text-xs bg-transparent"
        >
          {loading.enhance ? <LoadingSpinner size="small" /> : "📝 Enhance Text"}
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={() => handleGenerateTags()}
          disabled={loading.tags || !text}
          className="text-xs"
        >
          {loading.tags ? <LoadingSpinner size="small" /> : "🏷️ Generate Tags"}
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={handleAnalyzeMood}
          disabled={loading.mood || !text}
          className="text-xs bg-transparent"
        >
          {loading.mood ? <LoadingSpinner size="small" /> : "😊 Analyze Mood"}
        </Button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>💡 AI features help make your memories more engaging and discoverable</p>
      </div>
    </div>
  )
}

export default AIAssistant
