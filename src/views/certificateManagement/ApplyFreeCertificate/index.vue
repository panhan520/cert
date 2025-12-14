<template>
  <ContentWrap>
    <div class="apply-page">
      <div class="page-header">
        <el-icon class="back-icon" @click="handleBack">
          <ArrowLeft />
        </el-icon>
        <h2 class="page-title">申请免费证书</h2>
      </div>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="140px"
        class="apply-form"
      >
        <!-- 证书信息 -->
        <div class="form-section basic-info">
          <div class="section-title">
            <div class="title-bar"></div>
            <span>证书信息</span>
          </div>
          <el-form-item label="证书标准" prop="standard" required>
            <el-radio-group v-model="formData.standard" text-color="#1664ff" fill="#f4f7ff">
              <el-radio-button label="international">国际标准</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证书服务时长" prop="duration" required>
            <el-radio-group v-model="formData.duration" text-color="#1664ff" fill="#f4f7ff">
              <el-radio-button label="3months">3个月</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="CSR生成方式" prop="csrMethod" required>
            <el-radio-group v-model="formData.csrMethod" text-color="#1664ff" fill="#f4f7ff">
              <el-radio-button label="auto">自动</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密钥算法" prop="algorithm" required>
            <el-radio-group v-model="formData.algorithm" text-color="#1664ff" fill="#f4f7ff">
              <el-radio-button label="rsa">
                RSA
                <el-tag type="danger" size="small" class="recommend-tag">荐</el-tag>
              </el-radio-button>
              <el-radio-button label="ecc">ECC</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="域名(CN)" prop="domain" required>
            <el-input v-model="formData.domain" clearable class="form-item-input" />
            <div class="verify-tips">请输入单域名,例如: volcengine.com、a.volcengine.com</div>
          </el-form-item>
          <el-form-item label="选择信息模板" prop="templateId" required>
            <TemplateSelector v-model="formData.templateId" />
          </el-form-item>
          <el-form-item label="域名验证方式" prop="verifyMethod" required>
            <el-radio-group v-model="formData.verifyMethod" text-color="#1664ff" fill="#f4f7ff">
              <el-radio-button label="dns">DNS验证</el-radio-button>
              <el-radio-button label="file">文件验证</el-radio-button>
            </el-radio-group>
            <div class="verify-tips">
              当您的域名解析托管在 TrafficRoute 时，我们将帮助您自动完成 DNS 验证
            </div>
          </el-form-item>
          <el-form-item label="备注名称" prop="remarkName" required>
            <el-input
              v-model="formData.remarkName"
              placeholder="未命名证书"
              clearable
              class="form-item-input"
              :maxlength="50"
            />
          </el-form-item>
        </div>
        <!-- 更多配置 -->
        <div class="form-section">
          <div class="section-title">
            <div class="title-bar"></div>
            <span>更多配置</span>
          </div>
          <el-form-item label="标签">
            <template #label>
              <span>
                标签
                <el-tooltip
                  content="支持通过标签标记资源，从不同维度实现云资源分类与聚合。"
                  placement="top"
                >
                  <el-icon class="question-icon"><QuestionFilled /></el-icon>
                </el-tooltip>
              </span>
            </template>
            <TagInput v-model="formData.tags" :max="5" />
          </el-form-item>
        </div>
        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="handleBack">取消</el-button>
          <el-button type="primary" @click="handleSubmit">申请</el-button>
        </div>
      </el-form>
    </div>
  </ContentWrap>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ContentWrap } from '@/components/ContentWrap'
import TemplateSelector from './components/TemplateSelector/index.vue'
import TagInput from '@/views/certificateManagement/components/TagInput/index.vue'
const router = useRouter()
const formRef = ref<FormInstance>()
const formData = reactive({
  standard: 'international',
  duration: '3months',
  csrMethod: 'auto',
  algorithm: 'rsa',
  domain: '',
  templateId: '',
  verifyMethod: 'dns',
  remarkName: '未命名证书',
  tags: [] as string[]
})
const rules: FormRules = {
  domain: [
    { required: true, message: '请输入域名', trigger: 'blur' },
    {
      pattern: /^(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/,
      message: '请输入合法的域名',
      trigger: ['blur']
    }
  ],
  templateId: [{ required: true, message: '请选择信息模板', trigger: 'change' }],
  remarkName: [{ required: true, message: '请输入备注名称', trigger: 'blur' }]
}
const handleSubmit = async () => {
  console.log('formData', formData)
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // 提交申请
      ElMessage.success('申请成功')
      router.back()
    }
  })
}
const handleBack = () => {
  router.back()
}
</script>
<style lang="less" scoped>
.apply-page {
  :deep(.el-radio-button__inner) {
    width: 110px;
  }
  .page-header {
    display: flex;
    align-items: center;
    border-bottom: solid 1px #ebeef5;
    padding: 0 0 18px;
    margin-bottom: 15px;
    .back-icon {
      font-size: 20px;
      cursor: pointer;
      margin-right: 12px;
      color: #606266;
      &:hover {
        color: #1664ff;
      }
    }
    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: #303133;
    }
  }
  .apply-form {
    .form-section {
      margin-bottom: 32px;
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
      .form-item-input {
        width: 500px;
      }
    }
    .basic-info {
      :deep(.el-form-item) {
        margin-bottom: 22px;
      }
    }
    .question-icon {
      vertical-align: middle;
      margin-top: -2px;
    }
    .recommend-tag {
      margin-left: 4px;
      vertical-align: middle;
      position: absolute;
      right: 0px;
      top: -10px;
      border-radius: 8px 3px 8px 3px;
      background: #f56c6c;
      color: #ffffff;
    }
    .verify-tips {
      width: 100%;
      font-size: 12px;
      color: #909399;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #ebeef5;
    }
  }
}
</style>
