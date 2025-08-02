"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { createMemory } from "../../store/slices/memorySlice"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Textarea from "../ui/Textarea"
import FileUpload from "../ui/FileUpload"
import uploadService from "../../services/uploadService"
import toast from "react-hot-toast"

const CreateMemoryModal = ({ isOpen, onClose, capsuleId }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    type: "text",
    title: "",
    text: "",
    tags: "",
  })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    const fileType = uploadService.getFileType(selectedFile)
    setFormData({ ...formData, type: fileType })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      let mediaUrl = null
      let thumbnailUrl = null
      let mediaMetadata = null

      // Upload file if present
      if (file) {
        setUploading(true)
        const uploadResult = await uploadService.uploadMedia(file, capsuleId, setUploadProgress)
        mediaUrl = uploadResult.url
        thumbnailUrl = uploadResult.thumbnailUrl
        mediaMetadata = uploadResult.metadata
        setUploading(false)
      }

      // Create memory
      const memoryData = {
        capsuleId,
        type: formData.type,
        title: formData.title,
        text: formData.text,
        mediaUrl,
        thumbnailUrl,
        mediaMetadata,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      const result = await dispatch(createMemory(memoryData))
      if (createMemory.fulfilled.match(result)) {
        toast.success("Memory created successfully!")
        onClose()
        // Reset form
        setFormData({
          type: "text",
          title: "",
          text: "",
          tags: "",
        })
        setFile(null)
        setUploadProgress(0)
      }
    } catch (error) {
      toast.error(error.message || "Failed to create memory")
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const isFormValid = () => {
    if (formData.type === "text") {
      return formData.text.trim().length > 0
    }
    return file !== null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Memory" size="large">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Memory Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Memory Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "text", label: "Text", icon: "📝" },
              { value: "image", label: "Photo", icon: "📷" },
              { value: "video", label: "Video", icon: "🎥" },
              { value: "audio", label: "Audio", icon: "🎵" },
            ].map((type) => (
              <label key={type.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={formData.type === type.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    formData.type === type.value ? "border-primary-500 bg-primary-50" : "border-gray-200"
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        {formData.type !== "text" && (
          <FileUpload
            onFileSelect={handleFileSelect}
            accept={
              formData.type === "image"
                ? "image/*"
                : formData.type === "video"
                  ? "video/*"
                  : formData.type === "audio"
                    ? "audio/*"
                    : "*"
            }
            maxSize={100 * 1024 * 1024} // 100MB
            uploading={uploading}
            progress={uploadProgress}
          />
        )}

        {/* Title */}
        <Input
          label="Title (optional)"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Give your memory a title..."
        />

        {/* Text Content */}
        <Textarea
          label={formData.type === "text" ? "Your Memory" : "Description (optional)"}
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder={
            formData.type === "text" ? "Share your thoughts, story, or experience..." : "Add a description..."
          }
          rows={4}
          required={formData.type === "text"}
        />

        {/* Tags */}
        <Input
          label="Tags (optional)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="vacation, family, friends (comma separated)"
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose} disabled={submitting || uploading}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting || uploading} disabled={!isFormValid()}>
            {uploading ? `Uploading... ${uploadProgress}%` : "Create Memory"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateMemoryModal
