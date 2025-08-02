"use client"

import { useEffect, useRef } from "react"

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const pickerRef = useRef(null)

  const emojis = [
    "❤️",
    "😍",
    "😂",
    "😊",
    "😢",
    "😮",
    "😡",
    "👍",
    "👎",
    "👏",
    "🙌",
    "🔥",
    "💯",
    "⭐",
    "🎉",
    "💖",
    "😭",
    "🤔",
    "😴",
    "🤗",
    "😎",
    "🥳",
    "😇",
    "🤩",
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50"
    >
      <div className="grid grid-cols-6 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export default EmojiPicker
