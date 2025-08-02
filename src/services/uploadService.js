import api from "./api"

class UploadService {
  async uploadMedia(file, capsuleId, onProgress) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("capsuleId", capsuleId)

    try {
      const response = await api.post("/upload/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (onProgress) {
            onProgress(percentCompleted)
          }
        },
      })

      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Upload failed")
    }
  }

  async uploadAvatar(file, onProgress) {
    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const response = await api.post("/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (onProgress) {
            onProgress(percentCompleted)
          }
        },
      })

      return response.data.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Avatar upload failed")
    }
  }

  validateFile(file, type = "media") {
    const maxSize = type === "avatar" ? 5 * 1024 * 1024 : 100 * 1024 * 1024 // 5MB for avatar, 100MB for media
    const allowedTypes = {
      avatar: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      media: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/webm",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp3",
      ],
    }

    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
    }

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`)
    }

    return true
  }

  getFileType(file) {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "file"
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}

export default new UploadService()
