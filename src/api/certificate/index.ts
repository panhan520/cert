import request from '@/axios'
import { CertsList, CertsParams, CreateCertificate } from './type'

export const apiGetCertsList = (data: CertsParams): Promise<IPaginationResponse<CertsList>> => {
  return request.get({ url: '/apis/v1/certs', params: data })
}

export const apiCreateCert = (data: CreateCertificate): Promise<IPaginationResponse<CertsList>> => {
  return request.post({ url: '/apis/v1/certs', data })
}
