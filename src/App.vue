<script setup lang="ts">
// import { businessTreeMock, categoryListMock } from './components/virtual-project-tree/mock';

const handleConfirmClick = (params: unknown) => {
  console.log(params)
}
</script>

<template>
    <!-- :business-tree="businessTreeMock"
    :tree-params="categoryListMock" -->
  <VirtualProjectTree
    :sub-system-mark="'crcc12-gongchengsl'"
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
