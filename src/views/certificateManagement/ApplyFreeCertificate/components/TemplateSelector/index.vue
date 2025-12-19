<template>
  <div class="template-selector">
    <!-- 模板选择头部 -->
    <div class="template-header">
      <div>
        <span>请选择信息模板，或者</span>
        <span class="template-link" @click="handleCreateTemplate">新建模板</span>
      </div>
      <el-input
        v-model="queryParams.name"
        placeholder="搜索模板名称"
        class="template-search"
        clearable
      >
        <template #prefix>
          <el-icon class="search-icon" @click="handleSearch">
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-tooltip content="刷新" placement="top" effect="light">
        <el-button @click="handleRefresh" class="refresh-btn"
          ><el-icon :size="16"><RefreshRight /></el-icon
        ></el-button>
      </el-tooltip>
    </div>
    <!-- 模版列表 -->
    <el-table
      :data="allList"
      @row-click="handleSelectTemplateRow"
      highlight-current-row
      class="template-table"
    >
      <el-table-column width="50" align="center">
        <template #default="{ row }">
          <el-radio v-model="selectedId" :label="row.id">
            <span style="display: none">{{ row.id }}</span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="holderType" label="模版持有者类型" width="140" />
      <el-table-column prop="name" label="模版名称" />
      <el-table-column prop="contactName" label="联系人姓名" />
      <el-table-column prop="contactEmail" label="联系人邮箱" />
      <el-table-column prop="contactMobile" label="联系人手机" />
      <el-table-column prop="tags" label="标签">
        <template #header>
          <div class="table-filter-container">
            <span>标签</span>
            <TableFilterPopover
              :isFilter="queryParams.tags.length > 0"
              @search="handleTagSearch"
              @reset="onReset('tags', [])"
            >
              <template #content>
                <TagInput ref="tagInputRef" v-model="queryParams.tags" :max="20" />
              </template>
            </TableFilterPopover>
          </div>
        </template>
        <template #default="scope">
          <el-icon class="mr-1"><PriceTag /></el-icon>
          <el-tooltip
            v-if="scope.row.tags.length === 0"
            class="box-item"
            placement="top"
            effect="light"
            content="暂无标签"
          >
            {{ scope.row.tags.length }}
          </el-tooltip>
          <span v-else>{{ scope.row.tags.length }}</span>
          <el-tooltip class="box-item" placement="top" effect="light" content="编辑">
            <el-icon class="edit-icon" @click.stop="handleEditTags(scope.row)">
              <EditPen />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" sortable />
      <template #empty>
        <el-empty>
          <template #description>
            <div class="description-text"
              >暂无数据，<span class="template-link" @click="handleCreateTemplate"
                >新建模板</span
              ></div
            >
          </template>
        </el-empty>
      </template>
    </el-table>
    <div class="template-pagination">
      <Pagination
        v-model="queryParams.page"
        :page-size="queryParams.pageSize"
        :total="totalRecords"
        :page-sizes="[10, 20, 50, 100]"
        @change="handlePageChange"
        layout="total, sizes, prev, pager, next"
        small
      />
    </div>
  </div>
  <!-- 编辑标签 -->
  <EditTags
    ref="editTagsRef"
    v-model:visible="editTagsVisible"
    v-model:tags="tagList"
    :tableDataList="rowTableList"
    @confirmEditTags="confirmEditTags"
  />
  <!-- 新建模板弹框 -->
  <CreateTemplate v-model:visible="createTemplateVisible" @confirm="handleTemplateCreated" />
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue'
import { Search, RefreshRight, PriceTag, EditPen } from '@element-plus/icons-vue'
import { TableFilterPopover } from '@/components/TableFilterPopover'
import TagInput from '@/views/certificateManagement/components/TagInput/index.vue'
import { Pagination } from '@/components/Pagination'
import EditTags from '@/views/certificateManagement/components/EditTags/index.vue'
import CreateTemplate from '../CreateTemplate/index.vue'

interface TemplateItem {
  id: string
  holderType: string
  name: string
  contactName: string
  contactEmail: string
  contactMobile: string
  tags: string[]
  createdAt: string
}
interface TemplateQuery {
  page: number
  pageSize: number
  name: string
  tags: string[]
}
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'create-template'): void
}>()

const tagInputRef = ref<InstanceType<typeof TagInput> | null>(null)
const allList = ref<TemplateItem[]>([])
const totalRecords = ref(0)
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  name: '',
  tags: []
})
const selectedId = ref('')
const loading = ref(false)
// 编辑标签相关
const tagList = ref<string[]>([])
const rowTableList = ref<any[]>([])
const editTagsVisible = ref(false)
// 新建模版相关
const createTemplateVisible = ref(false)

watch(selectedId, (val) => {
  emit('update:modelValue', val)
})

const handleSearch = async () => {}

const handleTagSearch = async (callback?: (shouldClose?: boolean) => void) => {
  if (tagInputRef.value) {
    const valid = await tagInputRef.value.validate()
    const shouldClose = true
    if (!valid) {
      return
    }
    if (callback) callback(shouldClose)
  }
  handleSearch()
}

const onReset = (label: keyof TemplateQuery, value: any) => {
  console.log(label)
  console.log(value)
  queryParams.tags = []
  getList()
}
// 切换分页
const handlePageChange = (page: number, pageSize: number) => {
  queryParams.page = page
  queryParams.pageSize = pageSize
  getList()
}
// 获取列表
const getList = async () => {
  try {
    loading.value = true
    // const res = await apiGetTemplatesList(queryParams)
    const res = {
      data: {
        list: [
          {
            id: '1',
            holderType: '个人',
            name: '模版名称A1',
            contactName: '张三',
            contactEmail: '1833****72@163.com',
            contactMobile: '1833****722',
            tags: [],
            createdAt: '2025-11-18 12:09:08'
          },
          {
            id: '2',
            holderType: '企业',
            name: '模版名称A2',
            contactName: '李四',
            contactEmail: '1832****72@163.com',
            contactMobile: '1833****721',
            tags: ['财务'],
            createdAt: '2025-11-17 12:09:08'
          },
          {
            id: '3',
            holderType: '个人',
            name: '模版名称A3',
            contactName: '王五',
            contactEmail: '1831****72@163.com',
            contactMobile: '1833****720',
            tags: ['测试', '默认'],
            createdAt: '2025-11-16 12:09:08'
          }
        ],
        pagination: {
          total: 3
        }
      }
    }
    allList.value = res.data.list
    totalRecords.value = res.data.pagination.total
  } finally {
    loading.value = false
  }
}
// 刷新
const handleRefresh = () => {
  getList()
}

const handleSelectTemplateRow = (row: TemplateItem) => {
  emit('update:modelValue', row.id)
  selectedId.value = row.id
}
// 标签相关（模板列表）
const handleEditTags = (row: any) => {
  tagList.value = row.tags || []
  rowTableList.value = [row]
  editTagsVisible.value = true
}
// 确认编辑标签
const confirmEditTags = () => {
  editTagsVisible.value = false
}
// 新建模版
const handleCreateTemplate = () => {
  createTemplateVisible.value = true
}
// 确认新建模版
const handleTemplateCreated = () => {
  getList()
  // templateList.value.unshift(template)
  // selectedTemplate.value = template
  // formData.templateId = template.id
  createTemplateVisible.value = false
}
onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
.template-selector {
  width: 100%;
  .template-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    justify-content: space-between;
    color: #909399;
    font-size: 13px;
    .template-search {
      width: 200px;
      .search-icon {
        color: #909399;
        cursor: pointer;
      }
    }
    .refresh-btn {
      width: 32px;
      height: 32px;
      margin-left: 8px;
    }
  }
  .template-link {
    color: #1664ff;
    cursor: pointer;
  }
  .template-table {
    margin-bottom: 16px;
    .edit-icon {
      display: none;
      cursor: pointer;
      margin-left: 5px;
    }
    :deep(.el-table__cell) {
      .el-icon {
        vertical-align: middle;
        margin-top: -4px;
      }
      &:hover .edit-icon {
        display: inline-block;
      }
    }
  }
  .template-pagination {
    display: flex;
    justify-content: flex-end;
  }
  .table-filter-container {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
