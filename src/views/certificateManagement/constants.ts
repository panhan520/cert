import status1 from '@/assets/imgs/status1.svg'
import status2 from '@/assets/imgs/status2.svg'
import status3 from '@/assets/imgs/status3.svg'
import status4 from '@/assets/imgs/status4.svg'

export const statusMap: Record<string, string> = {
  CERT_STATUS_EXPIRES_SOON: '即将过期',
  CERT_STATUS_EXPIRED: '已过期',
  CERT_STATUS_ISSUE: '已签发',
  CERT_STATUS_ABNORMAL: '异常',
  CERT_STATUS_UNUSED: '未使用'
}

export const statusOptions = [
  {
    label: '即将过期',
    value: 'CERT_STATUS_EXPIRES_SOON'
  },
  {
    label: '已到期',
    value: 'CERT_STATUS_EXPIRED'
  },
  {
    label: '已签发',
    value: 'CERT_STATUS_ISSUE'
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

export const certOptions = [
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
