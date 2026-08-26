const DB_KEY = 'nprocure2.prototype.db.v1'
const SESSION_KEY = 'nprocure2.prototype.session.v1'

const now = () => new Date().toISOString()
const clone = (value) => JSON.parse(JSON.stringify(value))
const uid = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

const seedUsers = [
  { id: 'USR-ADMIN', userId: 'superadmin', password: 'Admin@123', role: 'admin', displayName: 'Super Admin', mobile: '9876543210', email: 'admin@nprocure.demo', status: 'ACTIVE' },
  { id: 'USR-NEW-CLIENT', userId: 'new.client', password: 'Demo@123', userType: 'CLIENT', clientType: 'Government', displayName: 'New Client', organizationName: 'New Gujarat Department', mobile: '9876500001', email: 'new.client@example.com', status: 'REGISTERED_ACCOUNT_CREATION_PENDING' },
  { id: 'USR-NEW-BIDDER', userId: 'new.bidder', password: 'Demo@123', userType: 'BIDDER', displayName: 'New Bidder', organizationName: 'New Bidder Company', mobile: '9876500002', email: 'new.bidder@example.com', status: 'REGISTERED_ACCOUNT_CREATION_PENDING' },
]

const initialDb = () => ({
  version: 1, counters: { registration: 1000, request: 1, governmentRequest: 1, governmentQuery: 1, payment: 1, subscription: 1 },
  users: seedUsers, registrations: [], governmentRequests: [], notifications: [], clientAccounts: [], bidderAccounts: [], accountRequests: [], accountQueries: [], payments: [], subscriptions: [], operationalUsers: [], roleAssignments: [],
  packages: [
    { id: 'PKG-1Y', name: 'Standard 1 Year', years: 1, amount: 2500, tax: 450 },
    { id: 'PKG-2Y', name: 'Value 2 Years', years: 2, amount: 4500, tax: 810 },
    { id: 'PKG-3Y', name: 'Premium 3 Years', years: 3, amount: 6000, tax: 1080 },
  ],
})

const storageAdapter = {
  read(key) { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } },
  write(key, value) { localStorage.setItem(key, JSON.stringify(value)) },
  remove(key) { localStorage.removeItem(key) },
}

const database = {
  read() { const found = storageAdapter.read(DB_KEY); if (found) { found.operationalUsers ||= []; found.roleAssignments ||= []; found.clientAccounts ||= []; found.accountRequests ||= []; found.governmentRequests ||= []; found.notifications ||= []; found.counters ||= {}; found.counters.governmentRequest ||= 1; found.counters.governmentQuery ||= 1; found.governmentRequests.forEach((request) => { request.queryHistory ||= []; request.auditTrail ||= []; request.statusHistory ||= [] }); return found } const seeded = initialDb(); storageAdapter.write(DB_KEY, seeded); return seeded },
  write(db) { storageAdapter.write(DB_KEY, db); return clone(db) },
  mutate(change) { const db = this.read(); const result = change(db); this.write(db); return clone(result) },
  reset() { const db = initialDb(); this.write(db); storageAdapter.remove(SESSION_KEY); return clone(db) },
}

const nextNumber = (db, key, prefix) => `${prefix}-${new Date().getFullYear()}-${String(db.counters[key]++).padStart(6, '0')}`
const history = (action, by, note = '') => ({ id: uid('HIS'), action, by, note, at: now() })

export const authServiceV2 = {
  identify(userId) { const user = database.read().users.find((x) => x.userId.toLowerCase() === userId.trim().toLowerCase()); return clone(user || null) },
  verifyPassword(userId, password) { const user = this.identify(userId); return user?.password === password ? user : null },
  verifyOtp(otp) { return otp === '123456' },
  login(user) { const session = { userId: user.userId, signedInAt: now() }; storageAdapter.write(SESSION_KEY, session); return this.current() },
  current() { const session = storageAdapter.read(SESSION_KEY); return session ? this.identify(session.userId) : null },
  logout() { storageAdapter.remove(SESSION_KEY) },
  isAvailable(userId) { return !this.identify(userId) },
}

export const userRegistrationService = {
  register(input) {
    if (!authServiceV2.isAvailable(input.userId)) return { error: 'This User ID is already registered.' }
    return database.mutate((db) => {
      const registrationId = nextNumber(db, 'registration', 'REG')
      const createdAt = now()
      const displayName = [input.firstName, input.middleName, input.lastName].filter(Boolean).join(' ')
      const user = { id: uid('USR'), registrationId, userId: input.userId.trim(), password: input.password, userType: input.userType, clientType: input.userType === 'CLIENT' ? input.clientType : null, organizationName: input.organizationName, displayName, designation: input.designation, mobile: input.mobile, email: input.email, mobileVerified: true, emailVerified: true, status: 'REGISTERED_ACCOUNT_CREATION_PENDING', createdAt, updatedAt: createdAt, workflowHistory: [history('REGISTERED', displayName)] }
      db.users.push(user); db.registrations.push({ ...user, password: undefined }); return { user, registrationId }
    })
  },
}

export const governmentRequestService = {
  submit(input) {
    return database.mutate((db) => {
      const submittedAt = now()
      const requestNumber = nextNumber(db, 'governmentRequest', 'GOG')
      const request = {
        id: uid('GOGREQ'), requestNumber, edition: 'GOG', status: 'SUBMITTED',
        organizationName: input.department.departmentName.trim(),
        applicantName: input.requestor.name.trim(), applicantEmail: input.requestor.email.trim(),
        clientType: 'GoG', submittedData: clone(input), submittedAt, queryHistory: [], auditTrail: [], statusHistory: [{ status: 'SUBMITTED', at: submittedAt, by: input.requestor.name.trim() }],
        workflowHistory: [history('REQUEST_SUBMITTED', input.requestor.name.trim())],
      }
      db.governmentRequests.unshift(request)
      db.notifications.unshift({
        id: uid('NTF'), type: 'EMAIL', event: 'GOG_REQUEST_SUBMITTED',
        to: request.applicantEmail,
        subject: `nProcure Client Account Request Submitted - ${requestNumber}`,
        message: `Your GoG Client Account Creation Request ${requestNumber} has been submitted successfully.`,
        status: 'QUEUED_DEMO', createdAt: submittedAt,
      })
      return request
    })
  },
  list() { return clone(database.read().governmentRequests) },
  find(id) { return clone(database.read().governmentRequests.find((item) => item.id === id || item.requestNumber === id) || null) },
  openForAdmin(id) {
    return database.mutate((db) => { const request = db.governmentRequests.find((item) => item.id === id); if (!request) return null; const openedAt = now(); request.auditTrail ||= []; request.statusHistory ||= []; request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: 'REQUEST_OPENED', by: 'Super Admin', at: openedAt }); if (request.status === 'SUBMITTED') { request.status = 'PENDING_ADMIN_REVIEW'; request.statusHistory.push({ status: request.status, at: openedAt, by: 'Super Admin' }) } request.updatedAt = openedAt; return request })
  },
  saveDraft(id, adminConfiguration, step = 0, auditAction = 'DRAFT_SAVED') {
    return database.mutate((db) => {
      const request = db.governmentRequests.find((item) => item.id === id)
      if (!request || ['ACCOUNT_ACTIVATED', 'REJECTED'].includes(request.status)) return request || null
      request.adminConfiguration = clone(adminConfiguration); request.accountCreation = clone(adminConfiguration); request.currentStep = step
      if (!['CLARIFICATION_REQUESTED', 'CLARIFICATION_REPLY_RECEIVED'].includes(request.status)) request.status = step === 0 ? 'UNDER_VERIFICATION' : 'CONFIGURATION_IN_PROGRESS'
      request.updatedAt = now(); request.auditTrail ||= []; request.statusHistory ||= []
      request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: auditAction, by: 'Super Admin', at: request.updatedAt, newValue: { step } })
      request.statusHistory.push({ status: request.status, at: request.updatedAt, by: 'Super Admin' })
      return request
    })
  },
  sendQuery(id, detail) {
    return database.mutate((db) => {
      const request = db.governmentRequests.find((item) => item.id === id)
      if (!request || !detail.subject?.trim() || !detail.details?.trim()) return { error: 'Query subject and clarification details are required.' }
      const createdAt = now(), query = { id: uid('GOGQ'), queryNumber: nextNumber(db, 'governmentQuery', 'GOG-QRY'), requestNumber: request.requestNumber, status: 'OPEN', toEmail: request.applicantEmail, additionalEmails: clone(detail.additionalEmails || []), subject: detail.subject.trim(), category: detail.category, relatedSection: detail.relatedSection, details: detail.details.trim(), attachment: clone(detail.attachment || null), internalRemarks: detail.internalRemarks || '', createdAt, replies: [] }
      request.queryHistory ||= []; request.queryHistory.push(query); request.status = 'CLARIFICATION_REQUESTED'; request.updatedAt = createdAt
      request.workflowHistory.push(history('CLARIFICATION_REQUESTED', 'Super Admin', query.subject)); request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: 'QUERY_SENT', by: 'Super Admin', at: createdAt, newValue: clone(query) }); request.statusHistory.push({ status: request.status, at: createdAt, by: 'Super Admin' })
      db.notifications.unshift({ id: uid('NTF'), type: 'EMAIL', event: 'GOG_CLARIFICATION_REQUESTED', to: query.toEmail, cc: clone(query.additionalEmails), subject: query.subject, message: query.details, status: 'QUEUED_DEMO', createdAt })
      return query
    })
  },
  replyToQuery(requestNumber, detail) {
    return database.mutate((db) => {
      const request = db.governmentRequests.find((item) => item.requestNumber.toLowerCase() === requestNumber.trim().toLowerCase())
      const query = request?.queryHistory?.find((item) => item.status === 'OPEN')
      if (!request) return { error: 'Valid GoG Request Number was not found.' }
      if (!query) return { error: 'This request has no pending clarification query.' }
      if (!detail.reply?.trim()) return { error: 'Reply details are required.' }
      const repliedAt = now(), reply = { id: uid('GOGR'), reply: detail.reply.trim(), supportingDocuments: clone(detail.supportingDocuments || []), additionalDocuments: clone(detail.additionalDocuments || []), repliedAt }
      query.replies.push(reply); query.status = 'REPLIED'; request.status = 'CLARIFICATION_REPLY_RECEIVED'; request.updatedAt = repliedAt
      request.workflowHistory.push(history('CLARIFICATION_REPLY_RECEIVED', request.applicantName, query.queryNumber)); request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: 'QUERY_REPLY_RECEIVED', by: request.applicantName, at: repliedAt, newValue: clone(reply) }); request.statusHistory.push({ status: request.status, at: repliedAt, by: request.applicantName })
      return { request, query }
    })
  },
  acceptClarification(id, queryId) {
    return database.mutate((db) => { const request = db.governmentRequests.find((item) => item.id === id); const query = request?.queryHistory?.find((item) => item.id === queryId); if (!query || query.status !== 'REPLIED') return { error: 'A replied clarification was not found.' }; query.status = 'CLOSED'; query.closedAt = now(); request.status = 'CONFIGURATION_IN_PROGRESS'; request.updatedAt = query.closedAt; request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: 'CLARIFICATION_ACCEPTED', by: 'Super Admin', at: query.closedAt }); request.statusHistory.push({ status: request.status, at: query.closedAt, by: 'Super Admin' }); return request })
  },
  reject(id, reason, remarks = '') {
    return database.mutate((db) => {
      const request = db.governmentRequests.find((item) => item.id === id)
      if (!request || !reason?.trim()) return { error: 'Rejection reason is required.' }
      request.status = 'REJECTED'; request.rejectionReason = reason.trim(); request.rejectionRemarks = remarks; request.updatedAt = now(); request.auditTrail ||= []; request.statusHistory ||= []
      request.workflowHistory.push(history('REQUEST_REJECTED', 'Super Admin', reason.trim()))
      request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: 'REQUEST_REJECTED', by: 'Super Admin', at: request.updatedAt, remarks, newValue: { reason: reason.trim() } }); request.statusHistory.push({ status: 'REJECTED', at: request.updatedAt, by: 'Super Admin' })
      db.notifications.unshift({ id: uid('NTF'), type: 'EMAIL', event: 'GOG_REQUEST_REJECTED', to: request.applicantEmail, subject: `nProcure Client Account Request Rejected - ${request.requestNumber}`, message: `Your request ${request.requestNumber} was rejected. Reason: ${reason.trim()}`, status: 'QUEUED_DEMO', createdAt: request.updatedAt })
      return request
    })
  },
  approve(id, adminConfiguration) {
    return database.mutate((db) => {
      const request = db.governmentRequests.find((item) => item.id === id)
      if (!request) return { error: 'Request was not found.' }
      if (['ACCOUNT_ACTIVATED', 'REJECTED'].includes(request.status)) return { error: 'This request has already been decided.' }
      if (request.queryHistory?.some((query) => query.status !== 'CLOSED')) return { error: 'Resolve all clarification queries before activation.' }
      const duplicate = adminConfiguration.users.filter((candidate) => candidate.status === 'Active').find((candidate) => db.users.some((user) => user.userId.toLowerCase() === candidate.userId.trim().toLowerCase()))
      if (duplicate) return { error: `User ID ${duplicate.userId} already exists.` }
      const createdAt = now(), accountId = uid('CLA'), organizationId = uid('ORG')
      const createdUsers = adminConfiguration.users.filter((candidate) => candidate.status === 'Active').map((candidate) => ({ id: uid('USR'), userId: candidate.userId.trim(), password: candidate.password, userType: 'CLIENT', clientType: 'Government', displayName: candidate.displayName || candidate.officerName, organizationName: adminConfiguration.organization.department || request.organizationName, designation: candidate.designation, mobile: candidate.mobile, email: candidate.email, role: candidate.moduleAccess?.[0]?.roleName || candidate.primaryRole, roles: clone(candidate.moduleAccess || candidate.additionalRoles || []), rights: clone([...(new Set((candidate.moduleAccess || []).flatMap((access) => access.responsibilities || candidate.permissions || [])))]), scope: clone(candidate.scope || {}), moduleAccess: clone(candidate.moduleAccess || []), department: candidate.department, divisionId: candidate.divisionId || '', subDivisionId: candidate.subDivisionId || '', status: 'ACTIVE', mustChangePassword: true, accountId, organizationId, createdAt, updatedAt: createdAt }))
      db.users.push(...createdUsers)
      db.clientAccounts.push({ id: accountId, organizationId, userId: createdUsers[0]?.userId, userIds: createdUsers.map((user) => user.userId), type: 'CLIENT', clientType: 'Government', tenantCode: adminConfiguration.organization.tenantCode, organizationName: adminConfiguration.organization.department || request.organizationName, organizationSetup: clone(adminConfiguration.organization), departmentStructures: clone(adminConfiguration.departmentStructures || []), offices: clone(adminConfiguration.departmentStructures || adminConfiguration.offices || []), data: clone(request.submittedData), approvedModules: clone(adminConfiguration.modules || []), roleDefinitions: clone(adminConfiguration.roleDefinitions || []), advancedPrivileges: clone(adminConfiguration.advancedPrivileges || []), roleAssignments: clone(adminConfiguration.roleDefinitions || adminConfiguration.roleAssignments || []), approvalWorkflow: clone(adminConfiguration.approvalWorkflow || []), integrations: clone(adminConfiguration.integrations || []), authenticationPolicy: clone(adminConfiguration.security || {}), status: 'ACTIVE', createdAt, approvedAt: createdAt, workflowHistory: [history('ACCOUNT_ACTIVATED', 'Super Admin')] })
      request.status = 'ACCOUNT_ACTIVATED'; request.accountId = accountId; request.organizationId = organizationId; request.adminConfiguration = clone(adminConfiguration); request.accountCreation = clone(adminConfiguration); request.createdUserIds = createdUsers.map((user) => user.userId); request.updatedAt = createdAt; request.approvalInformation = { approvedBy: 'Super Admin', approvedAt: createdAt, remarks: adminConfiguration.finalRemarks || '' }
      request.workflowHistory.push(history('ACCOUNT_ACTIVATED', 'Super Admin')); request.auditTrail.push({ id: uid('AUD'), requestNumber: request.requestNumber, action: 'APPROVE_AND_ACTIVATE', by: 'Super Admin', at: createdAt, newValue: { accountId, organizationId, userIds: request.createdUserIds } }); request.statusHistory.push({ status: 'APPROVED', at: createdAt, by: 'Super Admin' }, { status: 'ACCOUNT_ACTIVATED', at: createdAt, by: 'Super Admin' })
      db.notifications.unshift({ id: uid('NTF'), type: 'EMAIL', event: 'GOG_ACCOUNT_APPROVED', to: request.applicantEmail, subject: `nProcure Client Account Created - ${request.requestNumber}`, message: `Your client account is approved. Created users: ${createdUsers.map((user) => user.userId).join(', ')}.`, status: 'QUEUED_DEMO', createdAt })
      createdUsers.forEach((user) => db.notifications.unshift({ id: uid('NTF'), type: 'EMAIL', event: 'USER_CREDENTIALS_CREATED', to: user.email, subject: 'Your nProcure 2.0 user has been created', message: `User ID: ${user.userId}. Temporary Password: ${user.password}. Change it on first login.`, status: 'QUEUED_DEMO', createdAt }))
      return request
    })
  },
}

const accountCollection = (db, type) => type === 'CLIENT' ? db.clientAccounts : db.bidderAccounts
export const accountService = {
  get(userId) { const db = database.read(); const user = db.users.find((x) => x.userId === userId); return clone(accountCollection(db, user?.userType).find((x) => x.userId === userId || x.userIds?.includes(userId)) || null) },
  saveDraft(userId, data, step) {
    return database.mutate((db) => {
      const user = db.users.find((x) => x.userId === userId); const records = accountCollection(db, user.userType); let account = records.find((x) => x.userId === userId)
      if (!account) { account = { id: uid(user.userType === 'CLIENT' ? 'CLA' : 'BDA'), organizationId: uid('ORG'), userId, type: user.userType, status: 'DRAFT', createdAt: now(), workflowHistory: [] }; records.push(account) }
      account.data = { ...(account.data || {}), ...clone(data) }; account.currentStep = step; account.updatedAt = now(); return account
    })
  },
  submitClient(userId, data) {
    return database.mutate((db) => {
      const user = db.users.find((x) => x.userId === userId); const account = db.clientAccounts.find((x) => x.userId === userId); Object.assign(account, { data: clone(data), status: 'CLIENT_PENDING_APPROVAL', submittedAt: now(), updatedAt: now() })
      const requestNumber = nextNumber(db, 'request', 'CAR'); const request = { id: uid('REQ'), requestNumber, accountId: account.id, userId, organizationId: account.organizationId, organizationName: user.organizationName, clientType: user.clientType, submittedData: clone(data), requestedModules: data.modules || [], status: 'CLIENT_PENDING_APPROVAL', submittedAt: now(), workflowHistory: [history('SUBMITTED', user.displayName)] }
      db.accountRequests.unshift(request); user.status = 'CLIENT_PENDING_APPROVAL'; user.updatedAt = now(); return request
    })
  },
  activateBidder(userId, data, packageId, paymentStatus = 'SUCCESS') {
    return database.mutate((db) => {
      const user = db.users.find((x) => x.userId === userId); let account = db.bidderAccounts.find((x) => x.userId === userId)
      if (!account) { account = { id: uid('BDA'), organizationId: uid('ORG'), userId, type: 'BIDDER', createdAt: now(), workflowHistory: [] }; db.bidderAccounts.push(account) }
      account.data = clone(data); account.status = paymentStatus === 'SUCCESS' ? 'ACTIVE' : 'BIDDER_PAYMENT_PENDING'; account.updatedAt = now()
      const pkg = db.packages.find((x) => x.id === packageId); const payment = { id: nextNumber(db, 'payment', 'PAY'), bidderAccountId: account.id, package: clone(pkg), amount: pkg.amount + pkg.tax, transactionId: uid('TXN'), paymentDate: now(), status: paymentStatus }; db.payments.push(payment)
      if (paymentStatus === 'SUCCESS') { const from = new Date(); const till = new Date(from); till.setFullYear(till.getFullYear() + pkg.years); const subscription = { id: nextNumber(db, 'subscription', 'SUB'), bidderAccountId: account.id, package: clone(pkg), activationDate: now(), validFrom: from.toISOString(), validTill: till.toISOString(), renewalDueDate: till.toISOString(), status: 'ACTIVE' }; db.subscriptions.push(subscription); account.subscriptionId = subscription.id; user.status = 'ACTIVE'; account.workflowHistory.push(history('PAYMENT_SUCCESS_AND_ACTIVATED', user.displayName)) } else user.status = 'BIDDER_PAYMENT_PENDING'
      user.updatedAt = now(); return { account, payment }
    })
  },
}

export const approvalService = {
  list() { return clone(database.read().accountRequests) },
  find(id) { return clone(database.read().accountRequests.find((x) => x.id === id || x.requestNumber === id) || null) },
  query(id, detail) { return database.mutate((db) => { const req = db.accountRequests.find((x) => x.id === id); const query = { id: uid('QRY'), requestId: req.id, subject: detail.subject, description: detail.description, requiredCorrection: detail.requiredCorrection, raisedBy: 'Super Admin', queryDate: now(), status: 'OPEN', responses: [] }; db.accountQueries.push(query); req.status = 'CLIENT_QUERY'; req.workflowHistory.push(history('QUERY_RAISED', 'Super Admin', detail.description)); db.users.find((x) => x.userId === req.userId).status = 'CLIENT_QUERY'; return query }) },
  queriesForUser(userId) { const db = database.read(); const ids = db.accountRequests.filter((x) => x.userId === userId).map((x) => x.id); return clone(db.accountQueries.filter((x) => ids.includes(x.requestId))) },
  respond(queryId, response, document) { return database.mutate((db) => { const query = db.accountQueries.find((x) => x.id === queryId); query.responses.push({ id: uid('RSP'), response, document, by: db.accountRequests.find((x) => x.id === query.requestId).userId, at: now() }); query.status = 'RESPONDED'; const req = db.accountRequests.find((x) => x.id === query.requestId); req.status = 'CLIENT_PENDING_APPROVAL'; req.workflowHistory.push(history('QUERY_RESPONDED', req.userId, response)); db.users.find((x) => x.userId === req.userId).status = 'CLIENT_PENDING_APPROVAL'; return query }) },
  reject(id, note) { return this.decide(id, 'REJECTED', { note }) },
  approve(id, config) { return this.decide(id, 'ACTIVE', config) },
  decide(id, status, config) { return database.mutate((db) => { const req = db.accountRequests.find((x) => x.id === id); req.status = status; req.approvalConfiguration = clone(config); req.updatedAt = now(); req.workflowHistory.push(history(status === 'ACTIVE' ? 'APPROVED_AND_ACTIVATED' : 'REJECTED', 'Super Admin', config.note || '')); const user = db.users.find((x) => x.userId === req.userId); user.status = status; user.updatedAt = now(); const account = db.clientAccounts.find((x) => x.id === req.accountId); account.status = status; account.approvedModules = config.approvedModules || []; account.role = config.role || ''; account.permissions = config.permissions || {}; account.authenticationPolicy = config.authenticationPolicy || { dscRequiredForLogin: false, mfa: true }; account.tenantCode = config.tenantCode; account.approvedAt = status === 'ACTIVE' ? now() : null; return req }) },
}

export const organizationAccessService = {
  users(accountId) { return clone(database.read().operationalUsers.filter((item) => item.accountId === accountId)) },
  createUser(accountId, input) {
    return database.mutate((db) => {
      const duplicate = db.users.some((item) => item.userId.toLowerCase() === input.userId.trim().toLowerCase()) || db.operationalUsers.some((item) => item.userId.toLowerCase() === input.userId.trim().toLowerCase())
      if (duplicate) return { error: 'User ID already exists.' }
      const record = { id: uid('OPU'), accountId, ...clone(input), userId: input.userId.trim(), status: input.status || 'ACTIVE', createdAt: now(), updatedAt: now() }
      db.operationalUsers.push(record); return { user: record }
    })
  },
  assignments(accountId) { return clone(database.read().roleAssignments.filter((item) => item.accountId === accountId)) },
  assignRole(accountId, input) {
    return database.mutate((db) => {
      const account = db.clientAccounts.find((item) => item.id === accountId)
      if (!account?.approvedModules?.includes(input.module)) return { error: 'This module is not approved for the organization.' }
      const record = { id: uid('ROL'), accountId, organizationId: account.organizationId, ...clone(input), status: 'ACTIVE', createdAt: now(), updatedAt: now() }
      db.roleAssignments.push(record); return { assignment: record }
    })
  },
}

export const processAuthenticationService = {
  rulesForAccount(accountId) {
    const account = database.read().clientAccounts.find((item) => item.id === accountId)
    return clone(account?.authenticationPolicy?.processRules || [])
  },
  ruleFor(accountId, module, processStage) {
    return this.rulesForAccount(accountId).find((rule) => rule.module === module && (rule.processStage === processStage || rule.otherProcessStage === processStage)) || null
  },
  requiresConfirmation(accountId, module, processStage) {
    const rule = this.ruleFor(accountId, module, processStage)
    return rule?.confirmationRequired === true || rule?.confirmationRequired === 'Yes'
  },
}

export const portalRepository = {
  snapshot() { return clone(database.read()) },
  exportBackup() {
    return {
      format: 'nprocure2-prototype-backup',
      version: 1,
      application: { name: 'nProcure 2.0', codeVersion: 'prototype-2.0' },
      exportedAt: now(),
      database: this.snapshot(),
    }
  },
  importBackup(backup) {
    const payload = typeof backup === 'string' ? JSON.parse(backup) : backup
    if (payload?.format !== 'nprocure2-prototype-backup' || !payload.database) throw new Error('This is not a valid nProcure 2.0 backup file.')
    const db = payload.database
    const requiredCollections = ['users', 'registrations', 'clientAccounts', 'bidderAccounts', 'accountRequests']
    if (!requiredCollections.every((key) => Array.isArray(db[key]))) throw new Error('The backup file is incomplete or damaged.')
    database.write(db)
    storageAdapter.remove(SESSION_KEY)
    return clone(db)
  },
  resetDemo() { return database.reset() },
}
