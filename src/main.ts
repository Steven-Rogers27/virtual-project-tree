import {createApp} from 'vue'
import App from './App.vue'
import { VirtualProjectTree, config } from './components/virtual-project-tree/index'
import http from './http'

config(http)
createApp(App)
	// @ts-ignore
  .use(VirtualProjectTree)
  .mount('#app')
