import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    Authorization: 'Bearer 	hr|364035_7e1b8d7c-42ed-4310-ae04-a156ff4c6b6e',
  },
})

export default http



