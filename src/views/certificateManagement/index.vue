<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { ref } from 'vue'
import {
  // ElDialog,
  // ElButton,
  // ElIcon,
  ElMessage
  // ElTable,
  // ElTableColumn,
  // ElInput,
  // ElPopover,
  // ElTooltip,
  // ElTag
} from 'element-plus'
import status1 from '@/assets/imgs/status1.svg'
import status2 from '@/assets/imgs/status2.svg'
import status3 from '@/assets/imgs/status3.svg'
import status4 from '@/assets/imgs/status4.svg'
import uploadCertificate from './components/uploadCertificate/index.vue'
import { ClickOutside as vClickOutside } from 'element-plus'
// import type { PopoverInstance } from 'element-plus'
// import { WarningFilled, EditPen, PriceTag } from '@element-plus/icons-vue'

// 添加控制上传证书弹窗显示的响应式变量
const uploadCertificateVisible = ref(false)

// 修改按钮点击处理函数
const handleUploadCertificate = () => {
  uploadCertificateVisible.value = true
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
interface User {
  id: number
  name: string
  domain: string
  ip: string
  tag: string
  status: string
  timedate: string
  time: string
  calCountry: string
  cal: string
}
const tableData: User[] = [
  {
    id: 1,
    name: '上传证书ceshi',
    domain: '0bhdfcgc-vm9OxK9cfh.novalocal',
    ip: '222.73.154.180',
    tag: '1',
    status: '已签发',
    timedate: '2026-08-12 21:16:21',
    time: '1年',
    calCountry: '国际',
    cal: 'RSA 2048'
  },
  {
    id: 2,
    name: '上传证书',
    domain: '0bhdfcgc-vm9OxK9cfh.novalocal',
    ip: '222.73.154.180',
    tag: '1',
    status: '已签发',
    timedate: '2026-08-12 21:16:21',
    time: '1年',
    calCountry: '国际',
    cal: 'RSA 2048'
  }
]
const dialogVisible = ref(false)
const form = ref({ name: '' })
// 修改防护等级弹窗
const handleClickLevel = (id) => {
  if (currentLevel.value === id) return
  currentLevel.value = id
}
const handleConfirm = () => {
  dialogVisible.value = false
  ElMessage.success('修改成功')
}
const editCertName = (row) => {
  row.editName = row.name
}
const confirmEditName = (row) => {
  if (row.editName) row.name = row.editName
  row.visible = false
}
</script>

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
    <el-button @click="handleUploadCertificate">上传证书</el-button>
    <el-table :data="tableData" style="width: 100%; margin: 20px 0" row-key="id" border>
      <el-table-column prop="name" label="证书名称">
        <template #header>
          <p class="table-filter-container">
            <span>证书名称</span>
            <el-popover placement="top-start" :width="200" trigger="click">
              <template #default>
                <el-radio-group v-model="form.name">
                  <el-radio value="1" size="large">Option 1</el-radio>
                  <el-radio value="2" size="large">Option 2</el-radio>
                </el-radio-group>
                <el-button size="small">重置</el-button>
                <el-button size="small" type="primary">确认</el-button>
              </template>
              <template #reference>
                <el-icon class="cursor-pointer"><Filter /></el-icon>
              </template>
            </el-popover>
          </p>
        </template>
        <template #default="scope">
          {{ scope.row.name }}¸
          <el-popover
            v-model:visible="scope.row.visible"
            width="280"
            placement="top"
            trigger="click"
          >
            <div style="margin-bottom: 10px">
              <el-input v-model="scope.row.editName" placeholder="请输入" clearable />
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
      <el-table-column prop="domain" label="绑定域名">
        <template #default="scope">
          <el-tooltip class="box-item" placement="top" effect="light" :content="scope.row.domain">
            <el-tag type="info" class="bottom-10">{{ scope.row.domain }}</el-tag>
          </el-tooltip>
          <el-tag type="info">{{ scope.row.ip }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tag" label="标签">
        <template #default="scope">
          <el-icon class="mr-1"><PriceTag /></el-icon>{{ scope.row.tag }}
          <el-tooltip class="box-item" placement="top" effect="light" content="编辑">
            <el-icon class="cursor-pointer">
              <EditPen />
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="time" label="有效期限" />
      <el-table-column prop="cal" label="密钥算法" />
      <el-table-column label="操作" />
    </el-table>
    <!-- 更改防护等级弹框 -->
    <el-dialog v-model="dialogVisible" width="600">
      <template #header>
        <el-icon style="margin-right: 6px; color: #e6a23c" :size="20">
          <WarningFilled />
        </el-icon>
        更改防护等级确认
      </template>
      <span>更改防护等级后将会立即生效，请谨慎操作</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <uploadCertificate v-model:visible="uploadCertificateVisible" />
  </ContentWrap>
</template>

<style lang="less" scoped>
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
.form-lable {
  font-size: 13px;
  color: #42464e;
  display: inline-block;
  margin-right: 10px;
}
.bottom-10 {
  margin-bottom: 10px;
}
.page-title-second {
  font-size: 18px;
  margin: 40px 0 10px;
}
.page-title-third {
  font-size: 14px;
  margin-right: 16px;
}
.page-info {
  color: #42464e;
  margin-left: 20px;
}
.page-info-second {
  color: #42464e;
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
