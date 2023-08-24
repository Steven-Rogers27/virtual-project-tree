import axios, { AxiosResponse } from 'axios'

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer hr|364035_88dcc65e-f7fe-4f31-8d39-c84a49ccebd5',
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



