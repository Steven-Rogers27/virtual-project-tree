# 使用说明

## 注册

1. 引入 VirtualProjectTree 组件

```js
import { VirtualProjectTree } from 'virtual-project-tree'
import 'virtual-project-tree/dist/style.css'

app.mount(VirtualProjectTree.name, VirtualProjectTree)
```

2. virtual-project-tree 内部封装了 /admin/login/userBusinessTreeApp/subSystemTree 接口 和 /admin/login/userBusinessTreeApp/homePageTreeParameter 接口的调用，从而可以让业务系统不用写接口调用直接使用。为此需要传入业务系统的axios实例

```js
import { config } from 'virtual-project-tree'

config(axios)
```

3. 如果业务系统想自行调用2中的两个接口，则不要做2中的操作

## 使用

提供一个空页面作为容器，假设为 #app 节点

```html
<template>
  <VirtualProjectTree
    :business-tree="businessTreeMock"
    :tree-params="categoryListMock"
    @confirm-click="handleConfirmClick"
  />
</template>
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
```

## 属性

```js
businessTree: Array<Partial<VirtualProjectTree.BusinessTreeNode>>
```
业务系统自行调用查询工程树的接口时，传入接口返回的原始data（不含msg, code，只是data）

```js
treeParams: VirtualProjectTree.BusinessTreeParameter
```
业务系统自行调用查工程树属性的接口时，传入接口返回的原始data（不含msg，code，只是data）

```js
defaultActivedTreeParams: VirtualProjectTree.DefaultActivedBusinessTreeParameter
```
工程树属性的默认参数

```js
defaultHideStatus: boolean
```
默认是否隐藏所有工程

```js
businessTreeType: number
```
业务树类型

```js
platformId: number
```
平台ID

```js
subSystemMark: string
```
业务系统mark