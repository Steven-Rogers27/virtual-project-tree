<template>
  <div
    class="virtual-project-tree-select flex items-center text-16 leading-44 font-medium"
    @click="handleTreeSelect"
  >
    <div class="tree-node-value whitespace-nowrap text-ellipsis overflow-hidden">
      {{nodeName ? nodeName : "请选择节点"}}
    </div>
    <div class="ml-26 mr-8 text-14 font-color-2">
      切换
    </div>
    <div class="exchange-img"></div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

defineOptions({
  name: 'VirtualProjectTreeSelect',
})

type Props = {
  nodeName: string
}

const props = withDefaults(defineProps<Props>(), {
  nodeName: "",
})

const {
  nodeName,
} = toRefs(props)


const emit = defineEmits<{
  selectNodeClick: [],
}>()

const handleTreeSelect = () => {
  emit('selectNodeClick')
}

</script>

<style>
@import url('../virtual-project-tree/style.css');
</style>

<style>
.ml-26 {
  margin-left: 26px;
}
.virtual-project-tree-select {
  height: 52px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 1);
  .tree-node-value {
    width: calc(100% - 78px);
    color: #000;
  }
}
.exchange-img {
  background-image: url('./exchange.svg');
  background-size: cover;
  background-repeat: no-repeat;
  width: 16px;
  height: 16px;
}
</style>