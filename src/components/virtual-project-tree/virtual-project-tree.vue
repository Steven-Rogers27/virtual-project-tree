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
    <div class="box-border h-52 px-16 py-8 leading-36 bg-color-white text-left relative">
      <van-config-provider
        :theme-vars="vanSearchThemeVars"
      >
        <van-search
          :class="[[searchValueNonEmpty ? 'search-narrow-status transition-width' : 'search-wide-status transition-width'], 'v-project-tree-van-search']"
          v-model="searchValue"
          placeholder="搜索"
          shape="round"
          background="rgba(247, 248, 250, 1)"
          autocomplete="off"
          :clearable="false"
          :right-icon="searchValueNonEmpty ? 'clear' : ''"
          @search="handleSearch"
          @click-left-icon="handleSearch"
          @click-right-icon="handleSearchClear"
        />
      </van-config-provider>
      <span
        :class="[[searchValueNonEmpty ? 'opacity-100 transition-opacity cursor-pointer' : 'opacity-0 transition-opacity z-n1'], 'text-16 font-normal font-family font-color text-left ml-8 absolute top-8 right-16']"
        @click="handleSearchClear"
      >取消</span>
    </div>
    <SearchRecords
      v-if="!isSearchRecordListEmpty"
      :record-list="searchRecordList"
      @record-click="emitNodeClick"
      @clear-records="handleClearRecords"
    />
    <VirtualTree
      :style="{ height: virtualTreeHeight }"
      :tree-map="treeMap"
      @node-click="handleTreeItemClick"
    />
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
              :class="[[activedTreeParams[opt.category!] === opt.code ? 'dropdown-option bg-color-active-008 ' : 'bg-color-1'], 'relative rounded-16  leading-32 min-h-32 text-center box-border min-w-58 mt-12 mr-8 cursor-pointer inline-block px-15 whitespace-nowrap']"
              v-for="opt in cate.options"
              :key="opt.name"
              @click="handleDropdownOptionClick(opt)"
            ><span :class="[[activedTreeParams[opt.category!] === opt.code ? 'font-color-active' : 'font-color'], 'font-family text-14 font-normal'] ">{{opt.name}}</span></div>
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
        <div
          class="h-40 leading-40 w-48-1p inline-block text-center rounded-100 border-color-1 border-1 border-solid mr-12"
          @click="handleDropdownReset"
        >
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
import {reactive, computed, ref, toRefs, watch, onActivated, onDeactivated,} from 'vue';
import VirtualTree from './virtual-tree.vue'
import SearchRecords from "./search-records.vue"
import { treeFlatten, isObjectType, createInvokeHttpWithLock, BusinessNodeType } from './utils'
import {
  http,
  httpGetAppRecentIdInfos,
  httpGetClearRecentIdInfos,
  httpGetHomePageTreeParameter,
  httpGetSubSystemTree, httpPostPutSoleNodeSelected
} from './http'

defineOptions({
  name: 'VirtualProjectTree',
})

type Props = {
  businessTree: Array<Partial<VirtualProjectTreeNamespace.BusinessTreeNode>>
  treeParams: VirtualProjectTreeNamespace.BusinessTreeParameter
  defaultActivedTreeParams: VirtualProjectTreeNamespace.DefaultActivedBusinessTreeParameter
  defaultHideStatus: boolean
  businessTreeType: number
  platformId: number
  subSystemMark: string
  corporationClickable: boolean // 集团、公司级是否可点
  treeApiBuiltInEnable: boolean // 默认启用组件内部调用 httpGetHomePageTreeParameter 和 httpGetSubSystemTree 接口
}
const props = withDefaults(defineProps<Props>(), {
  businessTree: () => [],
  treeParams: () => ({}),
  defaultActivedTreeParams: () => ({
    projectStatus: '0200', // 默认选中 在建
    majorType: '',
    projectType: '',
  }),
  defaultHideStatus: false,
  businessTreeType: 1, // 默认 工程信息树
  platformId: 1, // 默认 铁建平台
  subSystemMark: '',
  corporationClickable: true,
  treeApiBuiltInEnable: true,
})

const {
  businessTree,
  treeParams,
  defaultActivedTreeParams,
  defaultHideStatus,
  businessTreeType,
  platformId,
  subSystemMark,
  corporationClickable,
  treeApiBuiltInEnable,
} = toRefs(props)

const filterDropdownStatus = ref(false)
const handleFilterClick = () => {
  filterDropdownStatus.value = !filterDropdownStatus.value
}
const handleMaskClick = () => {
  filterDropdownStatus.value = false
}

const handleDropdownOptionClick = (opt: VirtualProjectTreeNamespace.BusinessTreeParameterOption) => {
  if (opt.code === activedTreeParams[opt.category!]) return
  activedTreeParams[opt.category!] = opt.code
}

const hideStatus = ref(false)
watch(defaultHideStatus, (v) => hideStatus.value = v, {
  immediate: true,
})
const handleHideClick = () => {
  hideStatus.value = !hideStatus.value
}

const handleDropdownConfirm = () => {
  handleMaskClick()
  /**
   * 筛选条件改变时重新查接口
   */
  invokeHttpGetSubSystemTree()
  emit('confirmClick', {
    ...activedTreeParams,
    hideStatus: hideStatus.value,
  })
}

const handleDropdownReset = () => {
  activedTreeParams.majorType = ''
  activedTreeParams.projectStatus = ''
  activedTreeParams.projectType = ''
  hideStatus.value = false
}

const searchValue = ref('')
const vanSearchThemeVars = reactive({
  searchPadding: '0',
  searchInputHeight: '36px',
  fieldIconSize: '16px',
  badgeFontWeight: 400,
  cellLineHeight: '28px',
  fieldClearIconSize: '16px',
  fieldRightIconColor: 'rgba(200, 201, 204, 1)',
})
const searchValueNonEmpty = computed(() => {
  return !!(searchValue.value || '').trim().length
})

const handleSearchClear = () => {
  searchValue.value = ''
  handleSearch()
}
const handleSearch = () => {
  const kw = (searchValue.value || '').trim()
  if (!kw.length) {
    treeMap.value = fullTreeMap.value
    return
  }

  const newTreeMap = []
  const fullTreeNameList = fullTreeMap.value.map(t => t[1].name)
  for (let i = 0, len = fullTreeNameList.length; i < len; i++) {
    const nameCharList = fullTreeNameList[i].split('')
    const kwCharList = kw.split('')
    let match = true
    let j = 0
    for (let k = 0, kLen = kwCharList.length; k < kLen; k++) {
      let found = false
      for (let jLen = nameCharList.length; j < jLen; j++) {
        if (kwCharList[k] === nameCharList[j]) {
          found = true
          j++
          break
        }
      }
      if (!found) {
        match = false
        break
      }
    }
    if (match) {
      let name = ''
      for (let n = 0, nLen = nameCharList.length; n < nLen; n++) {
        if (kwCharList.includes(nameCharList[n])) {
          name += `<span style="color: rgba(26, 121, 255, 1);">${nameCharList[n]}</span>`
        } else {
          name += nameCharList[n]
        }
      }

      newTreeMap.push([
        fullTreeMap.value[i][0],
        {
          ...fullTreeMap.value[i][1],
          name,
        },
      ])
    }
  }

  treeMap.value = newTreeMap
}

const treeMap = ref<any[]>([])
const fullTreeMap = ref<any[]>([])
let fullTreeMapResolve: (...args: any[]) => void
const fullTreeMapPromise = new Promise((resolve) => {
  fullTreeMapResolve = resolve
})
const handleBusinessTreeChange = (data: Array<Partial<VirtualProjectTreeNamespace.BusinessTreeNode>>) => {
  fullTreeMap.value = treeMap.value = treeFlatten(data)
  if (typeof fullTreeMapResolve === 'function') {
    fullTreeMapResolve()
  }
}

watch(businessTree, () => {
  handleBusinessTreeChange(businessTree.value)
}, {
  immediate: true
})

interface Category {
  category: string
  options: VirtualProjectTreeNamespace.BusinessTreeParameterOption[]
}

const categoryList = ref<Category[]>([])
const activedTreeParams = reactive<Record<string, string>>({
  projectStatus: '',
  majorType: '',
  projectType: '',
})

watch(defaultActivedTreeParams, (params) => {
  activedTreeParams.majorType = params.majorType
  activedTreeParams.projectStatus = params.projectStatus
  activedTreeParams.projectType = params.projectType
}, {
  immediate: true,
})

const handleTreeParamsChange = (params: VirtualProjectTreeNamespace.BusinessTreeParameter) => {
  if (!isObjectType(params)) return

  const list: Category[] = []
  const map = new Map<string, string>([
    ['projectStatus', '状态'],
    ['majorType', '重点项目'],
    ['projectType', '工程类型'],
  ])

  Reflect.ownKeys(params).forEach((k) => {
    list.push({
      category: map.get(k as string) || '其他',
      options: (params[k as string] || []).map(o => {
        return {
          ...o,
          category: k as string,
        }
      }),
    })
  })

  categoryList.value = list
}

watch(treeParams, (params) => {
  handleTreeParamsChange(params)
}, {
  immediate: true,
})

const emit = defineEmits<{
  nodeClick: [node: any],
  confirmClick: [params: Record<string, string | boolean>],
  clearSearchRecords: [],
}>()

const handleTreeItemClick = (serialNumber: number) => {
  const item = fullTreeMap.value[serialNumber][1]
  emitNodeClick(item)
}

const emitNodeClick = (item: any) => {
  // 不允许点集团、公司级节点
  if (!corporationClickable.value) {
    if (item.type === BusinessNodeType.corporation) return
  }
  const cp = {...item}
  Reflect.deleteProperty(cp, 'domHeight')
  Reflect.deleteProperty(cp, 'serialNumber')
  emit('nodeClick', cp)
  invokeHttpPostPutSoleNodeSelected(cp)
}

const handleClearRecords = () => {
  invokeHttpGetClearRecentIdInfos()
  emit('clearSearchRecords')
}

const searchRecordList = ref<any[]>([])
const isSearchRecordListEmpty = computed(() => !searchRecordList.value.length)

const virtualTreeHeight = ref('0')
watch(() => searchRecordList.value.length, () => {
  // 历史记录数目改变时，重新计算虚拟树的容器高度
  setTimeout(() => {
    const searchRecordsWrapperDom = document.querySelector('.search-records-wrapper')
    if (!searchRecordsWrapperDom) {
      virtualTreeHeight.value = `calc(100% - 104px)`
      return
    }
    const { height } = searchRecordsWrapperDom.getBoundingClientRect()
    virtualTreeHeight.value = `calc(100% - 104px - ${height}px)`
  })
}, {
  immediate: true
})

const invokeHttpGetClearRecentIdInfos = createInvokeHttpWithLock(
  () =>
     httpGetClearRecentIdInfos({
      platformId: platformId.value,
      businessTreeType: businessTreeType.value,
    }).then(() => {
      // 清除完后重新调 invokeHttpGetAppRecentIdInfos
      invokeHttpGetAppRecentIdInfos()
    })
  ,
  !!http
)

const invokeHttpGetAppRecentIdInfos = createInvokeHttpWithLock(
  () =>
    httpGetAppRecentIdInfos({
      platformId: platformId.value,
      businessTreeType: businessTreeType.value,
    }).then(data => {
      fullTreeMapPromise.then(() => {
        updateSearchRecordList(data || [])
      })
    })
  ,
  !!http
)

const invokeHttpPostPutSoleNodeSelected = createInvokeHttpWithLock(
  (node) =>
    httpPostPutSoleNodeSelected({
      platformId: platformId.value,
      businessTreeType: businessTreeType.value,
    }, {
      ...node
    }).then(() => {
      // 重新查历史记录
      invokeHttpGetAppRecentIdInfos()
    })
  ,
  !!http
)

const updateSearchRecordList = (data: any[]) => {
  const recordList = []
  for (let i = 0, len = data.length; i < len; i++) {
    const d = data[i]
    const idx: number = fullTreeMap.value.findIndex(t => t[0] === d.idInfo)
    if (~idx) {
      recordList.push(fullTreeMap.value[idx][1])
    }
  }
  searchRecordList.value = recordList.slice(0, 4) // 最多只展示4个历史记录
}

const invokeHttpGetSubSystemTree = createInvokeHttpWithLock(
   () =>
    httpGetSubSystemTree({
      platformId: platformId.value,
      projectDisableFlag: hideStatus.value,
      projectMajorTypeCode: activedTreeParams.majorType,
      projectStatusCode: activedTreeParams.projectStatus,
      projectTypeCode: activedTreeParams.projectType,
      subSystemMark: subSystemMark.value,
      subTreeValue: businessTreeType.value,
    }).then(data => {
      handleBusinessTreeChange(data)
    })
  ,
  http && treeApiBuiltInEnable.value
)

const invokeHttpGetHomePageTreeParameter = createInvokeHttpWithLock(
  () =>
    // 传入axios实例则启用组件内部封装的接口调用
    httpGetHomePageTreeParameter({
      businessTreeType: businessTreeType.value,
      platformId: platformId.value
    }).then(async data => {
      handleTreeParamsChange(data)
      await invokeHttpGetSubSystemTree()
    })
  ,
  http && treeApiBuiltInEnable.value
)

invokeHttpGetHomePageTreeParameter()
invokeHttpGetAppRecentIdInfos()

onActivated(() => {
  invokeHttpGetHomePageTreeParameter()
  invokeHttpGetAppRecentIdInfos()
})

onDeactivated(() => {
  handleSearchClear()
})

watch([businessTreeType, platformId], () => {
  invokeHttpGetHomePageTreeParameter()
  invokeHttpGetAppRecentIdInfos()
})
watch(subSystemMark, () => {
  invokeHttpGetSubSystemTree()
})
</script>

<style>
@import url('./style.css');
</style>
