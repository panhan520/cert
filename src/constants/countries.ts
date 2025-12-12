const fallbackRegionCodes = [
  'CN',
  'US',
  'GB',
  'JP',
  'DE',
  'FR',
  'KR',
  'CA',
  'AU',
  'SG',
  'IN',
  'BR',
  'ZA',
  'RU',
  'MX',
  'ES',
  'IT',
  'AR',
  'CL',
  'SA',
  'AE',
  'NL',
  'SE',
  'NO',
  'DK',
  'FI',
  'CH',
  'NZ',
  'ID',
  'MY',
  'TH',
  'VN',
  'PH',
  'PK',
  'NG',
  'EG',
  'TR'
]

const resolveRegionCodes = (): string[] => {
  try {
    if (typeof Intl !== 'undefined' && typeof (Intl as any).supportedValuesOf === 'function') {
      const codes = (Intl as any)
        .supportedValuesOf('region')
        .filter((code: string) => /^[A-Z]{2}$/.test(code))
      if (codes.length > 0) {
        return codes
      }
    }
  } catch (err) {
    // 某些运行时（低版本浏览器/SSR）不支持 supportedValuesOf('region')
    console.warn('Intl.supportedValuesOf unavailable, fallback to preset regions', err)
  }
  return fallbackRegionCodes
}

const regionCodes = resolveRegionCodes()

export const getCountryOptions = (locale = 'zh-CN') => {
  let display: Intl.DisplayNames | null = null
  if (typeof Intl !== 'undefined' && typeof (Intl as any).DisplayNames === 'function') {
    try {
      display = new Intl.DisplayNames([locale], { type: 'region' })
    } catch (err) {
      console.warn('Intl.DisplayNames unavailable, use code as label', err)
    }
  }

  return regionCodes.map((code) => ({
    label: display ? display.of(code) || code : code,
    value: code
  }))
}

export type CountryOption = ReturnType<typeof getCountryOptions>[number]
