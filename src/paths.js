const normalizedBase = `/${import.meta.env.BASE_URL.replace(/^\/+|\/+$/g, '')}`

export const APP_BASE = normalizedBase === '/' ? '' : normalizedBase
export const API_BASE = `${APP_BASE}/api`

export function appPath(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return normalizedPath === '/' ? `${APP_BASE}/` : `${APP_BASE}${normalizedPath}`
}

export function routePath(pathname = window.location.pathname) {
  if (!APP_BASE) return pathname || '/'
  if (pathname === APP_BASE || pathname === `${APP_BASE}/`) return '/'
  if (pathname.startsWith(`${APP_BASE}/`)) return pathname.slice(APP_BASE.length)
  return pathname
}

export function assetPath(path) {
  return appPath(path)
}
