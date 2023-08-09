export function treeFlatten(tree) {
  if (!Array.isArray(tree) || !tree.length) return []

  const map = []
  for (let i = 0, len = tree.length; i < len; i++) {
    const stackHelper = [] // 出栈时再依次从右往左压入其子节点
    const rootNode = tree[i]
    // 标记每个节点是树上的第几层级，渲染时缩进要用
    rootNode.level = 1
    stackHelper.push(rootNode)
    let serialNumber = 0
    while (stackHelper.length) {
      const currentRoot = stackHelper.pop() // 从栈顶弹出
      const children = currentRoot.children
      Reflect.deleteProperty(currentRoot, 'children')
      currentRoot.domHeight = 0
      currentRoot.serialNumber = serialNumber++
      map.push([currentRoot.idInfo, currentRoot])
      if (!Array.isArray(children) || !children.length) continue

      children.forEach(ch => ch.level = currentRoot.level + 1)
      stackHelper.push(...children.reverse())
    }
  }

  return map
}

export function throttle(fn, wait) {
  let timer = null

  return (...args) => {
    if (timer !== null) return

    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}

export function debounce(fn, wait) {
  let timer = null

  return (...args) => {
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
