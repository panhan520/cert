<template>
  <el-drawer v-model="drawerVisible" size="600px" :with-header="false">
    <div class="template-detail">
      <!-- 标题 -->
      <div class="drawer-header">
        <span class="back-icon" @click="handleClose">
          <el-icon><ArrowLeft /></el-icon>
        </span>
        <span class="header-title">查看模版详情</span>
      </div>

      <!-- 内容区域 -->
      <div class="drawer-content">
        <!-- 基本信息 -->
        <div class="form-section basic-info">
          <div class="section-title">
            <div class="title-bar"></div>
            <span>基本信息</span>
          </div>

          <div class="detail-item">
            <div class="detail-label">模板持有者类型</div>
            <div class="detail-value">
              {{ holderTypeDisplay }}
            </div>
          </div>

          <div class="detail-item">
            <div class="detail-label">模板名称</div>
            <div class="detail-value">{{ rowInfo?.name || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">联系人姓名</div>
            <div class="detail-value">{{ contactName || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">联系人邮箱</div>
            <div class="detail-value">{{ maskedEmail || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">联系人手机</div>
            <div class="detail-value">{{ maskedMobile || '--' }}</div>
          </div>
        </div>

        <!-- 企业信息 -->
        <div v-if="isEnterprise" class="form-section">
          <div class="section-title">
            <div class="title-bar"></div>
            <span>企业信息</span>
          </div>

          <div class="detail-item">
            <div class="detail-label">企业名称 (O)</div>
            <div class="detail-value">{{ rowInfo?.companyName || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">部门 (OU)</div>
            <div class="detail-value">{{ rowInfo?.department || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">国家/地区 (C/R)</div>
            <div class="detail-value">{{ countryLabel || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">省份 (ST)</div>
            <div class="detail-value">{{ rowInfo?.province || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">城市 (L)</div>
            <div class="detail-value">{{ rowInfo?.city || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">地址 (Street)</div>
            <div class="detail-value">{{ rowInfo?.address || '--' }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">邮编 (PostalCode)</div>
            <div class="detail-value">{{ rowInfo?.postalCode || '--' }}</div>
          </div>
        </div>

        <!-- 更多配置 -->
        <div class="form-section">
          <div class="section-title">
            <div class="title-bar"></div>
            <span>更多配置</span>
          </div>

          <div class="detail-item">
            <div class="detail-label">
              <span>
                标签
                <el-tooltip
                  content="支持通过标签标记资源，从不同维度实现云资源分类与聚合。"
                  placement="top"
                >
                  <el-icon class="question-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </div>
            <div class="detail-value">
              <div v-if="tagsList.length > 0" class="tags-container">
                <el-tag v-for="(tag, index) in tagsList" :key="index" class="tag-item">
                  {{ tag }}
                </el-tag>
              </div>
              <span v-else>--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, QuestionFilled } from '@element-plus/icons-vue'
import { getCountryOptions } from '@/constants/countries'

const props = defineProps<{
  visible: boolean
  rowInfo?: any
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [template: any]
}>()

const drawerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

// 判断是否为企业类型
const isEnterprise = computed(() => {
  const holderType = props.rowInfo?.holderType || props.rowInfo?.type
  return holderType === 'enterprise' || holderType === '企业' || holderType === 'company'
})

// 持有者类型显示
const holderTypeDisplay = computed(() => {
  const holderType = props.rowInfo?.holderType || props.rowInfo?.type
  if (holderType === 'enterprise' || holderType === '企业' || holderType === 'company') {
    return '企业'
  }
  return '个人'
})

// 联系人姓名
const contactName = computed(() => {
  if (props.rowInfo?.contactName) {
    return props.rowInfo.contactName
  }
  if (props.rowInfo?.surname || props.rowInfo?.givenName) {
    return `${props.rowInfo.surname || ''}${props.rowInfo.givenName || ''}`
  }
  return '--'
})

// 掩码邮箱
const maskedEmail = computed(() => {
  const email = props.rowInfo?.contactEmail || props.rowInfo?.email
  if (!email) return '--'
  const [username, domain] = email.split('@')
  if (!username || !domain) return email
  if (username.length <= 3) {
    return `${username[0]}****@${domain}`
  }
  // 显示前3位和后1位，中间用****代替
  const visibleStart = username.slice(0, 3)
  const visibleEnd = username.slice(-1)
  return `${visibleStart}****${visibleEnd}@${domain}`
})

// 掩码手机号
const maskedMobile = computed(() => {
  const mobile = props.rowInfo?.contactMobile || props.rowInfo?.mobile
  if (!mobile) return '--'
  if (mobile.length <= 3) return mobile
  // 显示前3位和后3位，中间用****代替
  const visibleStart = mobile.slice(0, 3)
  const visibleEnd = mobile.slice(-3)
  return `${visibleStart}****${visibleEnd}`
})

// 国家/地区标签
const countryLabel = computed(() => {
  const country = props.rowInfo?.country
  if (!country) return '--'
  const options = getCountryOptions('zh-CN')
  const option = options.find((opt) => opt.value === country)
  return option?.label || country
})

// 标签列表
const tagsList = computed(() => {
  const tags = props.rowInfo?.tags
  if (Array.isArray(tags)) {
    return tags.filter((tag) => tag && tag.trim())
  }
  return []
})

const handleClose = () => {
  drawerVisible.value = false
}
</script>

<style lang="less" scoped>
.template-detail {
  height: 100%;
  display: flex;
  flex-direction: column;

  .drawer-header {
    display: flex;
    align-items: center;

    .back-icon {
      cursor: pointer;
      margin-right: 12px;
      color: #606266;
      font-size: 18px;
      display: flex;
      align-items: center;

      &:hover {
        color: #1664ff;
      }
    }

    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .form-section {
    margin-bottom: 24px;

    .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;

      .title-bar {
        width: 4px;
        height: 16px;
        background: #1664ff;
        margin-right: 8px;
        border-radius: 0 8px 8px 0;
      }
    }

    .detail-item {
      margin-bottom: 20px;
      display: flex;
      align-items: flex-start;
      margin-left: 15px;
      .detail-label {
        width: 140px;
        flex-shrink: 0;
        font-size: 14px;
        color: #606266;
        text-align: left;
        line-height: 32px;
        .question-icon {
          vertical-align: middle;
          margin-left: 4px;
          color: #909399;
          cursor: help;
        }
      }

      .detail-value {
        flex: 1;
        font-size: 14px;
        color: #303133;
        line-height: 32px;
        word-break: break-word;

        :deep(.el-radio-group) {
          .el-radio-button {
            .el-radio-button__inner {
              width: 70px !important;
            }

            &.is-disabled {
              .el-radio-button__inner {
                background-color: #ffffff;
                border-color: #1664ff;
                color: #1664ff;
                cursor: default;
              }
            }
          }
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .tag-item {
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
