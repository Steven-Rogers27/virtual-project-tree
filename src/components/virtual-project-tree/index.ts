export { default as VirtualProjectTree } from './virtual-project-tree.vue'
import { registerAxios } from './http'

export const config = (axios: VirtualProjectTree.Axios) => {
  registerAxios(axios)
}