import { stats, tenders } from './data'

const wait = (value, ms = 250) => new Promise((resolve) => setTimeout(() => resolve(value), ms))

const users = {
  superadmin: { password: 'Admin@123', role: 'admin', name: 'Super Admin', auth: 'password' },
  'gov.demo': { password: 'Demo@123', role: 'client', userType: 'client', name: 'Government Demo', auth: 'dsc', profileStatus: 'Profile Pending' },
  'psu.demo': { password: 'Demo@123', role: 'client', userType: 'client', name: 'PSU Demo', auth: 'otp', profileStatus: 'Submitted', applicationId: 'NPR-REG-2026-000123' },
  'enterprise.demo': { password: 'Demo@123', role: 'client', userType: 'client', name: 'Enterprise Demo', auth: 'otp', profileStatus: 'Approved', applicationId: 'NPR-REG-2026-000124' },
  'bidder.demo': { password: 'Demo@123', role: 'bidder', userType: 'bidder', name: 'Bidder Demo', auth: 'dsc', profileStatus: 'Profile Pending' },
}

let registrations = [
  { id: 'NPR-REG-2026-000121', organization: 'Gujarat Roads Division', edition: 'Government', type: 'Government Agency', person: 'Anita Shah', modules: ['e-Tender'], submitted: '08 Aug 2026', status: 'Submitted', email: 'anita@gov.in' },
  { id: 'NPR-REG-2026-000122', organization: 'Ahmedabad Urban Mission', edition: 'Government', type: 'Municipal / Local Body', person: 'Raj Mehta', modules: ['e-Tender', 'Analytics'], submitted: '09 Aug 2026', status: 'Query Raised', email: 'raj@gov.in', query: 'Please upload the officer authorization letter.' },
  { id: 'NPR-REG-2026-000123', organization: 'Gujarat Energy PSU', edition: 'PSU', type: 'State PSU', person: 'Nisha Patel', modules: ['e-Tender', 'e-Auction'], submitted: '10 Aug 2026', status: 'Under Review', email: 'nisha@psu.in' },
  { id: 'NPR-REG-2026-000124', organization: 'Acme Industries Ltd', edition: 'Enterprise', type: 'Public Limited', person: 'Kabir Desai', modules: ['e-Tender', 'Vendor Management'], submitted: '11 Aug 2026', status: 'Approved', email: 'kabir@acme.in' },
  { id: 'NPR-REG-2026-000125', organization: 'Nova Trade LLP', edition: 'Enterprise', type: 'LLP', person: 'Sara Khan', modules: ['e-Tender'], submitted: '12 Aug 2026', status: 'Rejected', email: 'sara@nova.in' },
]
let nextRegistrationNumber = 126

export const authService = {
  identify: (userId) => wait(users[userId] ? { userId, ...users[userId] } : null),
  login: (userId, password) => wait(users[userId]?.password === password ? { userId, ...users[userId] } : null),
  verifyOtp: (otp) => wait(otp === '123456'),
  registerBasic: (data) => {
    if (users[data.userId]) return wait({ error: 'This User ID is already registered.' })
    users[data.userId] = { password: data.password, role: data.userType, name: data.fullName, email: data.email, mobile: data.mobile, auth: 'otp', profileStatus: 'Profile Pending', userType: data.userType }
    return wait({ user: { userId: data.userId, ...users[data.userId] } }, 350)
  },
  markProfileSubmitted: (userId, applicationId) => {
    if (users[userId]) users[userId] = { ...users[userId], profileStatus: 'Submitted', applicationId }
    return wait(users[userId] ? { userId, ...users[userId] } : null)
  },
}

export const tenderService = {
  search: ({ query = '', category = '', status = '' }) => {
    const term = query.trim().toLowerCase()
    const result = tenders.filter((item) => {
      const haystack = [item.title, item.org, item.id, item.category, item.location, item.summary, item.type, item.status, ...item.tags].join(' ').toLowerCase()
      return (!term || haystack.includes(term)) && (!category || item.category.includes(category)) && (!status || item.status === status)
    })
    return wait(result, 120)
  },
}

export const portalService = {
  getStats: () => wait(stats.map((item) => ({ ...item })), 180),
}

export const registrationService = {
  list: () => wait([...registrations]),
  find: (id, contact = '') => wait(registrations.find((item) => item.id.toLowerCase() === id.trim().toLowerCase() && (!contact || item.email.toLowerCase() === contact.trim().toLowerCase())) || null),
  submit: (draft) => {
    const id = `NPR-REG-2026-${String(nextRegistrationNumber++).padStart(6, '0')}`
    const record = { id, organization: draft.organization, edition: draft.edition, type: draft.orgSubtype || draft.edition, person: draft.fullName, modules: draft.modules, submitted: new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date()), status: 'Submitted', email: draft.email }
    registrations = [record, ...registrations]
    return wait(record, 450)
  },
  updateStatus: (id, status, note = '') => {
    registrations = registrations.map((item) => item.id === id ? { ...item, status, query: status === 'Query Raised' ? note : item.query, activation: status === 'Activated' ? `TEN-${item.id.slice(-4)}` : item.activation } : item)
    return wait(registrations.find((item) => item.id === id), 300)
  },
  reply: (id, reply) => {
    registrations = registrations.map((item) => item.id === id ? { ...item, status: 'Query Responded', reply } : item)
    return wait(registrations.find((item) => item.id === id), 300)
  },
}

export const organizationConfig = {
  Government: { subtypes: ['State Government Department', 'Central Government Department', 'Government Agency', 'Board / Corporation', 'Municipal / Local Body'], auth: ['DSC / PKI (Mandatory)', 'OTP Verification', 'Multi-Factor Authentication'], documents: ['Authorization Letter', 'Department / Office Authorization', 'Officer Authorization'], statutory: false },
  PSU: { subtypes: ['Central PSU', 'State PSU'], auth: ['DSC / PKI', 'Password + OTP', 'Corporate SSO'], documents: ['Organization Proof', 'Authorization Letter', 'GST / PAN', 'Authorized Signatory Document'], statutory: true },
  Enterprise: { subtypes: ['Private Limited', 'Public Limited', 'Partnership', 'LLP', 'Other Enterprise'], auth: ['Password + OTP', 'Multi-Factor Authentication', 'Corporate SSO', 'DSC / PKI'], documents: ['Registration / Incorporation Proof', 'PAN', 'GST', 'Authorization Letter'], statutory: true },
}
