import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // json-server default port
  headers: {
    'Content-Type': 'application/json'
  }
})

// Optional: Add interceptors for tokens if you implement real auth later
api.interceptors.request.use(config => {
  // const token = localStorage.getItem('token')
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config
})

export default api
