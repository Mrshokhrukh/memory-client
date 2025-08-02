
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { createCapsule } from "../store/slices/capsuleSlice"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Textarea from "../components/ui/Textarea"
import Card from "../components/ui/Card"

const CreateCapsule = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.capsules)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "private",
    theme: "default",
    tags: "",
    releaseDate: "",
  })

  const [errors, setErrors] = useState({})

  const themes = [
    { value: "default", label: "Default", colors: "from-blue-500 to-purple-500" },
    { value: "vintage", label: "Vintage", colors: "from-amber-500 to-orange-500" },
    { value: "modern", label: "Modern", colors: "from-gray-500 to-gray-700" },
    { value: "nature", label: "Nature", colors: "from-green-500 to-emerald-500" },
    { value: "space", label: "Space", colors: "from-purple-500 to-indigo-500" },
    { value: "ocean", label: "Ocean", colors: "from-blue-500 to-cyan-500" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (formData.type === "timed" && !formData.releaseDate) {
      newErrors.releaseDate = "Release date is required for timed capsules"
    }

    if (formData.type === "timed" && new Date(formData.releaseDate) <= new Date()) {
      newErrors.releaseDate = "Release date must be in the future"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const capsuleData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    const result = await dispatch(createCapsule(capsuleData))
    if (createCapsule.fulfilled.match(result)) {
      navigate(`/capsule/${result.payload._id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Memory Capsule</h1>
          <p className="text-gray-600 mt-2">Start collecting memories with friends and family</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Capsule Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g., Summer Vacation 2024"
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell people what this capsule is about..."
              rows={3}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Capsule Type</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="private"
                    checked={formData.type === "private"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Private</div>
                    <div className="text-sm text-gray-500">Only invited people can see and contribute</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="public"
                    checked={formData.type === "public"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Public</div>
                    <div className="text-sm text-gray-500">Anyone can discover and view this capsule</div>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="timed"
                    checked={formData.type === "timed"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">Time Capsule</div>
                    <div className="text-sm text-gray-500">Opens automatically on a future date</div>
                  </div>
                </label>
              </div>
            </div>

            {formData.type === "timed" && (
              <Input
                label="Release Date"
                name="releaseDate"
                type="datetime-local"
                value={formData.releaseDate}
                onChange={handleChange}
                error={errors.releaseDate}
                min={new Date().toISOString().slice(0, 16)}
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <label key={theme.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={formData.theme === theme.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        formData.theme === theme.value ? "border-primary-500 bg-primary-50" : "border-gray-200"
                      }`}
                    >
                      <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.colors} mb-2`}></div>
                      <div className="text-sm font-medium text-gray-900">{theme.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Tags (optional)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="vacation, family, friends (comma separated)"
            />

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Create Capsule
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default CreateCapsule
