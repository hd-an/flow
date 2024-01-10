import cookie from 'cookie'
// constant
export const gridSpacing = 3
export const drawerWidth = 260
export const appDrawerWidth = 320
export const maxScroll = 100000

const COOKIE_LOWCODER_CE_SELFHOST_TOKEN_KEY = 'Flowise'
// export const baseURL = 'http://localhost:3100'
export const baseURL = process.env.NODE_ENV === 'production' ? window.location.origin : window.location.origin.replace(':8080', ':3000')
export const LOW_CODER_CREATED_BY = (cookie.parse(document.cookie)[COOKIE_LOWCODER_CE_SELFHOST_TOKEN_KEY] || '').split(':')[2]
// export const createdBy = '65536f412886657aeb845dc9'
// export const orgId = '65536f422886657aeb845dca'
export const LOW_CODER_ORG_ID = (cookie.parse(document.cookie)[COOKIE_LOWCODER_CE_SELFHOST_TOKEN_KEY] || '').split(':')[4]

export const uiBaseURL = window.location.origin
export const FLOWISE_CREDENTIAL_ID = 'FLOWISE_CREDENTIAL_ID'
export const REDACTED_CREDENTIAL_VALUE = '_FLOWISE_BLANK_07167752-1a71-43b1-bf8f-4f32252165db'
