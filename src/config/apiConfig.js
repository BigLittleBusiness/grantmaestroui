// Nginx proxies /v1 on the same origin in staging and production. A separate
// API hostname can still be selected explicitly at build time, but the default
// must work for IP-based review environments and the documented VPS topology.
const configuredApiUrl = process.env.REACT_APP_API_URL || '/v1/'
const baseServerUrl = configuredApiUrl.endsWith('/')
  ? configuredApiUrl
  : `${configuredApiUrl}/`

export default baseServerUrl
