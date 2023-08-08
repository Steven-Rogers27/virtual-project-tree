<template>
  <div class="virtual-tree-wrapper h-100-104 box-content overflow-auto px-16 relative bg-color-white">
    <div
      class="v-tree absolute top-0 left-0 right-0 bottom-0 px-16"
      :style="{transform: `translateY(${scrollTop}px)`}"
    >
      <div
        v-for="item in renderedTreeData"
        :key="item.idInfo"
        class="border-t-0 border-l-0 border-r-0 border-b-1 border-solid border-b-color-grep-2 box-border min-h-44 leading-44 relative cursor-pointer flex items-center justify-between"
        :data-serial="item.serialNumber"
      >
        <div
          :class="[{ 'px-7': item.domHeight > 44 }, 'min-h-24 leading-24 inline-block pr-34 text-left']"
          :style="{paddingLeft: `${item.level * 16}px`}"
        >
          <span
            :class="[[item.level < 3 ? 'font-color-3' : 'font-color-2'], 'text-16 font-normal font-family']"
          >{{item.name}}</span>
        </div>
        <div class="w-18 absolute right-0">
          <div class="project-line-arrow"></div>
        </div>
      </div>
    </div>
    <div
      class="real-height-div w-full"
      :style="{height: treeFullHeight}"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { treeFlatten, } from './utils'
import { businessTreeMock } from './mock';

const scrollTop = ref(0)
const renderedTreeData = ref([])
const treeMap = treeFlatten(businessTreeMock)
const treeFullHeight = ref('0')
const treeFullDomList = []

const start = ref(0)

const createVTreeItemDom = (item) => {
  const itemDiv = document.createElement('div')
  itemDiv.className = 'border-t-0 border-l-0 border-r-0 border-b-1 border-solid border-b-color-grep-2 box-border min-h-44 leading-44 relative cursor-pointer flex items-center justify-between'

  const textDiv = document.createElement('div')
  textDiv.className = 'min-h-24 leading-24 inline-block pr-34 text-left'
  if (item.domHeight > 44) {
    textDiv.classList.add('px-7')
  }
  textDiv.style.setProperty('padding-left', `${item.level * 16}px`)
  const textSpan = document.createElement('span')
  textSpan.className = 'text-16 font-normal font-family'
  item.level < 3 ? textSpan.classList.add('font-color-3') : textSpan.classList.add('font-color-2')
  textSpan.textContent = item.name
  textDiv.appendChild(textSpan)
  itemDiv.appendChild(textDiv)

  const iconDiv = document.createElement('div')
  iconDiv.className = 'w-18 absolute right-0'
  const iconInner = document.createElement('div')
  iconInner.className = 'project-line-arrow'
  iconDiv.appendChild(iconInner)
  itemDiv.appendChild(iconDiv)

  return itemDiv
}

const calculateVirtualTreeData = () => {
  const vtreeWrapDom = document.querySelector('.virtual-tree-wrapper')
  if (!vtreeWrapDom) return

  const vtwCSSStyle = window.getComputedStyle(vtreeWrapDom)
  const fontSize = +vtwCSSStyle.getPropertyValue('font-size').replace(/(px)$/i, '')
  const { height: vtwHeight, } = vtreeWrapDom.getBoundingClientRect()
  const paddingLeft = +vtwCSSStyle.getPropertyValue('padding-left').replace(/(px)$/i, '')
  const paddingRight = +vtwCSSStyle.getPropertyValue('padding-right').replace(/(px)$/i, '')

  const vtwRealHeightDom = document.querySelector('.virtual-tree-wrapper .real-height-div')
  let { width: vtwWidth } = vtwRealHeightDom.getBoundingClientRect()

  vtwWidth -= 6 // 估算移动端纵向滚动条宽度6px
  const calcDomHeight = (name, level) => {
    const nameLen = name.length * 16
    const boxLen = vtwWidth - level * 16 - 34
    if (nameLen <= boxLen) {
      // 一行能放下
      return 44
    } else {
      // 放多行
      const rowNum = Math.ceil(nameLen / boxLen)
      return rowNum * 24 + 1 + 14 // line-height: 24px  border-bottom-width: 1px  padding-top: 7px  padding-bottom: 7px
    }
  }

  const calcCount = (start, threshold) => {
    let count = 0
    let calcItemHeight = 0
    for (let i = start, len = treeMap.length; i < len; i++) {
      if (calcItemHeight >= threshold) {
        break
      }
      const item = treeMap[i][1]
      if (item.domHeight === 0) {
        item.domHeight = calcDomHeight(item.name, item.level)
      }
      calcItemHeight += item.domHeight
      count++
    }

    return count
  }

  const calcTreeFullHeight = () => {
    let calcItemHeight = 0
    for (let i = 0, len = treeMap.length; i < len; i++) {
      const item = treeMap[i][1]
      if (item.domHeight === 0) {
        item.domHeight = calcDomHeight(item.name, item.level)
      }
      calcItemHeight += item.domHeight
    }
    return calcItemHeight
  }

  treeFullHeight.value = calcTreeFullHeight() + 'px'
  let upHiddenCount = calcCount(0, vtreeWrapDom.scrollTop)
  start.value = Math.max(upHiddenCount, 0)

  let viewportCount = calcCount(start.value, vtwHeight)
  // const vtreeDom = document.querySelector('.virtual-tree-wrapper .v-tree')
  // for (let i = start.value; i < start.value + viewportCount; i++) {
  //   const data = treeMap[i][1]
  //   const itemDom = createVTreeItemDom(data)
  //   vtreeDom.appendChild(itemDom)
  // }
  renderedTreeData.value = treeMap.slice(start.value, start.value + viewportCount).map(t => t[1])

  const scrollHandle = (evt) => {
    const target = evt.target as HTMLDivElement
    if (target.scrollTop === scrollTop.value) return

    let contentMoveUp = target.scrollTop > scrollTop.value // true - 内容上移  false - 内容下移
    scrollTop.value = target.scrollTop
    upHiddenCount = calcCount(0, scrollTop.value)
    // 下标 start.value~upHiddenCount-2 [start.value, upHiddenCount - 1)的dom节点移除
    // const vTreeDom = document.querySelector(`.virtual-tree-wrapper .v-tree`) as HTMLDivElement
    // if (start.value >= upHiddenCount - 1) return

    // for (let i = start.value; i < upHiddenCount - 1; i++) {
    //   const itemDom = vTreeDom.firstElementChild
    //   if (itemDom) {
    //     vTreeDom.removeChild(itemDom)
    //     treeFullDomList[i] = itemDom
    //   }
    // }

    // 更新起始下标start.value
    // start.value = Math.max(upHiddenCount - 1, 0)
    start.value = upHiddenCount

    viewportCount = calcCount(start.value, vtwHeight)
    renderedTreeData.value = treeMap.slice(start.value, start.value + viewportCount).map(t => t[1])

    // for (let i = start.value; i < start.value + viewportCount; i++) {
    //   const data = treeMap[i][1]
    //   const itemDom = createVTreeItemDom(data)
    //   vtreeDom.appendChild(itemDom)
    // }
  }
  vtreeWrapDom.addEventListener('scroll', scrollHandle)
}

onMounted(() => {
  setTimeout(() => {
    /**
     * 在vue 3.2.31 版本中，直接在 onMounted()回调中执行 calculateVirtualTreeData()方法
     * 时，document.querySelector('.virtual-tree-wrapper') 获取到的容器 dom 的高度并不是设置的 calc(100% - 104px)，
     * 而是用于撑起容器 dom 滚动条的 treeFullHeight 高度，不知道为何。
     * 因此把 calculateVirtualTreeData() 放在下一轮事件循环再执行，让页面先渲染一次，保证设置的样式 height:calc(100% - 104px) 生效后，
     * 再来获取容器 dom 的高度值。
     */
    calculateVirtualTreeData()
  });
})
</script>

<style>
@import url('./style.css');
</style>