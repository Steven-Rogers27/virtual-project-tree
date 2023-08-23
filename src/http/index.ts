import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer hr|364035_47890460-31ce-462d-b5be-123304d58b55',
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



