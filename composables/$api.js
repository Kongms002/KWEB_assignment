export default (url, options) => {
  return $fetch(url, {
    baseURL: `${import.meta.env.VITE_API_URL}`,
    credentials: 'include',
    ...options
  })
}