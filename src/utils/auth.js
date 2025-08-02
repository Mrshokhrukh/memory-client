import api from "../services/api"

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
  } else {
    delete api.defaults.headers.common["Authorization"]
    localStorage.removeItem("token")
  }
}

export const getToken = () => {
  return localStorage.getItem("token")
}

export const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    return true
  }
}

export const getUserFromToken = (token) => {
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload
  } catch (error) {
    return null
  }
}
