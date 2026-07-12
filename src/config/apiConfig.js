const inferredApiUrl = window.location.hostname.includes('.uat.')
  ? 'https://api.uat.grantmaestro.com/v1/'
  : 'https://api.grantmaestro.com/v1/'

const configuredApiUrl = process.env.REACT_APP_API_URL || inferredApiUrl
const baseServerUrl = configuredApiUrl.endsWith('/')
  ? configuredApiUrl
  : `${configuredApiUrl}/`

export default baseServerUrl
