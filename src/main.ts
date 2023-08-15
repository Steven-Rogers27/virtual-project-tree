import { createApp } from 'vue'
import { ConfigProvider } from 'vant'
import './style.css'
import App from './App.vue'
import { config, install } from './components/virtual-project-tree/index'
import http from './http'

// config(http)

createApp(App)
  .use(install)
  .use(ConfigProvider)
  .mount('#app')
