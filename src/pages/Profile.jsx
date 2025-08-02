"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateProfile, changePassword } from "../store/slices/authSlice"
import { updateUserAvatar } from "../store/slices/authSlice"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Textarea from "../components/ui/Textarea"
import Avatar from "../components/ui/Avatar"
import uploadService from "../services/uploadService"
import toast from "react-hot-toast"

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [uploading, setUploading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      uploadService.validateFile(file, "avatar")
      setUploading(true)

      const result = await uploadService.uploadAvatar(file)
      dispatch(updateUserAvatar(result.avatarUrl))
      toast.success("Avatar updated successfully!")
    } catch (error) {
      toast.error(error.message || "Failed to upload avatar")
    } finally {
      setUploading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      await dispatch(updateProfile(profileData)).unwrap()
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(error || "Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    setChangingPassword(true)

    try {
      await dispatch(
        changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      ).unwrap()

      toast.success("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error(error || "Failed to change password")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <Input label="Full Name" name="name" value={profileData.name} onChange={handleProfileChange} required />

                <Input label="Email" value={user?.email} disabled className="bg-gray-50" />

                <Textarea
                  label="Bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />

                <div className="flex justify-end">
                  <Button type="submit" loading={updating}>
                    Update Profile
                  </Button>
                </div>
              </form>
            </Card>

            {/* Change Password */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />

                <div className="flex justify-end">
                  <Button type="submit" loading={changingPassword}>
                    Change Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Avatar & Stats */}
          <div className="space-y-6">
            {/* Avatar */}
            <Card className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
              <div className="relative inline-block">
                <Avatar src={user?.avatarUrl} alt={user?.name} size="xlarge" className="mx-auto mb-4" />
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
              />
              <label htmlFor="avatar-upload">
                <Button variant="outline" disabled={uploading} className="cursor-pointer bg-transparent">
                  {uploading ? "Uploading..." : "Change Avatar"}
                </Button>
              </label>
            </Card>

            {/* Account Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capsules Created</span>
                  <span className="font-medium">{user?.createdCapsules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capsules Joined</span>
                  <span className="font-medium">{user?.joinedCapsules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
