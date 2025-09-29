<template>
  <div class="table-toolbar">
    <!-- 左侧按钮组 -->
    <div class="toolbar-left">
      <el-button v-for="btn in buttons" :key="btn.key" :type="btn.type" @click="btn.onClick">
        {{ btn.label }}
      </el-button>
    </div>

    <!-- 右侧搜索/筛选 + 刷新 -->
    <div class="toolbar-right">
      <el-select
        v-if="searchOptions && searchOptions.length > 0"
        v-model="searchParams.subjectKeyword"
        placeholder="请选择"
        style="width: 120px"
        @change="handleInput"
      >
        <el-option
          v-for="option in searchOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <el-input
        v-model="searchParams.nameKeyword"
        placeholder="请输入关键字"
        @input="handleInput"
        @keyup.enter="handleSearch"
        style="width: 200px; margin-left: 8px"
      />
      <el-tooltip content="刷新" placement="top" effect="light">
        <el-button @click="handleRefresh" class="refresh-btn"
          ><el-icon :size="16"><RefreshRight /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { debounce } from 'lodash-es'

interface ButtonItem {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  onClick: () => void
}

interface SearchOption {
  label: string
  value: string
}
interface SearchParams {
  nameKeyword: string
  subjectKeyword?: string
}
const props = defineProps<{
  buttons: ButtonItem[]
  searchOptions?: SearchOption[]
  searchValue?: string
}>()

const emit = defineEmits<{
  (e: 'search', params: SearchParams): void
  (e: 'refresh', params: SearchParams): void
}>()
const searchParams = ref({
  nameKeyword: props.searchValue || '',
  subjectKeyword: props.searchOptions?.[0]?.value || ''
})

/** 防抖搜索函数 */
const debounceSearch = debounce(() => {
  emit('search', { ...searchParams.value })
}, 300)
// 输入实时触发搜索
const handleInput = () => debounceSearch()
// 回车触发搜索
const handleSearch = () => {
  emit('search', { ...searchParams.value })
}

// 刷新
const handleRefresh = () => {
  emit('refresh', { ...searchParams.value })
}

// 外部更新 keyword 时同步
watch(
  () => props.searchValue,
  (val) => {
    searchParams.value.nameKeyword = val || ''
  }
)
</script>

<style scoped>
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 15px;
}

.toolbar-left {
  display: flex;
}

.toolbar-right {
  display: flex;
  align-items: center;
}
.refresh-btn {
  width: 32px;
  height: 32px;
  margin-left: 8px;
}
</style>
