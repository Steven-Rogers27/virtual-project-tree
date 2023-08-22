<template>
  <div class="search-records-wrapper overflow-hidden px-16">
    <div class="mt-4 h-20 flex items-center justify-between font-family"
    >
      <span class="text-14 font-color-5 font-normal">历史选择</span>
      <span
        class="text-12 font-color-active font-normal cursor-pointer"
        @click="handleClearRecords"
      >清空历史</span>
    </div>
    <div class="overflow-hidden">
      <div
        v-for="(rec, k) in recordList"
        :key="rec.idInfo"
        :class="['h-32 leading-32 w-50p inline-block box-border overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer',
          [ k % 2 ? 'pl-11-5' : 'pr-11-5' ],
          { 'mt-8': k < 2 }, [ recordList.length % 2 ? { 'mb-8': k > recordList.length - 2 } : { 'mb-8': k > recordList.length - 3 } ]]"
        @click="handleRecordClick(rec)"
      >
        <span class="text-14 font-normal font-color font-family">{{ rec.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {toRefs} from 'vue'
defineOptions({
  name: 'SearchRecords',
})
type Props = {
  recordList: Partial<VirtualProjectTreeNamespace.BusinessTreeNode>[]
}
const props = withDefaults(defineProps<Props>(), {
  recordList: () => [],
})
const {
  recordList,
} = toRefs(props)

const emit = defineEmits<{
  recordClick: [record: any],
  clearRecords: []
}>()
const handleRecordClick = (record: any) => {
  emit('recordClick', record)
}
const handleClearRecords = () => {
  emit('clearRecords')
}
</script>

<style>
@import url('./style.css');
</style>
