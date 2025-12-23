<template>
  <el-dialog
    v-model="dialogVisible"
    title="新建模版"
    width="900px"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="140px"
      class="create-template-form"
    >
      <!-- 基本信息 -->
      <div class="form-section basic-info">
        <div class="section-title">
          <div class="title-bar"></div>
          <span>基本信息</span>
        </div>
        <el-form-item label="模板持有者类型" prop="holderType" required>
          <el-radio-group v-model="formData.holderType" @change="handleHolderTypeChange">
            <el-radio-button label="individual">个人</el-radio-button>
            <el-radio-button label="enterprise">企业</el-radio-button>
          </el-radio-group>
          <div class="verify-tips"> 申请OV/EV证书时必须填写企业信息 </div>
        </el-form-item>

        <el-form-item label="模板名称" prop="name" required>
          <el-input
            v-model="formData.name"
            placeholder="请输入模板名称"
            clearable
            :max-length="50"
          />
        </el-form-item>

        <div class="name-inputs">
          <el-form-item label="联系人姓氏" prop="surname" required class="name-input-item">
            <el-input v-model="formData.surname" placeholder="姓" clearable :max-length="50" />
          </el-form-item>
          <el-form-item
            label="联系人名字"
            prop="givenName"
            required
            class="name-input-item last-name"
          >
            <el-input v-model="formData.givenName" placeholder="名" clearable :max-length="50" />
          </el-form-item>
        </div>

        <el-form-item label="联系人邮箱" prop="contactEmail" required>
          <el-input v-model="formData.contactEmail" placeholder="请输入邮箱" clearable />
        </el-form-item>

        <el-form-item label="联系人手机" prop="contactMobile" required>
          <el-input v-model="formData.contactMobile" placeholder="请输入手机号码" clearable />
        </el-form-item>
      </div>

      <!-- 企业信息 -->
      <div v-if="formData.holderType === 'enterprise'" class="form-section">
        <div class="section-title">
          <div class="title-bar"></div>
          <span>企业信息</span>
        </div>

        <el-form-item label="企业名称 (O)" prop="companyName" required>
          <el-input
            v-model="formData.companyName"
            placeholder="请输入英文全称或营业执照上的中文全称"
            clearable
            :max-length="50"
          />
        </el-form-item>

        <el-form-item label="部门 (OU)">
          <el-input
            v-model="formData.department"
            placeholder="请输入部门"
            clearable
            :max-length="50"
          />
        </el-form-item>

        <el-form-item label="国家/地区 (C/R)" prop="country" required>
          <el-select v-model="formData.country" placeholder="请选择" style="width: 100%" filterable>
            <el-option
              v-for="item in countryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="省份 (ST)" prop="province" required>
          <el-input
            v-model="formData.province"
            placeholder="请输入省份"
            clearable
            :max-length="50"
          />
        </el-form-item>

        <el-form-item label="城市 (L)" prop="city" required>
          <el-input v-model="formData.city" placeholder="请输入城市" clearable :max-length="50" />
        </el-form-item>

        <el-form-item label="地址 (Street)" prop="address" required>
          <el-input
            v-model="formData.address"
            placeholder="请输入地址"
            clearable
            :max-length="50"
          />
        </el-form-item>

        <el-form-item label="邮编 (PostalCode)">
          <el-input
            v-model="formData.postalCode"
            placeholder="请输入邮编"
            clearable
            :max-length="50"
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
          <TagInput v-model="formData.tags" :max="50" />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { type FormInstance, type FormRules } from 'element-plus'
import TagInput from '@/views/certificateManagement/components/TagInput/index.vue'
import { getCountryOptions } from '@/constants/countries'

interface TemplateData {
  id: string
  holderType: string
  name: string
  contactName: string
  contactEmail: string
  contactMobile: string
  tags: number
  createdAt: string
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: [template: TemplateData]
}>()

const formRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const formData = reactive({
  holderType: 'individual',
  name: '',
  surname: '',
  givenName: '',
  contactEmail: '',
  contactMobile: '',
  companyName: '',
  department: '',
  country: 'CN',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  tags: [] as string[]
})

const countryOptions = computed(() => getCountryOptions('zh-CN'))

const rules: FormRules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  surname: [{ required: true, message: '请输入姓', trigger: 'blur' }],
  givenName: [{ required: true, message: '请输入名', trigger: 'blur' }],
  contactEmail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
  ],
  contactMobile: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  companyName: [
    {
      required: true,
      message: '请输入企业名称',
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (formData.holderType === 'enterprise' && !value) {
          callback(new Error('请输入企业名称'))
        } else {
          callback()
        }
      }
    }
  ],
  country: [
    {
      required: true,
      message: '请选择国家/地区',
      trigger: 'change',
      validator: (_rule, value, callback) => {
        if (formData.holderType === 'enterprise' && !value) {
          callback(new Error('请选择国家/地区'))
        } else {
          callback()
        }
      }
    }
  ],
  province: [
    {
      required: true,
      message: '请输入省份',
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (formData.holderType === 'enterprise' && !value) {
          callback(new Error('请输入省份'))
        } else {
          callback()
        }
      }
    }
  ],
  city: [
    {
      required: true,
      message: '请输入城市',
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (formData.holderType === 'enterprise' && !value) {
          callback(new Error('请输入城市'))
        } else {
          callback()
        }
      }
    }
  ],
  address: [
    {
      required: true,
      message: '请输入地址',
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (formData.holderType === 'enterprise' && !value) {
          callback(new Error('请输入地址'))
        } else {
          callback()
        }
      }
    }
  ]
}

const handleHolderTypeChange = () => {
  // 切换持有者类型时重置企业信息
  if (formData.holderType === 'individual') {
    formData.companyName = ''
    formData.department = ''
    formData.country = 'CN'
    formData.province = ''
    formData.city = ''
    formData.address = ''
    formData.postalCode = ''
  }
}

const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

const handleClose = () => {
  resetForm()
}

const handleConfirm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      const template: TemplateData = {
        id: Date.now().toString(),
        holderType: formData.holderType === 'individual' ? '个人' : '企业',
        name: formData.name,
        contactName: `${formData.surname}${formData.givenName}`,
        contactEmail: formData.contactEmail,
        contactMobile: formData.contactMobile,
        tags: formData.tags.length,
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }
      emit('confirm', template)
      dialogVisible.value = false
      resetForm()
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  formData.holderType = 'individual'
  formData.name = ''
  formData.surname = ''
  formData.givenName = ''
  formData.contactEmail = ''
  formData.contactMobile = ''
  formData.companyName = ''
  formData.department = ''
  formData.country = 'CN'
  formData.province = ''
  formData.city = ''
  formData.address = ''
  formData.postalCode = ''
  formData.tags = []
}

watch(
  () => props.visible,
  (val) => {
    if (!val) {
      resetForm()
    }
  }
)
</script>

<style lang="less" scoped>
.create-template-form {
  :deep(.el-radio-button__inner) {
    width: 70px !important;
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
    .question-icon {
      vertical-align: middle;
      margin-top: -2px;
    }
    .verify-tips {
      width: 100%;
      font-size: 12px;
      color: #909399;
    }
    .name-inputs {
      width: 100%;
      display: flex;
      gap: 12px;

      .name-input-item {
        :deep(.el-form-item__content) {
          width: 100%;
        }
        :deep(.el-input) {
          width: 358px;
        }
      }
      .last-name {
        :deep(.el-form-item__label) {
          display: none;
        }
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
