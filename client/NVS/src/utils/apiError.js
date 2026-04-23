export const getApiErrorMessage = (error) =>
  error?.userMessage || error?.response?.data?.message || error?.message || 'Something went wrong.'
