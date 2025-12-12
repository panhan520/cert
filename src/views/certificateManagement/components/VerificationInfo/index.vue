<template>
  <div class="verification-info">
    <div v-if="verificationData?.type === 'file'" class="verification-content">
      <div class="verification-tips">
        <p>(1) 验证类型为文件验证：</p>
        <p class="tips-text">
          "文件验证"字段后对应tips:该方式要求您登录DNS服务提供商的系统，添加指定的验证文件到Web服务器的指定路径。CA定期检查指定的文件是否能够访问。当CA确认指定的文件能够访问时，文件验证将会结束。
        </p>
      </div>
      <div class="verification-box">
        <div class="verification-title">验证信息</div>
        <ul class="verification-list">
          <li>
            <span class="label">验证类型：</span>
            <span class="value">文件验证</span>
            <el-icon class="info-icon"><InfoFilled /></el-icon>
          </li>
          <li>
            <span class="label">待验证域名：</span>
            <span class="value">{{ verificationData.domain }}</span>
          </li>
          <li>
            <span class="label">待添加文件：</span>
            <span class="value file-url">{{ verificationData.fileUrl }}</span>
            <el-icon class="copy-icon" @click="handleCopy(verificationData.fileUrl || '')">
              <DocumentCopy />
            </el-icon>
          </li>
          <li>
            <span class="label">文件内容：</span>
            <span class="value file-content">{{ verificationData.fileContent }}</span>
            <el-icon class="copy-icon" @click="handleCopy(verificationData.fileContent || '')">
              <DocumentCopy />
            </el-icon>
          </li>
        </ul>
      </div>
    </div>
    <div v-else-if="verificationData?.type === 'dns'" class="verification-content">
      <div class="verification-tips">
        <p>(2) 验证类型为DNS验证：</p>
        <p class="tips-text">
          "DNS验证"字段后对应tips:该方式要求您添加指定的验证文件到Web服务器的指定路径。CA定期检查指定的文件是否能够访问。当CA确认指定的文件能够访问时，文件验证将会结束。
        </p>
      </div>
      <div class="verification-box">
        <div class="verification-title">验证信息</div>
        <ul class="verification-list">
          <li>
            <span class="label">验证类型：</span>
            <span class="value">DNS 验证</span>
          </li>
          <li>
            <span class="label">待验证域名：</span>
            <span class="value">{{ verificationData.domain }}</span>
          </li>
          <li>
            <span class="label">记录类型：</span>
            <span class="value">{{ verificationData.recordType }}</span>
          </li>
          <li>
            <span class="label">待添加主机记录：</span>
            <span class="value">{{ verificationData.hostRecord }}</span>
          </li>
          <li>
            <span class="label">记录值：</span>
            <span class="value record-value">{{ verificationData.recordValue }}</span>
            <el-icon class="copy-icon" @click="handleCopy(verificationData.recordValue || '')">
              <DocumentCopy />
            </el-icon>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="verification-empty">暂无验证信息</div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { InfoFilled, DocumentCopy } from '@element-plus/icons-vue'
import { useClipboard } from '@/hooks/web/useClipboard'

interface VerificationData {
  type: 'file' | 'dns'
  domain: string
  fileUrl?: string
  fileContent?: string
  recordType?: string
  hostRecord?: string
  recordValue?: string
}

const props = defineProps<{
  verificationData: VerificationData | null
}>()

const { copy, isSupported, copied } = useClipboard()

const handleCopy = (text: string) => {
  if (!text) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  if (!isSupported.value) {
    ElMessage.error('您的浏览器不支持复制功能')
    return
  }

  copy(text)
  setTimeout(() => {
    if (copied.value) {
      ElMessage.success('复制成功')
    }
  }, 100)
}
</script>

<style lang="less" scoped>
.verification-info {
  padding: 0;
}

.verification-content {
  .verification-tips {
    margin-bottom: 16px;
    font-size: 14px;
    color: #606266;
    line-height: 1.6;

    p {
      margin: 0 0 8px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .tips-text {
      color: #909399;
      font-size: 13px;
    }
  }

  .verification-box {
    background: #f5f7fa;
    border-radius: 4px;
    padding: 16px;

    .verification-title {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 12px;
    }

    .verification-list {
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        font-size: 13px;
        line-height: 1.5;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #909399;
          min-width: 120px;
          flex-shrink: 0;
        }

        .value {
          color: #303133;
          flex: 1;
          word-break: break-all;

          &.file-url,
          &.file-content,
          &.record-value {
            font-family: 'Courier New', monospace;
            background: #ffffff;
            padding: 4px 8px;
            border-radius: 4px;
            margin-right: 8px;
          }
        }

        .info-icon {
          color: #409eff;
          font-size: 14px;
          margin-left: 4px;
        }

        .copy-icon {
          color: #409eff;
          font-size: 16px;
          cursor: pointer;
          margin-left: 8px;
          flex-shrink: 0;

          &:hover {
            color: #66b1ff;
          }
        }
      }
    }
  }
}

.verification-empty {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
