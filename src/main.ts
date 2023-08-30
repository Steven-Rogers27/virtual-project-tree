import {createApp} from 'vue'
import App from './App.vue'
import { VirtualProjectTree,  } from './components/virtual-project-tree/index'
// config
// import http from './http'

// config(http)
createApp(App)
	// @ts-ignore
  .use(VirtualProjectTree)
  .mount('#app')
