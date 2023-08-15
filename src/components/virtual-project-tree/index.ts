import VirtualProjectTreeComponent from './virtual-project-tree.vue'
import { App } from 'vue'
import { registerAxios } from './http'

export const config = (axios: VirtualProjectTree.Axios) => {
  registerAxios(axios)
}

let installed = false
export const install = (app: App) => {
  if (installed) return
  installed = true

  app.component(VirtualProjectTreeComponent.name, VirtualProjectTreeComponent)
}