<template>
  <div class="h-full w-full box-border relative">
    <div class="whitespace-nowrap box-border h-52 border-1 color-1 w-full border-solid px-16 leading-52 relative z-10 bg-color-white text-left">
      <span class="font-color font-family text-16 font-medium">请选择单位/项目</span>
      <div
        class="leading-52 h-52 w-40 float-right relative cursor-pointer"
        @click="handleFilterClick"
      >
        <span
          :class="['text-14 font-family font-normal', [ filterDropdownStatus ? 'font-color-active' : 'font-color' ]]"
        >筛选</span>
        <div
          :class="['box-border h-8 w-8 border-b-color-white border-x-color-white border-t-4 border-x-4 border-solid absolute right-0 translate-y-n50p top-50p-plus2', [ filterDropdownStatus ? 'border-t-color-active rotate-180 top-50p-n2 transition-transform-border-t-color' : 'transition-transform-border-t-color border-t-color' ]]"></div>
      </div>
    </div>
    <div class="box-border h-52 px-16 py-8 leading-36 bg-color-white text-left">
      搜索框
    </div>
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
    <div
      :class="['h-81p absolute w-full bg-color-white z-9', [ filterDropdownStatus ? 'top-52 transition-top' : 'top-n81p transition-top' ]]"
    >
      <div class="m-16 box-border h-dropdown-content text-left">
        <div class="h-dropdown-options-area overflow-auto">
          <div
            class="border-b-color-grep border-b-1 border-t-0 border-l-0 border-r-0 border-solid pb-16 pt-16"
            v-for="cate in categoryList"
            :key="cate.category"
          >
            <div><span class="font-color-2 font-family text-14 font-normal">{{cate.category}}</span></div>
            <div
              :class="[[opt.active ? 'dropdown-option bg-color-active-008 ' : 'bg-color-1'], 'relative rounded-16  leading-32 min-h-32 text-center box-border min-w-58 mt-12 mr-8 cursor-pointer inline-block px-15 whitespace-nowrap']"
              v-for="opt in cate.options"
              :key="opt.name"
              @click="handleDropdownOptionClick(opt)"
            ><span :class="[[opt.active ? 'font-color-active' : 'font-color'], 'font-family text-14 font-normal'] ">{{opt.name}}</span></div>
          </div>
        </div>
        <div
          class="mt-16 cursor-pointer whitespace-nowrap flex items-center"
          @click="handleHideClick"
        >
          <span class="font-color-2 text-14 font-normal font-family">隐藏项目</span>
          <div :class="[[hideStatus ? 'bg-color-active transition-bg-color' : 'bg-color-white transition-bg-color'], 'relative inline-block ml-14  rounded-15-5 border-1-5 border-solid border-color-2 box-border h-26 leading-26 w-50']">
            <div :class="[[hideStatus ? ' translate-switch-btn-active transition-transform' : 'transition-transform translate-switch-btn-deactive top-0 left-0 shadow-switch-btn'], 'absolute bg-color-white border-solid border-0-5 border-color-2 box-border rounded-50p h-23 w-23']"></div>
          </div>
        </div>
      </div>
      <div class="whitespace-nowrap box-border h-50 w-full px-16 leading-50 bg-color-white cursor-pointer">
        <div class="h-40 leading-40 w-48-1p inline-block text-center rounded-100 border-color-1 border-1 border-solid mr-12">
          <span class="font-color text-14 font-normal font-family">重置</span>
        </div>
        <div
          class="h-40 leading-40 w-48-4p inline-block text-center bg-color-active rounded-100 cursor-pointer"
          @click="handleDropdownConfirm"
        >
          <span class="font-color-white text-14 font-normal font-family">确认</span>
        </div>
      </div>
    </div>
    <div
      :class="['mask-color absolute top-0 bottom-0 left-0 right-0', [ filterDropdownStatus ? 'opacity-100 transition-opacity' : 'opacity-0 transition-opacity z-n1' ]]"
      @click="handleMaskClick"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { categoryListMock, businessTreeMock } from './mock';
import { treeFlatten, } from './utils'

const filterDropdownStatus = ref(false)
const handleFilterClick = () => {
  filterDropdownStatus.value = !filterDropdownStatus.value
}
const handleMaskClick = () => {
  filterDropdownStatus.value = false
}

const categoryList = ref(categoryListMock)
const handleDropdownOptionClick = (opt) => {
  opt.active = !opt.active
}

const hideStatus = ref(false)
const handleHideClick = () => {
  hideStatus.value = !hideStatus.value
}

const handleDropdownConfirm = () => {
  handleMaskClick()
}

const treeMap = treeFlatten(businessTreeMock)
const treeFullHeight = ref('0')
const treeFullDomList = []

const renderedTreeData = ref([])
const start = ref(0)
const scrollTop = ref(0)

const createVTreeItemDom = (item) => {
  const itemDiv = document.createElement('div')
  itemDiv.className = 'border-t-0 border-l-0 border-r-0 border-b-1 border-solid border-b-color-grep-2 box-border min-h-44 leading-44 relative cursor-pointer flex items-center justify-between'

  const textDiv = document.createElement('div')
  textDiv.className = 'min-h-24 leading-24 inline-block pr-34'
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
  iconDiv.className = 'w-18 relative'
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
.h-full {
  height: 100%;
}
.h-52 {
  height: 52px;
}
.h-50 {
  height: 50px;
}
.h-40 {
  height: 40px;
}
.h-23 {
  height: 23px;
}
.h-26 {
  height: 26px;
}
.h-100-104 {
  height: calc(100% - 104px);
}
.h-8 {
  height: 8px;
}
.h-44 {
  height: 44px;
}
.h-24 {
  height: 24px;
}
.h-81p {
  height: 81.948%;
}
.h-dropdown-content {
  height: calc(100% - 50px - 32px);
}
.h-dropdown-options-area {
  height: calc(100% - 26px - 16px);
}
.min-h-32 {
  min-height: 32px
}
.min-h-44 {
  min-height: 44px
}
.min-h-24 {
  min-height: 24px
}


.leading-36 {
  line-height: 36px;
}
.leading-26 {
  line-height: 26px;
}
.leading-52 {
  line-height: 52px;
}
.leading-50 {
  line-height: 50px;
}
.leading-40 {
  line-height: 40px;
}
.leading-44 {
  line-height: 44px;
}
.leading-32 {
  line-height: 32px;
}
.leading-24 {
  line-height: 24px;
}

.w-full {
  width: 100%;
}
.w-8 {
  width: 8px;
}
.w-40 {
  width: 40px;
}
.w-50 {
  width: 50px;
}
.w-23 {
  width: 23px;
}
.w-165 {
  width: 165px;
}
.w-18 {
  width: 18px;
}
.w-48-1p {
  width: 48.1%;
}
.w-48-4p {
  width: 48.4%;
}
.w-fit {
  width: fit-content;
}
.min-w-58 {
  min-width: 58px;
}

.box-border {
  box-sizing: border-box;
}
.box-content {
  box-sizing: content-box;
}
.border-1 {
  border-width: 1px;
}
.border-1-5 {
  border-width: 1.5px;
}
.border-0-5 {
  border-width: 0.5px;
}
.border-solid {
  border-style: solid;
}
.color-1 {
  color: rgba(242, 241, 246, 1);
}
.border-x-4 {
  border-left-width: 4px;
  border-right-width: 4px;
}
.border-t-4 {
  border-top-width: 4px;
}
.border-t-0 {
  border-top-width: 0;
}
.border-l-0 {
  border-left-width: 0;
}
.border-r-0 {
  border-right-width: 0;
}
.border-b-4 {
  border-bottom-width: 4px;
}
.border-b-1 {
  border-bottom-width: 1px;
}
.border-t-color {
  border-top-color: rgba(220, 222, 224, 1);
}
.border-t-color-active {
  border-top-color: rgba(26, 121, 255, 1);
}
.border-color-1 {
  border-color: rgba(220, 222, 224, 1);
}
.border-color-2 {
  border-color: rgba(0, 0, 0, .1);
}
.border-color-active {

  border-color: rgba(26, 121, 255, 1);
}
.border-x-color-white {
  border-left-color: #fff;
  border-right-color: #fff;
}
.border-b-color-white {
  border-bottom-color: #fff;
}
.border-b-color-grep {
  border-bottom-color: rgba(245, 246, 248, 1);
}
.border-b-color-grep-2 {
  border-bottom-color: rgba(242, 241, 246, 1);
}

.px-16 {
  padding-left: 16px;
  padding-right: 16px;
}
.px-15 {
  padding-left: 15px;
  padding-right: 15px;
}
.py-8 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.pb-16 {
  padding-bottom: 16px;
}
.pt-16 {
  padding-top: 16px;
}
.pr-34 {
  padding-right: 34px;
}
.px-7 {
  padding-top: 7px;
  padding-bottom: 7px;
}

.font-color {
  color: rgba(50, 50, 51, 1);
}
.font-color-active {
  color: rgba(26, 121, 255, 1);
}
.font-color-white {
  color: rgba(255, 255, 255, 1.0);
}
.font-color-2 {
  color: rgba(100, 101, 102, 1);
}
.font-color-3 {
  color: rgba(50, 50, 50, 1);
}
.font-family {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', Arial, 'Microsoft YaHei', 'SimSun', sans-serif;;
}
.font-medium {
  font-weight: 500;
}
.font-normal {
  font-weight: 400;
}

.text-16 {
  font-size: 16px;
}
.text-14 {
  font-size: 14px;
}

.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}

.relative {
  position: relative;
}
.absolute {
  position: absolute;
}

.float-right {
  float: right;
}

.right-0 {
  right: 0;
}
.top-50p-plus2 {
  top: calc(50% + 2px);
}
.top-50p-n2 {
  top: calc(50% - 2px);
}
.top-0 {
  top: 0;
}
.top-1-5 {
  top: 1.5px;
}
.top-52 {
  top: 52px;
}
.top-n81p {
  top: calc(-81.948% + 52px);
}
.bottom-0 {
  bottom: 0;
}
.left-0 {
  left: 0;
}
.left-1-5 {
  left: 1.5px;
}

.translate-y-n50p {
  transform: translateY(-50%);
}
.rotate-180 {
  transform: rotate(180deg) translateY(50%);
}
.rotate-0 {
  transform: rotate(0);
}
.translate-switch-btn-active {
  transform: translateX(25px);
}
.translate-switch-btn-deactive {
  transform: translateX(0);
}
.transition-transform-border-t-color {
  transition-property: transform, border-top-color;
  transition-timing-function: linear;
  transition-duration: 200ms;
}
.transition-top {
  transition-property: top;
  transition-timing-function: linear;
  transition-duration: 200ms;
}
.transition-opacity {
  transition-property: opacity;
  transition-timing-function: linear;
  transition-duration: 200ms;
}
.transition-bg-color {
  transition-property: background-color;
  transition-timing-function: linear;
  transition-duration: 200ms;
}
.transition-transform {
  transition-property: transform;
  transition-timing-function: linear;
  transition-duration: 200ms;
}

.z-10 {
  z-index: 10;
}
.z-9 {
  z-index: 9;
}
.z-n1 {
  z-index: -1;
}

.mask-color {
  background-color: rgba(0, 0, 0, .4);
}

.bg-color-white {
  background-color: rgba(255, 255, 255, 1.0);
}
.bg-color-active {
  background-color: rgba(26, 121, 255, 1);
}
.bg-color-active-008 {
  background-color: rgba(26, 121, 255, 0.08);
}
.bg-color-1 {
  background-color: rgba(242, 243, 245, 1);
}

.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}

.inline-block {
  display: inline-block;
}

.rounded-100 {
  border-radius: 100px;
}
.rounded-16 {
  border-radius: 16px;
}
.rounded-15-5 {
  border-radius: 15.5px;
}
.rounded-50p {
  border-radius: 50%;
}

.mr-12 {
  margin-right: 12px;
}
.mr-8 {
  margin-right: 8px;
}
.ml-14 {
  margin-left: 14px;
}
.mt-12 {
  margin-top: 12px;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.m-16 {
  margin: 16px;
}
.mt-16 {
  margin-top: 16px;
}

.cursor-pointer {
  cursor: pointer;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.overflow-auto {
  overflow: auto;
}
.overflow-hidden {
  overflow: hidden;
}

.dropdown-option::after {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 16px;
  content: '';
  border-width: 1px;
  border-style: solid;
  border-color: rgba(26, 121, 255, 1);
}

.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}

.shadow-switch-btn {
  box-shadow: 0px 3px 1px  rgba(0, 0, 0, 0.05), 0px 2px 2px  rgba(0, 0, 0, 0.1), 0px 3px 3px  rgba(0, 0, 0, 0.05);
}

.virtual-tree-wrapper {
  width: calc(100% - 32px);
}
.real-height-div {}
.v-tree {}

.project-line-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url('./Path.svg');
  background-repeat: no-repeat;
  background-size: contain;
  width: 7.51px;
  height: 13.52px;
}
</style>
