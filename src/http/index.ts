import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer hr|364035_10b3ec47-afe1-4b4d-8942-afbc3441e67a',
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



