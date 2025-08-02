"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import uploadService from "../../services/uploadService"

const FileUpload = ({ onFileSelect, accept = "*", maxSize = 100 * 1024 * 1024, uploading, progress }) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError("")

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File is too large. Maximum size is ${uploadService.formatFileSize(maxSize)}`)
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("File type not supported")
        } else {
          setError("File upload failed")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        try {
          uploadService.validateFile(file, "media")
          setSelectedFile(file)
          onFileSelect(file)
        } catch (validationError) {
          setError(validationError.message)
        }
      }
    },
    [maxSize, onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept === "*" ? undefined : { [accept]: [] },
    maxSize,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const removeFile = () => {
    setSelectedFile(null)
    onFileSelect(null)
    setError("")
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return "🖼️"
    if (file.type.startsWith("video/")) return "🎥"
    if (file.type.startsWith("audio/")) return "🎵"
    return "📄"
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive || dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400"}
            ${error ? "border-red-300 bg-red-50" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">Maximum file size: {uploadService.formatFileSize(maxSize)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getFileIcon(selectedFile)}</span>
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{uploadService.formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {!uploading && (
              <button onClick={removeFile} className="text-gray-400 hover:text-red-500 transition-colors" type="button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default FileUpload
