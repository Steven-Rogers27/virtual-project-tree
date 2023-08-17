import {createApp} from 'vue'
import App from './App.vue'
import { VirtualProjectTree } from './components/virtual-project-tree/index'

createApp(App)
	// @ts-ignore
  .use(VirtualProjectTree)
  .mount('#app')
