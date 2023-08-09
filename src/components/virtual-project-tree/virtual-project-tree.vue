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
      <div class="h-36 rounded-19 leading-36 bg-color-2 w-full text-left"></div>
    </div>
    <VirtualTree />
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
import { ref } from 'vue';
import { categoryListMock } from './mock';
import VirtualTree from './virtual-tree.vue'

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

</script>

<style>
@import url('./style.css');
</style>
