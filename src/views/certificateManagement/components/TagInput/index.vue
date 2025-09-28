<template>
  <div class="tag-input">
    <!-- 已有标签 -->
    <div v-if="modelValue.length > 0" class="form-item-tag">
      <div v-for="(tag, index) in modelValue" :key="index" class="item-tag">
        <el-input
          :model-value="tag"
          placeholder="请输入标签"
          maxlength="50"
          @update:modelValue="updateTag($event, index)"
        />
        <el-icon class="cursor-pointer" @click="removeTag(index)">
          <Delete />
        </el-icon>
      </div>
    </div>
    <!-- 添加标签 -->
    <div class="add-tag">
      <span @click="addTag" :class="{ 'is-disabled': modelValue.length >= max }">
        <el-icon><CirclePlus /></el-icon> 添加标签
      </span>
      <span> 还可添加 {{ max - modelValue.length }} 个标签 </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, CirclePlus } from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue: string[]
  max?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string[]): void
}>()

const max = props.max ?? 50

const addTag = () => {
  if (props.modelValue.length >= max) return
  emit('update:modelValue', [...props.modelValue, ''])
}

const removeTag = (index: number) => {
  const newTags = [...props.modelValue]
  newTags.splice(index, 1)
  emit('update:modelValue', newTags)
}

const updateTag = (val: string, index: number) => {
  const newTags = [...props.modelValue]
  newTags[index] = val
  emit('update:modelValue', newTags)
}
</script>
<style lang="less" scoped>
.form-item-tag {
  .item-tag {
    margin-top: 10px;
    display: flex;
    align-items: center;
    ::v-deep {
      .el-input {
        width: 300px;
        margin-right: 10px;
      }
    }
  }
}
.add-tag {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  margin: 15px 0;
  > span:nth-child(1) {
    display: flex;
    gap: 5px;
    color: rgb(22, 100, 255);
    align-items: center;
    margin-right: 8px;
    cursor: pointer;
  }
  .is-disabled {
    cursor: not-allowed !important;
    opacity: 0.6;
  }
}
</style>
