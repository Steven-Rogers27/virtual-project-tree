import VirtualProjectTree from './virtual-project-tree.vue'
import VirtualProjectTreeSelect from './virtual-project-tree-select.vue'
import { App } from 'vue'
import { registerAxios } from './http'

const config = (axios: VirtualProjectTreeNamespace.Axios) => {
  registerAxios(axios)
}

let treeInstalled = false
VirtualProjectTree.install = (app: App) => {
  if (treeInstalled) return
  treeInstalled = true

	app.component(VirtualProjectTree.name, VirtualProjectTree)
}

let selectInstalled = false
VirtualProjectTreeSelect.install = (app: App) => {
  if (selectInstalled) return
  selectInstalled = true

	app.component(VirtualProjectTreeSelect.name, VirtualProjectTreeSelect)
}


export {
  VirtualProjectTreeSelect,
	VirtualProjectTree,
	config,
}
