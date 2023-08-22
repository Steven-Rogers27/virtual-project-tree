import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer hr|364035_3bf95330-0fff-4d64-92a3-e362e0b491af',
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



