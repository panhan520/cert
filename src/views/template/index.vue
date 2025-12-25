<template>
  <div class="template-management-page">
    <ManagementList
      :title="title"
      :table-data="allTemplates"
      :loading="loading"
      :total-records="totalRecords"
      :filters="toolbarFilters"
      :columns="tableColumns"
      :query-params="queryParams"
      @search="handleSearch"
      @refresh="handleRefresh"
      @page-change="handlePageChange"
      storageKey="template_columnConfig"
    >
      <template #columns="{ displayColumns }">
        <template v-for="column in displayColumns" :key="column.prop">
          <TableActionsColumn
            v-if="column.prop === 'actions'"
            :main-actions="templateRowActions"
            :width="column.width"
            @edit="handleEdit"
            @action="handleRowAction"
          />
          <el-table-column
            v-else
            :prop="column.prop"
            :label="column.label"
            :width="column.width"
            :min-width="column.minWidth"
            :sortable="column.sortable"
          >
            <!-- 标签表头筛选 -->
            <template #header v-if="column.prop === 'tags'">
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
              <el-tooltip v-if="column.prop === 'name'" :content="scope.row.name" placement="top">
                <div class="app-type-ellipsis">{{ scope.row.name }} </div>
              </el-tooltip>
              <template v-if="column.prop === 'tags'">
                <el-icon class="mr-1"><PriceTag /></el-icon>
                <el-tooltip
                  v-if="scope.row.host_ids.length === 0"
                  class="box-item"
                  placement="top"
                  content="暂无标签"
                >
                  {{ scope.row.host_ids.length }}
                </el-tooltip>
                <el-popover v-else placement="top" trigger="hover" popper-class="domain-popover">
                  <template #reference>
                    <span>{{ scope.row.host_ids.length }}</span>
                  </template>
                  <div class="domain-list-popover">
                    <div class="domain-list-scroll">
                      <div
                        v-for="(item, index) in scope.row.host_ids"
                        :key="`popover-${scope.row.id}-${index + 2}`"
                        class="domain-list"
                      >
                        <div class="domain-popover-item">
                          <span class="domain-popover-text">{{ item }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-popover>
                <el-tooltip class="box-item" placement="top" content="编辑">
                  <el-icon class="edit-icon" @click="handleEditTags(scope.row)">
                    <EditPen />
                  </el-icon>
                </el-tooltip>
              </template>
            </template>
          </el-table-column>
        </template>
      </template>
    </ManagementList>
    <!-- 新建模板弹框 -->
    <CreateTemplate v-model:visible="createTemplateVisible" @confirm="handleTemplateCreated" />
    <!-- 查看详情抽屉 -->
    <TemplateDetail
      v-model:visible="detailTemplateVisible"
      :rowInfo="deleteDialog.target"
      @confirm="handleTemplateDetail"
    />
    <!-- 编辑标签 -->
    <EditTags
      ref="editTagsRef"
      v-model:visible="editTagsVisible"
      v-model:tags="tagList"
      :tableDataList="rowTableList"
      :columns="tagsColumns"
      @confirmEditTags="confirmEditTags"
    />
    <!-- 删除模版 -->
    <DeleteConfirmDialog
      v-model:visible="deleteDialog.visible"
      title="删除模版"
      :description="`将删除【${deleteDialog.target?.name}】,删除后该模版将被清除且无法被引用，请谨慎操作。`"
      :loading="deleteDialog.loading"
      @confirm="confirmDeleteTemplate"
      @cancel="handleDeleteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ManagementList } from '@/components/ManagementList'
import { TableColumn } from '@/components/Table'
import type { ToolbarFilter } from '@/components/TableToolbar'
import { Search } from '@element-plus/icons-vue'
import { TableActionsColumn, type TableAction } from '@/components/TableActionsColumn'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { apiGetTemplatesList, apiCreateTemplates, apiDeleteTemplate } from '@/api/template'
import type { TemplateRecord } from '@/api/template/type'
import CreateTemplate from '@/views/certificateManagement/ApplyFreeCertificate/components/CreateTemplate/index.vue'
import EditTags from '@/views/certificateManagement/components/EditTags/index.vue'
import { TableFilterPopover } from '@/components/TableFilterPopover'
import TagInput from '@/views/certificateManagement/components/TagInput/index.vue'
import TemplateDetail from './components/TemplateDetail/index.vue'

const title = '模版管理'
const loading = ref(false)
const allTemplates = ref<TemplateRecord[]>([])
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  query: '',
  type: '',
  tags: []
})
const templateTypeList = [
  {
    label: '全部',
    value: 'All'
  },
  {
    label: '个人',
    value: 'person'
  },
  {
    label: '企业',
    value: 'company'
  }
]
const tagList = ref<string[]>([])
const rowTableList = ref<any[]>([])
const editTagsVisible = ref(false)
// 表格筛选项（左侧）
const toolbarFilters = computed<ToolbarFilter[]>(() => [
  {
    key: 'create',
    label: '新建模版',
    type: 'button',
    onClick: () => openTemplateDialog()
  },
  {
    key: 'type',
    type: 'radio',
    options: templateTypeList
  },
  {
    key: 'query',
    type: 'input',
    placeholder: '搜索模版名称',
    width: 220,
    prefixIcon: Search
  }
])
// 表格列
const tableColumns = [
  { prop: 'type', label: '模版持有者类型', minWidth: 120, order: 0 },
  { prop: 'name', label: '模版名称', order: 1 },
  { prop: 'contactName', label: '联系人姓名', minWidth: 150, slot: 'body', order: 2 },
  { prop: 'email', label: '联系人邮箱', minWidth: 150, order: 3 },
  { prop: 'mobile', label: '联系人手机', minWidth: 150, order: 4 },
  { prop: 'tags', label: '标签', slot: 'tags', order: 5 },
  { prop: 'time', label: '创建时间', minWidth: 150, order: 6 },
  { prop: 'actions', label: '操作', slot: 'actions', width: 150, order: 7 }
]
// 行内操作栏
const templateRowActions: TableAction[] = [
  {
    key: 'detail',
    label: '查看详情',
    type: 'primary',
    text: true
  },
  {
    key: 'delete',
    label: '删除',
    type: 'danger',
    link: true
  }
]
const tagsColumns: TableColumn[] = [
  {
    field: 'type',
    label: '模版持有者类型'
  },
  {
    field: 'name',
    label: '模版名称'
  }
]
const totalRecords = ref(0)
const templateDialogVisible = ref(false)
const templateDialogLoading = ref(false)
const editorInitialData = ref(null)
const currentEditingId = ref<number | null>(null)
const dialogTitle = computed(() => (editorInitialData.value ? '编辑模版' : '新建模版'))
const tagInputRef = ref<InstanceType<typeof TagInput> | null>(null)

// 新建模版相关
const createTemplateVisible = ref(false)
const detailTemplateVisible = ref(false)
// 获取模版列表
const getList = async () => {
  try {
    loading.value = true
    const res = await apiGetTemplatesList(queryParams)
    allTemplates.value = res.data.list
    totalRecords.value = res.data.pagination.total
  } finally {
    loading.value = false
  }
}
// 开启编辑标签
const handleEditTags = (row: any) => {
  tagList.value = row.tags
  rowTableList.value = [row]
  editTagsVisible.value = true
}
// 确认编辑标签
const confirmEditTags = () => {
  // updateCertData({ certId: rowTableList.value[0].id, modifyTags: true, tags: tagList.value })
  editTagsVisible.value = false
}
// 标签搜索
const handleTagSearch = async (callback?: (shouldClose?: boolean) => void) => {
  if (tagInputRef.value) {
    const valid = await tagInputRef.value.validate()
    const shouldClose = true
    if (!valid) {
      return
    }
    if (callback) {
      callback(shouldClose)
    }
  }
  getList()
}
// 重置
const onReset = (label: string, value: any) => {
  ;(queryParams as any)[label] = value
  getList()
}
// 确认新建模版
const handleTemplateCreated = () => {
  getList()
  // templateList.value.unshift(template)
  // selectedTemplate.value = template
  // formData.templateId = template.id
  createTemplateVisible.value = false
}
// 查看详情关闭
const handleTemplateDetail = (row: any) => {
  detailTemplateVisible.value = false
}
// 打开编辑保存模版的弹框
const openTemplateDialog = (row?) => {
  if (row) {
    currentEditingId.value = row.id
    editorInitialData.value = {
      ...row
    }
  } else {
    currentEditingId.value = null
    editorInitialData.value = null
  }
  createTemplateVisible.value = true
}
// 新建编辑模版的保存操作
const handleTemplateSubmit = async (payload) => {
  try {
    templateDialogLoading.value = true
    const params = { ...payload }
    if (currentEditingId.value) {
      params.id = currentEditingId.value
    }
    await apiCreateTemplates(params)
    ElMessage.success(currentEditingId.value ? '编辑成功' : '添加成功')
    getList()
    templateDialogLoading.value = false
    templateDialogVisible.value = false
  } finally {
    templateDialogLoading.value = false
  }
}

const handleSearch = (params: Record<string, any>) => {
  queryParams.query = params.query || ''
  queryParams.type = params.type || ''
  queryParams.page = 1
  getList()
}

const handleRefresh = () => {
  getList()
}

const handlePageChange = (page: number, pageSize: number) => {
  queryParams.page = page
  queryParams.pageSize = pageSize
  getList()
}
// 编辑
const handleEdit = (row: TemplateRecord) => {
  openTemplateDialog(row)
}

const deleteDialog = reactive<{
  visible: boolean
  target: TemplateRecord | null
  loading: boolean
}>({
  visible: false,
  target: null,
  loading: false
})

const openDeleteDialog = (row: TemplateRecord) => {
  deleteDialog.target = row
  deleteDialog.visible = true
}
const openDetailDialog = (row: TemplateRecord) => {
  deleteDialog.target = row
  detailTemplateVisible.value = true
}
// 删除模版
const confirmDeleteTemplate = async () => {
  if (!deleteDialog.target) return
  try {
    deleteDialog.loading = true
    await apiDeleteTemplate(deleteDialog.target.id)
    ElMessage.success('删除成功')
    getList()
    deleteDialog.visible = false
    deleteDialog.target = null
  } finally {
    deleteDialog.loading = false
  }
}

const handleDeleteCancel = () => {
  deleteDialog.target = null
}

const handleRowAction = (actionKey: string, row: TemplateRecord) => {
  if (actionKey === 'delete') {
    openDeleteDialog(row)
    return
  }
  if (actionKey === 'detail') {
    openDetailDialog(row)
    return
  }
  handleEdit(row)
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="less">
.app-type-ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 20px;
}
.edit-icon {
  display: none;
  cursor: pointer;
  margin-left: 5px;
}

:deep(.el-table__cell) {
  .el-icon {
    vertical-align: middle;
    margin-top: -2px;
  }

  &:hover .edit-icon {
    display: inline-block;
  }
}
.domain-list {
  display: block;
  margin-bottom: 3px;
}

.domain-popover-item {
  padding: 5px;
  border-bottom: solid 1px #ebeef5;
  border-radius: 4px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  .domain-popover-text {
    font-size: 13px;
    color: #606266;
  }
}
</style>
