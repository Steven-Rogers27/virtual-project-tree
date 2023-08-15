import treeResp from './business-tree-response.json'
import paramResp from './tree-parameter-response.json'

export const businessTreeMock: Partial<VirtualProjectTree.BusinessTreeNode>[] = treeResp.data

export const categoryListMock = paramResp.data