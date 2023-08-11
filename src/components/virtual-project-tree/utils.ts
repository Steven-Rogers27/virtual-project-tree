interface TreeNode extends Partial<VirtualProjectTree.BusinessTreeNode> {
  level?: number;
  domHeight?: number;
  serialNumber?: number;
}

export function treeFlatten(tree: Partial<VirtualProjectTree.BusinessTreeNode>[]) {
  if (!Array.isArray(tree) || !tree.length) return []

  const map = []
  for (let i = 0, len = tree.length; i < len; i++) {
    const stackHelper: TreeNode[] = [] // 出栈时再依次从右往左压入其子节点
    const rootNode: TreeNode = tree[i]
    // 标记每个节点是树上的第几层级，渲染时缩进要用
    rootNode.level = 1
    stackHelper.push(rootNode)
    let serialNumber = 0
    while (stackHelper.length) {
      const currentRoot: TreeNode = stackHelper.pop()! // 从栈顶弹出
      const children: TreeNode[] = currentRoot.children!
      Reflect.deleteProperty(currentRoot, 'children')
      currentRoot.domHeight = 0
      currentRoot.serialNumber = serialNumber++
      map.push([currentRoot.idInfo, currentRoot])
      if (!Array.isArray(children) || !children.length) continue

      children.forEach(ch => ch.level = currentRoot.level! + 1)
      stackHelper.push(...children.reverse())
    }
  }

  return map
}

export function throttle(fn: (...args: unknown[]) => unknown, wait: number) {
  let timer: null | NodeJS.Timeout = null

  return (...args: unknown[]) => {
    if (timer !== null) return

    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}

export function debounce(fn: (...args: unknown[]) => unknown, wait: number) {
  let timer: null | NodeJS.Timeout = null

  return (...args: unknown[]) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}
