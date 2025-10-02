<template>
  <ContentWrap>
    <div class="page-title">证书管理</div>
    <ul class="ul-continer">
      <li
        v-for="item in certOptions"
        :key="item.status"
        :class="{ active: currentStatus === item.status }"
        @click="handleClickStatus(item.status)"
      >
        <div>
          <img :src="statusImgMap[item.status]" alt="" />
          <span>{{ statusMap[item.status] }}</span>
        </div>
        <p>{{ item.total }}</p>
      </li>
    </ul>
    <TableToolbar
      :buttons="[{ key: 'buy', label: '上传证书', onClick: handleUploadCertificate }]"
      :searchOptions="[
        { label: '备注名称', value: 'nameKeyword' },
        { label: '域名', value: 'subjectKeyword' }
      ]"
      @search="onSearch"
      @refresh="onRefresh"
    />

    <el-table :data="tableData" row-key="id" border>
      <el-table-column prop="name" label="证书名称">
        <template #default="scope">
          <div class="cell-wrapper">
            {{ scope.row.name }}
            <el-popover
              v-model:visible="scope.row.visible"
              width="280"
              placement="top"
              trigger="click"
            >
              <div style="margin-bottom: 10px">
                <el-input
                  v-model="scope.row.editName"
                  placeholder="请输入"
                  clearable
                  maxlength="68"
                />
              </div>
              <div style="text-align: right">
                <el-button size="small" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="confirmEditName(scope.row)"
                  >确定</el-button
                >
              </div>
              <template #reference>
                <el-icon class="edit-icon" @click="editCertName(scope.row)">
                  <EditPen />
                </el-icon>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="subjectNames" label="绑定域名">
        <template #default="scope">
          <div v-for="item in scope.row.subjectNames" :key="item">
            <el-tooltip class="box-item" placement="top" effect="light" :content="item">
              <el-tag type="info" class="bottom-10">{{ item }}</el-tag>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
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
                <TagInput
                  ref="tagInputRef"
                  v-model="queryParams.tags"
                  :max="20"
                  @valid-change="onValidChange"
                />
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
            <el-icon class="edit-icon" @click="handleEditTags(scope.row)">
              <EditPen />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #header>
          <div class="table-filter-container">
            <span>状态</span>
            <TableFilterPopover
              placement="top-start"
              :width="180"
              @search="tableSearch"
              :isFilter="!!queryParams.status"
              @reset="onReset('status', '')"
            >
              <template #content>
                <el-radio-group v-model="queryParams.status">
                  <el-radio :value="item.value" v-for="item in statusOptions" :key="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </template>
            </TableFilterPopover>
          </div>
        </template>
        <template #default="scope">
          {{ statusMap[scope.row.status] || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="notAfter" label="有效期限">
        <template #default="scope">
          <div>{{ scope.row.certValidityFriendly }}</div>
          {{ scope.row.notAfter }}
        </template>
      </el-table-column>
      <el-table-column prop="algorithmFriendly" label="密钥算法">
        <template #default="scope">
          <el-tag type="info" class="mr-2">国际</el-tag>
          {{ scope.row.algorithmFriendly }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <span @click="handleDelete(scope.row.id)" class="button-text">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model="queryParams.page"
      :page-size="queryParams.pageSize"
      :total="totalRecords"
      :page-sizes="[10, 20, 50, 100]"
      @change="handlePageChange"
    />
    <UploadCert v-model:visible="uploadCertificateVisible" />
    <EditTags
      v-model:visible="editTagsVisible"
      v-model:tags="tagList"
      :tableDataList="rowTableList"
      @confirmEditTags="confirmEditTags"
    />
    <DeleteDialog v-model:visible="deleteDialogVisible" @confirmDelete="confirmDelete" />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { onMounted, ref } from 'vue'
import UploadCert from './components/UploadCert/index.vue'
import TagInput from './components/TagInput/index.vue'
import EditTags from './components/EditTags/index.vue'
import DeleteDialog from './components/DeleteDialog/index.vue'
import { TableToolbar } from '@/components/TableToolbar'
import { TableFilterPopover } from '@/components/TableFilterPopover'
import { apiGetCertsList, apiDeleteCert, apiGetCertTotal, apiUpdateCert } from '@/api/certificate'
import { CertsList, CertsParams } from '@/api/certificate/type'
import { statusMap, statusOptions, statusImgMap } from './constants'
import { Pagination } from '@/components/Pagination'
import { ElMessage } from 'element-plus'
const uploadCertificateVisible = ref(false)
const editTagsVisible = ref(false)
const deleteDialogVisible = ref(false)
const currentCertId = ref('')
// 添加总记录数变量（模拟从 API 获取）
const totalRecords = ref('0')
const tagValid = ref(true)
const tagInputRef = ref<InstanceType<typeof TagInput> | null>(null)
interface CertOption {
  status: string
  total: number
}
const certOptions = ref<CertOption[]>([])

const currentStatus = ref('CERT_STATUS_ALL')
const tagList = ref([])
const rowTableList = ref<any[]>([])

const tableData = ref<CertsList[]>([])
const queryParams = ref<CertsParams>({
  status: '',
  tags: [],
  nameKeyword: '',
  subjectKeyword: '',
  page: 1,
  pageSize: 10
})
onMounted(() => {
  getList()
  getCertTotalData()
})
// 获取列表
const getList = async () => {
  const { data, code } = await apiGetCertsList(queryParams.value)
  if (code === 200) {
    tableData.value = data.list
    totalRecords.value = data.pagination.total
  }
}
// 证书状态统计
const getCertTotalData = async () => {
  const { data, code } = await apiGetCertTotal()
  if (code === 200) {
    const TotalSum = data.total.reduce((acc, cur) => acc + cur.total, 0)
    certOptions.value = [
      {
        status: 'CERT_STATUS_ALL',
        total: TotalSum
      },
      ...data.total
    ]
  }
}
// 更新证书
const updateCertData = async (params: any) => {
  const { code } = await apiUpdateCert(params)
  if (code === 200) {
    ElMessage.success('修改成功')
    getList()
  }
}
// 开启编辑证书名称
const editCertName = (row) => {
  row.editName = row.name
}
// 确认编辑证书名称
const confirmEditName = (row) => {
  if (row.editName) {
    updateCertData({ certId: row.id, name: row.editName, modifyTags: false })
    row.visible = false
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
  updateCertData({ certId: rowTableList.value[0].id, modifyTags: true, tags: tagList.value })
  editTagsVisible.value = false
}
const onValidChange = (isValid: boolean) => {
  tagValid.value = isValid
}
const handleTagSearch = async (callback?: (shouldClose?: boolean) => void) => {
  if (tagInputRef.value) {
    const valid = await tagInputRef.value.validate()
    const shouldClose = true
    // 根据条件判断是否关闭
    if (callback) {
      callback(shouldClose)
    }
    if (!valid) {
      ElMessage.warning('标签输入不合法，请检查后重试')
      return
    }
  }

  tableSearch()
}
// 更新分页参数的方法
const handlePageChange = (currentPage: number, pageSize: number) => {
  queryParams.value.page = currentPage
  queryParams.value.pageSize = pageSize
  getList() // 刷新列表数据
}
// 修改按钮点击处理函数
const handleUploadCertificate = () => {
  uploadCertificateVisible.value = true
}
// 开启删除证书
const handleDelete = (id: any) => {
  deleteDialogVisible.value = true
  currentCertId.value = id
}
// 确认删除证书
const confirmDelete = async () => {
  await apiDeleteCert({ certId: currentCertId.value }).then(() => {
    ElMessage.success('删除成功')
    getList()
  })
}
// 修改证书过滤状态
const handleClickStatus = (status) => {
  if (currentStatus.value === status) return
  currentStatus.value = status
  queryParams.value.status = status === 'CERT_STATUS_ALL' ? '' : status
  getList()
}

const onSearch = (params) => {
  queryParams.value = { ...queryParams.value, ...params }
  console.log(queryParams.value, params)
  getList()
}
const tableSearch = () => {
  console.log(queryParams.value)
  getList()
}
const onReset = (label, value) => {
  console.log(label)
  queryParams.value[label] = value
  tableSearch()
  getList()
}
const onRefresh = () => {
  console.log(queryParams.value)
  getList()
}
</script>
<style lang="less" scoped>
.el-radio {
  width: 100%;
  display: block;
}
.radio-group-bottom {
  display: flex;
  justify-content: space-between;
  border-top: solid 1px #eaedf1;
}
.el-button {
  margin-top: 10px;
}
.table-filter-container {
  display: flex;
  align-items: center;
  gap: 4px;
  .cursor-pointer {
    cursor: pointer;
  }
}
.page-title {
  font-size: 18px;
  line-height: 26px;
  color: #0c0d0e;
  margin-bottom: 20px;
  text-align: left;
}
.bottom-10 {
  margin-bottom: 10px;
}
.ul-continer {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  li {
    width: 20%;
    display: flex;
    flex-direction: column;
    -moz-box-align: center;
    cursor: pointer;
    padding: 12px 16px;
    margin: 0 10px;
    flex: 1 1 0%;
    height: 92px;
    margin-right: 12px;
    padding: 16px;
    background: rgb(246, 247, 251);
    border: 1px solid rgb(229, 232, 239);
    border-radius: 8px 8px 0px 0px;
    img {
      width: 12px;
      margin-right: 4px;
      vertical-align: middle;
    }
    span {
      color: rgb(66, 70, 78);
      font-size: 12px;
    }
    p {
      margin-top: 4px;
      font-weight: bold;
      font-size: 28px;
      line-height: 28px;
    }
  }
  .active {
    border-top: 4px solid rgb(22, 100, 255);
    background: rgb(255, 255, 255);
    border-bottom: none;
  }
}

.edit-icon {
  display: none;
  cursor: pointer;
  margin-left: 5px;
}
.el-table__cell .el-icon {
  vertical-align: middle;
  margin-top: -4px;
}
.el-table__cell:hover .edit-icon {
  display: inline-block; /* 鼠标浮动时显示 */
}
</style>
