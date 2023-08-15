import { createApp } from 'vue'
import { ConfigProvider } from 'vant'
import './style.css'
import App from './App.vue'
import { install } from './components/virtual-project-tree/index'


createApp(App)
  .use(install)
  .use(ConfigProvider)
  .mount('#app')
