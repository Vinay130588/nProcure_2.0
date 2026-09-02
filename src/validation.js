export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/
export const MOBILE_PATTERN = /^[6-9]\d{9}$/
export const PIN_PATTERN = /^\d{6}$/
export const PAN_PATTERN = /^[A-Z]{5}\d{4}[A-Z]$/
export const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/

export function fieldKind(label = '', type = 'text') {
  if (type === 'email' || /e-?mail/i.test(label)) return 'email'
  if (/mobile|contact number|phone/i.test(label)) return 'mobile'
  if (/gstin?|gst number/i.test(label)) return 'gst'
  if (/\bpan\b|pan number/i.test(label)) return 'pan'
  if (/pin code|postal code|pincode/i.test(label)) return 'pin'
  if (type === 'url' || /website|web site|url/i.test(label)) return 'url'
  if (type === 'password' || /password/i.test(label)) return 'password'
  return 'text'
}

export const contactFieldKind = fieldKind

export function normalizeFieldValue(label, type, value) {
  const kind = fieldKind(label, type)
  if (kind === 'mobile') return value.replace(/\D/g, '').slice(0, 10)
  if (kind === 'pin') return value.replace(/\D/g, '').slice(0, 6)
  if (kind === 'pan') return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10)
  if (kind === 'gst') return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15)
  return value
}

export function fieldPattern(kind) {
  return { email: EMAIL_PATTERN, mobile: MOBILE_PATTERN, pin: PIN_PATTERN, pan: PAN_PATTERN, gst: GST_PATTERN }[kind]
}

export function validateField({ label = 'Field', type = 'text', value = '', required = false }) {
  const kind = fieldKind(label, type)
  const text = String(value).trim()
  if (!text) return { valid: !required, error: required ? `${label} is required.` : '' }
  if (kind === 'mobile' && !MOBILE_PATTERN.test(text)) return { valid: false, error: 'Enter a valid 10-digit Indian mobile number starting with 6–9.' }
  if (kind === 'pin' && !PIN_PATTERN.test(text)) return { valid: false, error: 'Enter a valid 6-digit PIN code.' }
  if (kind === 'pan' && !PAN_PATTERN.test(text)) return { valid: false, error: 'Enter PAN in ABCDE1234F format.' }
  if (kind === 'gst' && !GST_PATTERN.test(text)) return { valid: false, error: 'Enter a valid 15-character GSTIN, for example 24ABCDE1234F1Z5.' }
  if (kind === 'password' && text.length < 8) return { valid: false, error: 'Password must contain at least 8 characters.' }
  if (kind === 'url') {
    try { new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`) } catch { return { valid: false, error: 'Enter a valid website address.' } }
  }
  if (kind === 'email') {
    const emails = text.split(',').map((email) => email.trim()).filter(Boolean)
    if (!emails.length || emails.some((email) => !EMAIL_PATTERN.test(email))) return { valid: false, error: emails.length > 1 ? 'Enter valid email addresses separated by commas.' : 'Enter a valid email address, for example name@company.com.' }
  }
  return { valid: true, error: '' }
}

export function contactFieldError(options) { return validateField(options).error }
