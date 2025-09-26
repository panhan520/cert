<template>
  <!-- 抽屉 -->
  <el-dialog
    v-model="visible"
    width="900"
    :style="{ height: '80vh', overflow: 'auto' }"
    :with-header="true"
    class="upload-certificate"
  >
    <!-- 自定义 header -->
    <template #title>
      <div class="custom-header">
        <span>上传证书</span>
        <!-- 提示信息 -->
        <div class="info">
          <el-icon><InfoFilled color="#1759dd" /></el-icon>
          <ul>
            <li>
              您可以将第三方证书服务商处导出的证书上传托管至火山引擎证书中心，便于统一管理及使用。
            </li>
            <li>上传证书时，证书文件和私钥文件都是必须的。</li>
          </ul>
        </div>
      </div>
    </template>
    <div class="upload-certificate-dialog-content">
      <!-- 表单 -->
      <el-form label-width="160px" :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <!-- 证书标准 -->
        <el-form-item label="证书标准" prop="standards">
          <el-radio-group v-model="ruleForm.standards" text-color="#1664ff" fill="#f4f7ff">
            <el-radio-button border label="gj">国际标准</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 密钥算法 -->
        <el-form-item label="密钥算法" prop="algorithm">
          <el-radio-group v-model="ruleForm.algorithm" text-color="#1664ff" fill="#f4f7ff">
            <el-radio-button border label="rsa">RSA / ECC 算法</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 上传方式 -->
        <el-form-item label="上传方式" prop="mode">
          <el-radio-group
            v-model="ruleForm.mode"
            text-color="#1664ff"
            fill="#f4f7ff"
            @click="resetForm(ruleFormRef)"
          >
            <el-radio-button border label="input">手动输入</el-radio-button>
            <el-radio-button border label="file">文件上传</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 证书文件 -->
        <el-form-item label="证书文件" prop="certificatePem">
          <el-upload
            v-if="ruleForm.mode === 'file'"
            class="upload-demo"
            drag
            action="#"
            accept=".crt,.pem"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">点击或拖拽文件到此处上传</div>
          </el-upload>
          <el-input
            v-else
            v-model="ruleForm.certificatePem"
            :rows="12"
            type="textarea"
            placeholder="请将文件内容复制粘贴到这里，示例：
-----BEGIN CERTIFICATE-----
…
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
…
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
…
-----END CERTIFICATE-----"
          />
        </el-form-item>
        <el-form-item>
          <div class="form-item-desc">
            <p>1. 请使用PEM编码格式的证书文件（文件扩展名为CRT或PEM）</p>
            <p
              >2. 可以只提供针对域名颁发的证书（包含一个 -----BEGIN CERTIFICATE----- 和一个 -----END
              CERTIFICATE-----），或者提供完整的证书链（包含多段证书）。</p
            >
          </div>
        </el-form-item>

        <el-form-item label="证书私钥文件" prop="privateKeyPem">
          <el-upload
            v-if="ruleForm.mode === 'file'"
            class="upload-demo"
            drag
            action="#"
            accept=".crt,.pem"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">点击或拖拽文件到此处上传</div>
          </el-upload>
          <el-input
            v-else
            v-model="ruleForm.privateKeyPem"
            :rows="12"
            type="textarea"
            placeholder="请将文件内容复制粘贴到这里，示例：
-----BEGIN (RSA) PRIVATE KEY-----
…
-----END (RSA) PRIVATE KEY-----"
          />
        </el-form-item>
        <el-form-item>
          <div class="form-item-desc">
            <p>1. 请使用PEM编码格式的证书私钥文件（文件扩展名为KEY或PEM）</p>
            <p>2. 确保私钥未设定密码保护。</p>
          </div>
        </el-form-item>
        <el-form-item label="备注名称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="标签">
          <template #label>
            <span
              >标签
              <el-tooltip
                content="支持通过标签标记资源，从不同维度实现云资源分类与聚合，详情参考标签管理"
                placement="top"
                effect="light"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <div v-if="ruleForm.tag.length > 0" class="form-item-tag">
            <template v-for="(tag, index) in ruleForm.tag" :key="index">
              <el-select
                v-model="ruleForm.tag[index].label"
                filterable
                allow-create
                placeholder="标签键"
              >
                <el-option label="111" value="111" />
                <el-option label="123" value="123" />
              </el-select>
              <el-select
                v-model="ruleForm.tag[index].value"
                filterable
                allow-create
                placeholder="标签值"
                :disabled="!ruleForm.tag[index].label"
              >
                <el-option label="111" value="111" />
                <el-option label="123" value="123" />
              </el-select>
              <el-icon class="cursor-pointer" @click="removeTag(index)"><Delete /></el-icon>
            </template>
          </div>
          <p class="add-tag">
            <span @click="addTag">
              <el-icon><CirclePlus /></el-icon> 添加标签
            </span>
            <span> 还可添加 {{ 50 - ruleForm.tag.length }} 个标签 </span>
          </p>
        </el-form-item>
        <el-form-item label="允许上传相同证书" prop="allowDuplicate">
          <div class="form-item-switch">
            <el-switch v-model="ruleForm.allowDuplicate" />
          </div>
          <div class="form-item-desc">
            <p v-if="ruleForm.allowDuplicate">关闭后，不允许上传相同内容的证书</p>
            <p v-else> 开启后，允许上传相同内容的证书 </p>
          </div>
        </el-form-item>
        <el-form-item label="开启证书完整性校验" prop="integrityCheckEnabled">
          <template #label>
            <span
              >开启证书完整性校验
              <el-tooltip
                content="证书完整性校验是指证书中心会检查您上传的证书链是否完整并向上补齐、检查证书的上下级签发关系是否成立以及是否采用了不安全的摘要算法，以保证您上传证书的可用性。"
                placement="top"
                effect="light"
              >
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </span>
          </template>
          <div class="form-item-switch">
            <el-switch v-model="ruleForm.integrityCheckEnabled" />
          </div>

          <div class="form-item-desc">
            <p v-if="ruleForm.integrityCheckEnabled">关闭后，不进行证书完整性校验</p>
            <p v-else>开启后，默认进行证书完整性校验</p>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:visible'])
const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
interface TagItem {
  label: string
  value: string
  isOpen: boolean
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  standards: 'gj', // 国际标准
  algorithm: 'rsa', // RSA/ECC
  mode: 'file', // 上传方式
  certificatePem: '', // 证书文件
  privateKeyPem: '', // 私钥文件
  certFile: null, // 证书文件
  name: '上传证书',
  allowDuplicate: false,
  integrityCheckEnabled: true,
  tag: [
    // { value: '', label: '' }
  ] as TagItem[]
})
const rules = reactive<FormRules>({
  standard: [{ required: true, trigger: 'change' }],
  algorithm: [
    {
      required: true,
      trigger: 'change'
    }
  ],
  mode: [
    {
      required: true,
      trigger: 'change'
    }
  ],
  certificatePem: [
    {
      required: true,
      message: '该字段不能为空',
      trigger: 'change'
    }
  ],
  privateKeyPem: [
    {
      required: true,
      message: '该字段不能为空',
      trigger: 'change'
    }
  ],
  name: [
    {
      required: true,
      message: '该字段不能为空',
      trigger: 'change'
    }
  ]
})
// 添加标签
const addTag = () => {
  if (ruleForm.tag.length < 50) {
    ruleForm.tag.push({ label: '', value: '', isOpen: false })
  }
}

// 删除标签
const removeTag = (index: number) => {
  ruleForm.tag.splice(index, 1)
}
const handleFileChange = (file: any) => {
  ruleForm.certFile = file.raw
}
// 表单重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// 表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      visible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 取消
const handleCancel = (formEl: FormInstance | undefined) => {
  visible.value = false
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="less" scoped>
.upload-demo {
  width: 100%;
}
.info {
  display: flex;
  padding: 9px 24px;
  gap: 8px;
  background-color: #f4f7ff;
  margin-bottom: 16px;
  font-size: 13px;
  i {
    margin-right: 10px;
    margin-top: 4px;
  }
  ul {
    list-style: none;
    li {
      line-height: 22px;
      list-style: disc;
    }
  }
}
.form-item-desc {
  color: #737a87;
  font-size: 12px;
  line-height: 18px;
  margin-top: 5px;
}
.form-item-switch {
  width: 100%;
  margin-top: 4px;
}
.form-item-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
  ::v-deep {
    .el-select {
      width: 216px;
    }
  }
}
.add-tag {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  > span:nth-child(1) {
    display: flex;
    gap: 5px;
    color: rgb(22, 100, 255);
    align-items: center;
    margin-right: 8px;
    cursor: pointer;
  }
}
.cursor-pointer {
  cursor: pointer;
}
</style>
<style lang="less">
.upload-certificate {
  .el-dialog__header {
    height: auto !important;
  }
}
</style>
