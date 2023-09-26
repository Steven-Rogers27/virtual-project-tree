<template>
  <div
    class="virtual-tree-wrapper box-content overflow-auto px-16 relative bg-color-white text-16"
    @click="handleItemClick"
  >
    <div
      class="v-tree absolute top-0 left-0 right-0 bottom-0 px-16"
      :style="{transform: `translateY(${vtreeMoveDistance}px)`}"
    >
      <template v-if="renderedTreeData.length">
        <div
          v-for="item in renderedTreeData"
          :key="item.idInfo"
          class="border-t-0 border-l-0 border-r-0 border-b-1 border-solid border-b-color-grep-2 box-border min-h-44 leading-44 relative cursor-pointer flex items-center justify-between"
          :data-serial-number="item.serialNumber"
        >
          <div
            :class="[{ 'px-7': item.domHeight > 44 * fontSizeRatio }, [ item.keyProjectFlag ? 'pr-78' : 'pr-34' ], 'relative min-h-24 leading-24 inline-block text-left']"
            :style="{ paddingLeft: `${ item.level * 16 * fontSizeRatio }px`}"
          >
            <span
              :class="[[item.level < 3 ? 'font-color-3' : 'font-color-2'], 'text-16 font-normal font-family']"
              v-html="item.name"
            ></span>
            <div v-if="item.keyProjectFlag" class="absolute zhongdian-icon"></div>
          </div>
          <div class="w-18 absolute right-0">
            <div class="project-line-arrow"></div>
          </div>
        </div>
      </template>
      <div
        v-else
        class="h-full w-empty-tree mx-44 box-border relative"
      >
        <div class="text-center absolute top-25p left-50p translate-x-n50p">
          <div class="empty-tree-img mb-16"></div>
          <span class="font-color-4 font-family text-14 font-normal">暂无数据</span>
        </div>
      </div>
    </div>
    <div
      class="real-height-div w-full"
      :style="{height: `${treeFullHeight}px`}"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, toRefs, watch, onActivated, onDeactivated} from 'vue'
import { debounce } from './utils.ts'

type Props = {
  treeMap: Array<any>
}

const props = withDefaults(defineProps<Props>(), {
  treeMap: () => [],
})

const {
  treeMap,
} = toRefs(props)

const scrollTop = ref(0)
const renderedTreeData = ref<any[]>([])
const treeFullHeight = ref(0)
const vtreeMoveDistance = ref(0)

const start = ref(0)

watch(treeMap, () => {
  scrollTop.value = 0
  renderedTreeData.value = []
  treeFullHeight.value = 0
  vtreeMoveDistance.value = 0
  calculateVirtualTreeData()
})

const clearTreeMapItemDomHeight = () => {
  for (let i = 0, len = treeMap.value.length; i < len; i++) {
    treeMap.value[i][1].domHeight = 0
  }
}

const fontSizeRatio = ref(1)
const calculateVirtualTreeData = (initialVTreeWrapDomScrollTop: number = 0) => {
  const vtreeWrapDom = document.querySelector('.virtual-tree-wrapper')
  if (!vtreeWrapDom) return
  vtreeWrapDom.scrollTop = initialVTreeWrapDomScrollTop
  vtreeWrapDom.removeEventListener('scroll', scrollListener)
  clearTreeMapItemDomHeight()

  const wrapperCSS = window.getComputedStyle(vtreeWrapDom)
  const realFontSize: number = +wrapperCSS.getPropertyValue('font-size').replace(/(px)$/, '')
  const designFontSize = 16
  fontSizeRatio.value = +(realFontSize / designFontSize).toFixed(3)

  const vtwRealHeightDom = document.querySelector('.virtual-tree-wrapper .real-height-div')
  if (!vtwRealHeightDom) return

  let { width: vtwWidth } = vtwRealHeightDom.getBoundingClientRect()

  vtwWidth -= 6 // 估算移动端纵向滚动条宽度6px
  const calcDomHeight = (name: string, level: number, keyProjectFlag: boolean) => {
    // 当搜索一次之后，name中含有<span style="xx"></span> 这样的标签，在计算内容宽度前要移除掉
    name = name.replace(/<\/span>/g, '').replace(/<span.*>/g, '')
    // name = name.replace(/<span.*>/g, '')
    const nameLen = name.length * designFontSize * fontSizeRatio.value
    // 34 是每行右边的箭头图标 width: 18px 再加上和文字内容间距 16px，共34px。若名称后面还要带上"重点"图标，图标宽28px，左间距16px，共44px
    const boxLen = vtwWidth - level * designFontSize * fontSizeRatio.value - ( keyProjectFlag ? (34 + 44) : 34) * fontSizeRatio.value
    if (nameLen <= boxLen) {
      // 一行能放下
      return +(44 * fontSizeRatio.value).toFixed(2)
    } else {
      // 放多行
      const rowNum = Math.ceil(nameLen / boxLen)
      return +(rowNum * 24 * fontSizeRatio.value + 1 + 14 * fontSizeRatio.value).toFixed(2) // line-height: 24px  border-bottom-width: 1px  padding-top: 7px  padding-bottom: 7px
    }
  }

  const calcUpHiddenCount = (start: number, threshold: number) => {
    let count = 0
    let calcItemHeight = 0
    let lastItemHeight = 0
    for (let i = start, len = treeMap.value.length; i < len; i++) {
      if (calcItemHeight >= threshold) {
        if (i === 0) break
        count--
        lastItemHeight = treeMap.value[i - 1][1].domHeight
        break
      }
      const item = treeMap.value[i][1]
      if (item.domHeight === 0) {
        item.domHeight = calcDomHeight(item.name, item.level, item.keyProjectFlag)
      }
      calcItemHeight += item.domHeight
      count++
    }

    return [ count, calcItemHeight, lastItemHeight ]
  }

  const calcCount = (start: number, threshold: number) => {
    let count = 0
    let calcItemHeight = 0
    for (let i = start, len = treeMap.value.length; i < len; i++) {
      if (calcItemHeight >= threshold) {
        break
      }
      const item = treeMap.value[i][1]
      if (item.domHeight === 0) {
        item.domHeight = calcDomHeight(item.name, item.level, item.keyProjectFlag)
      }
      calcItemHeight += item.domHeight
      count++
    }

    return count
  }

  const calcTreeFullHeight = () => {
    let calcItemHeight = 0
    for (let i = 0, len = treeMap.value.length; i < len; i++) {
      const item = treeMap.value[i][1]
      if (item.domHeight === 0) {
        item.domHeight = calcDomHeight(item.name, item.level, item.keyProjectFlag)
      }
      calcItemHeight += item.domHeight
    }
    return calcItemHeight
  }

  treeFullHeight.value = calcTreeFullHeight()
  const [ upHiddenCount, calcItemHeight, lastItemHeight ] = calcUpHiddenCount(0, vtreeWrapDom.scrollTop)
  /**
   * v-tree 每次 translateY() 下移的距离应该是 calcItemHeight - lastItemHeight
   * 其中 calcItemHeight 是刚好超出 scrollTop 的总dom高度
   * lastItemHeight 是包含在scrollTop中的最后一个列表项lastItem的高度，最后这个列表项有可能完全包含在scrollTop中，
   * 也有可能超出scrollTop
   * 这样设置 translateY()的值，就能保证当一次滚动结束后，当lastItem被遮住一部分的情况时，整个v-tree内容区域就能刚好
   * 停在遮住一部分这种状态。而在计算upHiddenCount时，如果采用向上取整，则当遇到这种lastItem遮住一部分的情况时，v-tree内容区
   * 就会发生跳跃，从"遮住lastItem一部分" 这个状态跳跃到 “从lastItem+1开始完整展示”
   */
  vtreeMoveDistance.value = Math.max(calcItemHeight - lastItemHeight, 0)
  start.value = Math.max(upHiddenCount, 0)

  const { height: vtwHeight, } = vtreeWrapDom.getBoundingClientRect()
  let viewportCount = calcCount(start.value, vtwHeight)
  renderedTreeData.value = treeMap.value.slice(start.value, start.value + viewportCount).map(t => t[1])

  const scrollHandle = (evt: Event) => {
    const target = evt.target as HTMLDivElement
    if (target.scrollTop === scrollTop.value) return

    const { height: vtwHeight } = vtreeWrapDom?.getBoundingClientRect() 
    scrollTop.value = target.scrollTop < 0 ?
                        0 :
                        Math.min(target.scrollTop, treeFullHeight.value - vtwHeight)
    const [ upHiddenCount, calcItemHeight, lastItemHeight ] = calcUpHiddenCount(0, scrollTop.value)
    vtreeMoveDistance.value = Math.max(calcItemHeight - lastItemHeight, 0)
    // 更新起始下标start.value
    start.value = upHiddenCount

    viewportCount = calcCount(start.value, vtwHeight + Math.ceil(vtwHeight * 0.2)) // 高度多算个20%
    renderedTreeData.value = treeMap.value.slice(start.value, start.value + viewportCount).map(t => t[1])
  }

  let ticking = false
  function scrollListener(evt: Event) {
    evt.stopImmediatePropagation()
    if (!ticking) {
      window.requestAnimationFrame(() => {
        scrollHandle(evt)
        ticking = false
      })

      ticking = true
    }
  }
  vtreeWrapDom.addEventListener('scroll', scrollListener)
}

let observerForVTreeWrapperDom: ResizeObserver
const observeVTreeWrapperDom = () => {
  const vtreeWrapDom = document.querySelector('.virtual-tree-wrapper')
  if (!vtreeWrapDom) return

  const debouncedCalculateVirtualTreeData = debounce(calculateVirtualTreeData as any, 500)
  let skipExecuteOnConstruct = true
  observerForVTreeWrapperDom = new ResizeObserver(() => {
    if (skipExecuteOnConstruct) {
      skipExecuteOnConstruct = false
      return
    }
    debouncedCalculateVirtualTreeData(vtreeWrapDom.scrollTop)
  })

  observerForVTreeWrapperDom.observe(vtreeWrapDom, { box: 'content-box', })
}
const unobserveVTreeWrapperDom = () => {
  if (!observerForVTreeWrapperDom) return
  observerForVTreeWrapperDom.disconnect()
}

const flagForOnMounted = ref(false)
onMounted(() => {
  flagForOnMounted.value = true
  setTimeout(() => {
    /**
     * 在vue 3.2.31 版本中，直接在 onMounted()回调中执行 calculateVirtualTreeData()方法
     * 时，document.querySelector('.virtual-tree-wrapper') 获取到的容器 dom 的高度并不是设置的 calc(100% - 104px)，
     * 而是用于撑起容器 dom 滚动条的 treeFullHeight 高度，不知道为何。
     * 因此把 calculateVirtualTreeData() 放在下一轮事件循环再执行，让页面先渲染一次，保证设置的样式 height:calc(100% - 104px) 生效后，
     * 再来获取容器 dom 的高度值。
     * 该问题在vue 3.3.4 版本中不存在
     */
    calculateVirtualTreeData()
    observeVTreeWrapperDom()
  });
})

onActivated(() => {
  // onMounted 没执行时才执行
  if (!flagForOnMounted.value) {
    setTimeout(() => {
      calculateVirtualTreeData()
      observeVTreeWrapperDom()
    })
  }
})

onDeactivated(() => {
  flagForOnMounted.value = false
  unobserveVTreeWrapperDom()
})

const emit = defineEmits<{
  nodeClick: [serialNumber: number],
}>()

const handleItemClick = (evt: MouseEvent) => {
  let target: HTMLElement | null = evt.target as HTMLElement
  while (target && target.dataset.serialNumber === void 0) {
    target = target.parentElement
  }

  target && emit('nodeClick', parseInt(target.dataset.serialNumber as string))
}
</script>

<style>
@import url('./style.css');
</style>
