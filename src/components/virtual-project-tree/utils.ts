interface TreeNode extends Partial<VirtualProjectTreeNamespace.BusinessTreeNode> {
  level?: number;
  domHeight?: number;
  serialNumber?: number;
}

export function treeFlatten(tree: Partial<VirtualProjectTreeNamespace.BusinessTreeNode>[]) {
  if (!Array.isArray(tree) || !tree.length) return []

  const map = []
  let serialNumber = 0
  for (let i = 0, len = tree.length; i < len; i++) {
    const stackHelper: TreeNode[] = [] // 出栈时再依次从右往左压入其子节点
    const rootNode: TreeNode = tree[i]
    // 标记每个节点是树上的第几层级，渲染时缩进要用
    rootNode.level = 1
    stackHelper.push(rootNode)
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

export function isObjectType(o: any) {
  const regexp = /\[object Object\]/
  return regexp.test(o)
}

export function createInvokeHttpWithLock(fun: (...args: any[]) => Promise<any>, condition?: boolean) {
	let lock = false
	return async (...args: any[]) => {
		if (!condition) return

		if (lock) return
		lock = true
		await fun(...args).finally(() => lock = false)
	}
}

export enum BusinessNodeType {
	corporation = '1', // 集团、公司
}
