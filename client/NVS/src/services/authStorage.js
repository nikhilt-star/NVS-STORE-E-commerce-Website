const AUTH_TOKEN_KEY = 'nvs-auth-token'

export const getStoredToken = () => window.localStorage.getItem(AUTH_TOKEN_KEY)

export const setStoredToken = (token) => {
  if (!token) {
    return
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const clearStoredToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

