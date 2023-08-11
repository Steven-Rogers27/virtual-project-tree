<script setup lang="ts">
import VirtualProjectTree from './components/virtual-project-tree/virtual-project-tree.vue'
import { businessTreeMock, categoryListMock } from './components/virtual-project-tree/mock';
</script>

<template>
  <VirtualProjectTree
    :business-tree="businessTreeMock"
    :tree-params="categoryListMock"
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
