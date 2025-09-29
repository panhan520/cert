import request from '@/axios'
import { CertsList, CertsParams } from './type'

export const apiGetCertsList = (data: CertsParams): Promise<IPaginationResponse<CertsList>> => {
  return request.get({ url: '/apis/v1/certs', params: data })
}
