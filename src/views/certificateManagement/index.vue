<template>
  <ContentWrap>
    <div class="page-title">证书管理</div>
    <ul class="ul-continer">
      <li
        v-for="item in certOptions"
        :key="item.id"
        :class="{ active: currentLevel === item.id }"
        @click="handleClickLevel(item.id)"
      >
        <div>
          <img :src="item.img" alt="" />
          <span>{{ item.title }}</span>
        </div>
        <p>{{ item.number }}</p>
      </li>
    </ul>
    <TableToolbar
      :buttons="[{ key: 'buy', label: '上传证书', onClick: handleUploadCertificate }]"
      :searchOptions="[
        { label: '备注名称', value: 'remarkName' },
        { label: '证书ID', value: 'certId' }
      ]"
      @search="onSearch"
      @refresh="onRefresh"
    />

    <el-table :data="tableData" row-key="id" border>
      <el-table-column prop="name" label="证书名称">
        <template #default="scope">
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
              <el-icon class="cursor-pointer" @click="editCertName(scope.row)">
                <EditPen />
              </el-icon>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="subjectNames" label="绑定域名">
        <template #default="scope">
          <el-tooltip
            class="box-item"
            placement="top"
            effect="light"
            :content="scope.row.subjectNames"
          >
            <el-tag type="info" class="bottom-10">{{ scope.row.subjectNames }}</el-tag>
          </el-tooltip>
          <el-tag type="info">{{ scope.row.ip }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签">
        <template #header>
          <div class="table-filter-container">
            <span>标签</span>
            <el-popover placement="bottom-end" :width="300" trigger="click">
              <template #default>
                <TagInput v-model="queryParams.tags" :max="20" />
                <div class="radio-group-bottom">
                  <el-button size="small">重置</el-button>
                  <el-button size="small" type="primary">确认</el-button></div
                >
              </template>
              <template #reference>
                <el-icon class="cursor-pointer"><Filter /></el-icon>
              </template>
            </el-popover>
          </div>
        </template>
        <template #default="scope">
          <el-icon class="mr-1"><PriceTag /></el-icon>{{ scope.row.tags.length }}
          <el-tooltip class="box-item" placement="top" effect="light" content="编辑">
            <el-icon class="cursor-pointer" @click="handleEditTags(scope.row)">
              <EditPen />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #header>
          <div class="table-filter-container">
            <span>状态</span>
            <el-popover placement="top-start" :width="180" trigger="click">
              <template #default>
                <el-radio-group v-model="queryParams.status">
                  <el-radio :value="item.value" v-for="item in statusOptions" :key="item.value"
                    >{{ item.label }}
                  </el-radio>
                </el-radio-group>
                <div class="radio-group-bottom">
                  <el-button size="small">重置</el-button>
                  <el-button size="small" type="primary">确认</el-button></div
                >
              </template>
              <template #reference>
                <el-icon class="cursor-pointer"><Filter /></el-icon>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="有效期限" />
      <el-table-column prop="cal" label="密钥算法" />
      <el-table-column label="操作">
        <template #default="scope">
          <span @click="handleDelete(scope.row)" class="button-text">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <UploadCert v-model:visible="uploadCertificateVisible" />
    <EditTags
      v-model:visible="editTagsVisible"
      v-model:tags="tagList"
      :tableDataList="rowTableList"
    />
    <DeleteDialog v-model:visible="deleteDialogVisible" />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import status1 from '@/assets/imgs/status1.svg'
import status2 from '@/assets/imgs/status2.svg'
import status3 from '@/assets/imgs/status3.svg'
import status4 from '@/assets/imgs/status4.svg'
import UploadCert from './components/UploadCert/index.vue'
import TagInput from './components/TagInput/index.vue'
import EditTags from './components/EditTags/index.vue'
import DeleteDialog from './components/DeleteDialog/index.vue'
import { TableToolbar } from '@/components/TableToolbar'

// 添加控制上传证书弹窗显示的响应式变量
const uploadCertificateVisible = ref(false)
const editTagsVisible = ref(false)
const deleteDialogVisible = ref(false)

// 修改按钮点击处理函数
const handleUploadCertificate = () => {
  uploadCertificateVisible.value = true
}
const handleEditTags = (row: any) => {
  tagList.value = row.tags
  rowTableList.value = [row]
  editTagsVisible.value = true
}
const handleDelete = (row: any) => {
  deleteDialogVisible.value = true
}
const certOptions = [
  {
    id: 1,
    title: '全部证书',
    number: 1,
    img: status1
  },
  {
    id: 2,
    title: '已签发',
    number: 0,
    img: status2
  },
  {
    id: 3,
    title: '即将到期（30天内）',
    number: 0,
    img: status3
  },
  {
    id: 4,
    title: '自定义',
    number: 0,
    img: status4
  }
]
const currentLevel = ref(1)
const tagList = ref([])
const rowTableList = ref<any[]>([])
interface User {
  id: number
  name: string
  subjectNames: string
  ip: string
  tags: Array<string>
  status: string
  notAfter: string
  time: string
  calCountry: string
  algorithm: string
}
const tableData: User[] = [
  {
    id: 1,
    name: '上传证书ceshi',
    subjectNames: '0bhdfcgc-vm9OxK9cfh.novalocal',
    ip: '222.73.154.180',
    tags: ['1', '2', '5'],
    status: '已签发',
    notAfter: '2026-08-12 21:16:21',
    time: '1年',
    calCountry: '国际',
    algorithm: 'RSA 2048'
  },
  {
    id: 1,
    name: '上传证书ceshi',
    subjectNames: '0bhdfcgc-vm9OxK9cfh.novalocal',
    ip: '222.73.154.180',
    tags: ['1'],
    status: '已签发',
    notAfter: '2026-08-12 21:16:21',
    time: '1年',
    calCountry: '国际',
    algorithm: 'RSA 2048'
  }
]
const statusOptions = [
  {
    label: '即将到期（30天内）',
    value: '1'
  },
  {
    label: '已到期',
    value: '2'
  },
  {
    label: '已签发',
    value: '3'
  }
]
const queryParams = ref({ status: '', tags: [] })
// 修改防护等级弹窗
const handleClickLevel = (id) => {
  if (currentLevel.value === id) return
  currentLevel.value = id
}
const editCertName = (row) => {
  row.editName = row.name
}
const confirmEditName = (row) => {
  if (row.editName) row.name = row.editName
  row.visible = false
}
const onSearch = () => {
  console.log(queryParams.value)
}
const onRefresh = () => {
  console.log(queryParams.value)
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
      width: 9px;
      margin-right: 4px;
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
</style>
