import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer hr|364035_c8cd396d-daad-4826-b405-92b52b81bfa7',
  },
})

http.interceptors.response.use((res): AxiosResponse<any, any> | Promise<AxiosResponse<any, any>> => {
  const status = Number(res.status)
  if (status !== 200) {
    return Promise.reject(res.data.msg)
  }
  return res.data
})

export default http



