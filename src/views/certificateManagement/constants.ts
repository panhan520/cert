export const statusMap: Record<string, string> = {
  CERT_STATUS_EXPIRES_SOON: '即将到期(15天内)',
  CERT_STATUS_EXPIRED: '已到期',
  CERT_STATUS_ISSUE: '已签发',
  CERT_STATUS_ABNORMAL: '异常',
  CERT_STATUS_UNUSED: '未使用',
  CERT_STATUS_ALL: '全部证书',
  CERT_STATUS_VALIDATING: '验证中',
  CERT_STATUS_APPLY_FFAIL: '申请失败'
}

export const statusImgMap: Record<string, string> = {
  CERT_STATUS_EXPIRES_SOON: 'e911_emergency',
  CERT_STATUS_EXPIRED: 'event_busy',
  CERT_STATUS_ISSUE: 'fact_check',
  CERT_STATUS_ABNORMAL: 'error',
  CERT_STATUS_ALL: 'cards_stack',
  CERT_STATUS_VALIDATING: 'hourglass_bottom',
  CERT_STATUS_APPLY_FFAIL: 'error'
}

export const statusTagsMap = {
  CERT_STATUS_EXPIRES_SOON: 'warning',
  CERT_STATUS_EXPIRED: 'info',
  CERT_STATUS_ISSUE: 'success',
  CERT_STATUS_ABNORMAL: 'danger',
  CERT_STATUS_UNUSED: '未使用',
  CERT_STATUS_VALIDATING: 'primary',
  CERT_STATUS_APPLY_FFAIL: 'danger'
}

export const statusIconMap: Record<string, string> = {
  CERT_STATUS_EXPIRES_SOON: 'error',
  CERT_STATUS_EXPIRED: 'block',
  CERT_STATUS_ISSUE: 'check_circle',
  CERT_STATUS_ABNORMAL: 'cancel',
  CERT_STATUS_UNUSED: '未使用',
  CERT_STATUS_VALIDATING: 'clock_loader_80',
  CERT_STATUS_APPLY_FFAIL: 'cancel'
}

export const statusOptions = [
  {
    label: '即将过期（15天内）',
    value: 'CERT_STATUS_EXPIRES_SOON'
  },
  {
    label: '已到期',
    value: 'CERT_STATUS_EXPIRED'
  },
  {
    label: '已签发',
    value: 'CERT_STATUS_ISSUE'
  },
  {
    label: '申请失败',
    value: 'CERT_STATUS_APPLY_FFAIL'
  }
  // {
  //   label: '异常',
  //   value: 'CERT_STATUS_ABNORMAL'
  // },
  // {
  //   label: '未使用',
  //   value: 'CERT_STATUS_UNUSED'
  // }
]
