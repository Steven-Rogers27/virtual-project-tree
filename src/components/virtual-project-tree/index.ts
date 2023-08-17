import VirtualProjectTree from './virtual-project-tree.vue'
import { App } from 'vue'
import { registerAxios } from './http'

const config = (axios: VirtualProjectTreeNamespace.Axios) => {
  registerAxios(axios)
}

let installed = false
VirtualProjectTree.install = (app: App) => {
  if (installed) return
  installed = true

	app.component(VirtualProjectTree.name, VirtualProjectTree)
}

export {
	VirtualProjectTree,
	config,
}
