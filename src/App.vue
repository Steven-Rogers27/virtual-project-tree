<script setup lang="ts">
import { businessTreeMock, categoryListMock } from './mock/mock';

const handleNodeClick = (params: unknown) => {
  console.log(params)
}
const handleConfirmClick = (params: unknown) => {
  console.log(params)
}
</script>

<template>
  <VirtualProjectTree
    :business-tree="businessTreeMock"
    :tree-params="categoryListMock"
    :sub-system-mark="'crcc12-gongchengsl'"
    @node-click="handleNodeClick"
    @confirm-click="handleConfirmClick"
  >
  </VirtualProjectTree>
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
