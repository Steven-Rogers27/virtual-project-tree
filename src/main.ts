import { createApp } from 'vue'
import { ConfigProvider } from 'vant'
import './style.css'
import App from './App.vue'

createApp(App)
  .use(ConfigProvider)
  .mount('#app')
