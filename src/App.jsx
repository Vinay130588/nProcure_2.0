import { useEffect, useRef, useState } from 'react'
import { Award, Bell, Building2, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, Construction, Droplets, FileCheck2, FileText, Fingerprint, Gavel, GraduationCap, Hospital, IndianRupee, KeyRound, Landmark, Laptop, LineChart, LockKeyhole, Network, Package, Route, Search, ShieldCheck, Sparkles, Sun, UploadCloud, UserRound, Users, Wrench, Zap } from 'lucide-react'
import './App.css'
import { benefits, categories, journeySteps, notices, stats } from './data'
import { authService, organizationConfig, portalService, registrationService, tenderService } from './services'
import { accountService, authServiceV2, portalRepository } from './portalStore'
import { AdminPortal, AuthenticatedPortal, StatefulRegistration } from './WorkflowPortal'

const routes = {
  home: '/', tenders: '/tenders', login: '/login', register: '/register', client: '/register/client', bidder: '/register/bidder', dashboard: '/dashboard', accountSetup: '/dashboard/account-setup', queryResponse: '/dashboard/query', track: '/track-registration', adminLogin: '/admin/login', admin: '/admin/account-requests', success: '/registration/success',
}
const routeFromPath = (path) => Object.entries(routes).find(([, value]) => value === path)?.[0] || (path.startsWith('/dashboard/') ? 'dashboardPage' : path.startsWith('/admin/') ? 'admin' : 'home')
const statIcons = { FileText, CalendarDays, Clock3, Network, IndianRupee, Building2 }
const journeyIcons = [Search, FileText, ClipboardCheck, UploadCloud, LineChart, Award]
const benefitIcons = [ShieldCheck, Clock3, LockKeyhole, LineChart]
const categoryIcons = { Construction, Droplets, Zap, Sun, Hospital, Route, Laptop, Wrench, Package }

function App() {
  const [route, setRoute] = useState(() => routeFromPath(window.location.pathname))
  const [query, setQuery] = useState('')
  const [session, setSession] = useState(() => authServiceV2.current())
  const [lastRegistration, setLastRegistration] = useState(null)
  const navigate = (next, data) => {
    const path = routes[next] || next
    window.history.pushState(data || null, '', path)
    setRoute(routeFromPath(path.split('?')[0]))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    const onPop = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const search = (event) => { event?.preventDefault(); navigate('tenders') }
  let content
  if (route === 'tenders') content = <TenderSearch query={query} setQuery={setQuery} />
  else if (route === 'login' || route === 'adminLogin') content = <Login admin={route === 'adminLogin'} navigate={navigate} setSession={setSession} />
  else if (route === 'register') content = <StatefulRegistration navigate={navigate} />
  else if (route === 'client') content = <ClientRegistration navigate={navigate} onComplete={(record) => { setLastRegistration(record); navigate('success') }} />
  else if (route === 'bidder') content = <BidderRegistration navigate={navigate} />
  else if (route === 'success') content = <RegistrationSuccess record={lastRegistration} navigate={navigate} />
  else if (route === 'track') content = <TrackRegistration />
  else if (route === 'dashboard' || route === 'dashboardPage' || route === 'accountSetup' || route === 'queryResponse') content = <AuthenticatedPortal session={session} navigate={navigate} onLogout={() => setSession(null)} />
  else if (route === 'admin') content = <AdminPortal session={session} navigate={navigate} onLogout={() => setSession(null)} />
  else content = <Home query={query} setQuery={setQuery} search={search} />
  const standalone = ['login','adminLogin','dashboard','dashboardPage','accountSetup','queryResponse','admin'].includes(route)
  return <div className="portal-shell">{!standalone&&<Header navigate={navigate} session={session}/>} {content} {!standalone&&<Footer navigate={navigate}/>}</div>
}

function BackupManager() {
  const inputRef = useRef(null)
  const [message, setMessage] = useState('')
  const exportData = () => {
    const backup = portalRepository.exportBackup()
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `nprocure-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(link.href)
    setMessage('Backup exported successfully.')
  }
  const importData = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      portalRepository.importBackup(await file.text())
      setMessage('Backup imported. Reloading…')
      // Refresh the current public page without adding a login entry to browser
      // history. Imported sessions are intentionally cleared by the repository.
      window.setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      setMessage(error.message || 'Backup could not be imported.')
    }
  }
  return <aside className="backup-manager" aria-label="Prototype data backup">
    <strong>Prototype Data</strong>
    <button onClick={exportData}>Export Backup</button>
    <button onClick={() => inputRef.current?.click()}>Import Backup</button>
    <input ref={inputRef} type="file" accept="application/json,.json" onChange={importData} hidden />
    {message && <small role="status">{message}</small>}
  </aside>
}

function Header({ navigate, session }) {
  return <header className="site-header">
    <div className="utility-bar"><div className="utility-info"><span>Toll Free: +91 7359021663</span><LiveDateTime /></div><div className="utility-actions"><button onClick={() => navigate('track')}>Track Registration</button><button onClick={() => navigate('login')}>{session ? session.name : 'Login'}</button><button className="charge-button" onClick={() => navigate('register')}>Register</button></div></div>
    <nav className="navbar" aria-label="Primary navigation"><button className="brand" onClick={() => navigate('home')} aria-label="nProcure home"><span className="brand-mark">(n)</span><span className="brand-text">Procure <small>2.0</small></span></button><div className="nav-links"><button onClick={() => navigate('home')}>Home</button><button onClick={() => navigate('tenders')}>Tenders</button><button>Auctions</button><button>Resources</button><button>Training</button><button>Support</button><button>FAQs</button></div><div className="gnfc-mark"><img src="/gnfc-logo.png" alt="GNFC" /></div></nav>
  </header>
}

function LiveDateTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timerId)
  }, [])
  const date = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(now)
  const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)
  return <time className="live-date-time" dateTime={now.toISOString()}><CalendarDays size={14} aria-hidden="true"/><span>{date}</span><Clock3 size={14} aria-hidden="true"/><strong>{time}</strong></time>
}

function Home({ query, setQuery, search }) {
  const [liveStats, setLiveStats] = useState(stats)
  const [statsCycle, setStatsCycle] = useState(0)
  useEffect(() => {
    let active = true
    const refreshStats = async () => {
      const latest = await portalService.getStats()
      if (active) {
        setLiveStats(latest)
        setStatsCycle((cycle) => cycle + 1)
      }
    }
    refreshStats()
    const intervalId = window.setInterval(refreshStats, 30000)
    return () => { active = false; window.clearInterval(intervalId) }
  }, [])
  return <main>
    <section className="hero-section"><div className="hero-bg"/><div className="hero-content"><h1>Discover Government & Enterprise <span>Procurement Opportunities</span></h1><p>One configurable, secure and transparent platform for Government, PSU, Enterprise and Vendors.</p><form className="smart-search" onSubmit={search}><label className="sr-only" htmlFor="smart-search">Search tenders</label><Search className="search-icon"/><input id="smart-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tender, department, category, location, product or Tender ID…"/><button type="submit" className="ai-search-button"><Sparkles size={19} aria-hidden="true"/><span>AI Search</span></button></form></div></section>
    <section className="stats-strip" aria-label="Portal statistics" aria-live="polite">{liveStats.map((stat) => { const Icon = statIcons[stat.icon]; return <article key={stat.label} className="stat-card"><span className={`mini-icon ${stat.tone}`}><Icon size={22}/></span><div><AnimatedNumber value={stat.value} cycle={statsCycle}/><span>{stat.label}</span></div></article> })}</section>
    <section className="section process-section"><SectionTitle title="A simpler e-Procurement journey" text="Discover opportunities and participate with confidence"/><div className="journey-grid">{journeySteps.map(([title, text], i) => { const JourneyIcon = journeyIcons[i]; return <article className="journey-card" key={title}><div className="journey-visual"><span className="journey-icon"><JourneyIcon size={32}/></span><span className="step-number">{String(i + 1).padStart(2, '0')}</span></div><h3>{title}</h3><p>{text}</p></article> })}</div><div className="benefit-grid">{benefits.map(([title, text], i) => { const BenefitIcon = benefitIcons[i]; return <article className="benefit-card" key={title}><span className="benefit-icon"><BenefitIcon size={23}/></span><div><strong>{title}</strong><p>{text}</p></div></article> })}</div></section>
    <section className="updates-band"><div className="updates-grid"><article className="panel"><PanelTitle icon={Bell} title="Notice Board"/><div className="notice-list">{notices.slice(0,3).map(([badge,title,dept,date]) => <div className="notice-item" key={title}><div><span className="notice-badge">{badge}</span><h3>{title}</h3><p>{dept} · {date}</p></div><span className="pdf-chip">PDF</span></div>)}</div></article><article className="panel training-panel"><PanelTitle icon={GraduationCap} title="Online Training"/><div className="training-visual"><GraduationCap size={54}/></div><h3>Weekly Bidder Online Training</h3><p>Every Thursday, 15:30–16:30 IST</p><button className="primary-wide">Join Training</button></article><article className="panel news-panel"><PanelTitle icon={CalendarDays} title="News & Events"/><div className="news-image"/><h3>nProcure 2.0: one platform, multiple editions</h3><p>A configurable procurement experience built for modern organizations.</p></article></div></section>
  </main>
}

function AnimatedNumber({ value, cycle }) {
  const [display, setDisplay] = useState(value)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return undefined
    }
    const match = value.match(/^([^0-9]*)([\d,.]+)(.*)$/)
    if (!match) { setDisplay(value); return undefined }
    const [, prefix, numericPart, suffix] = match
    const target = Number(numericPart.replace(/,/g, ''))
    const decimalPlaces = numericPart.includes('.') ? numericPart.split('.')[1].length : 0
    const duration = 1250
    const startedAt = performance.now()
    let frameId
    const format = (number) => decimalPlaces
      ? number.toFixed(decimalPlaces)
      : Math.round(number).toLocaleString('en-IN')
    const tick = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(`${prefix}${format(target * eased)}${suffix}`)
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }
    setDisplay(`${prefix}${format(0)}${suffix}`)
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [value, cycle])
  return <strong className="animated-stat-number">{display}</strong>
}

function TenderSearch({ query, setQuery }) {
  const [results, setResults] = useState([]), [loading, setLoading] = useState(true), [category, setCategory] = useState(''), [status, setStatus] = useState('')
  useEffect(() => { let active = true; setLoading(true); tenderService.search({ query, category, status }).then((data) => { if (active) { setResults(data); setLoading(false) } }); return () => { active = false } }, [query, category, status])
  const chooseCategory = (name) => setCategory(category === name ? '' : name)
  return <main className="search-page">
    <section className="search-page-hero"><div><h1><span>(n)procure</span> Portal</h1><p>All government tenders from Gujarat departments—on one trusted portal.</p><form className="smart-search compact-search" onSubmit={(e)=>e.preventDefault()}><label className="sr-only" htmlFor="tender-search">Search tenders</label><Search className="search-icon"/><input id="tender-search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search tender, department, category, location, product or Tender ID…"/><button className="ai-search-button"><Sparkles size={18}/>AI Search</button></form></div></section>
    <div className="search-content"><section className="category-row"><div className="category-heading"><h2>Browse by Category</h2><button type="button" onClick={()=>setCategory('')}>All 42 categories →</button></div><div className="category-grid">{categories.map(([name,count,icon])=>{const Icon=categoryIcons[icon];return <button key={name} type="button" className={`category-card ${category===name?'selected':''}`} onClick={()=>chooseCategory(name)}><span><Icon size={25}/></span><strong>{name}</strong><small>{count}</small></button>})}</div></section>
      <section className="results-layout"><aside className="filters" aria-label="Tender filters"><SearchFilter title="Status" items={['Open','Corrigendum']} value={status} onChange={setStatus}/><div className="filter-box"><h3>Tender Value</h3><input type="range" min="0" max="100" defaultValue="38" aria-label="Tender value range"/><div className="range-labels"><span>₹0</span><span>₹1 Cr+</span></div></div><VisualFilter title="District" items={['Ahmedabad','Surat','Vadodara','Gandhinagar','Rajkot','Bhavnagar','Anand']}/><VisualFilter title="Department" items={['Roads & Buildings','GWSSB','GUVNL / GETCO','GIDC','Municipal Corps.','NHM Gujarat']}/><VisualFilter title="Tender Type" items={['Open Tender','Limited Tender','EOI','Rate Contract','e-Auction']}/><div className="alert-box"><strong>Daily Tender Alerts</strong><p>Get matching tenders in your inbox every morning—free.</p><label className="sr-only" htmlFor="alert-email">Email address</label><input id="alert-email" type="email" placeholder="your@company.com"/><button type="button">Set Free Alert</button></div></aside>
        <section className="results-column"><div className="result-toolbar"><p>{loading?'Searching…':<>Showing <strong>{results.length} active tenders</strong><span>Gujarat eTendering Portal</span></>}</p><select aria-label="Sort tenders"><option>Sort: Closing Soonest</option><option>Sort: Tender Value</option></select></div>{!loading&&!results.length&&<Empty title="No tenders found" text="Try a broader keyword or clear filters."/>}{results.map((t)=><article className="tender-card" key={t.id}><div className="tender-head"><span className="org-chip">{t.org.split(' ').map(w=>w[0]).slice(0,4).join('')}</span><div><strong>{t.org}</strong><small>NIT No: {t.id}</small></div><div className="tag-row">{t.tags.map(tag=><span key={tag}>{tag}</span>)}<span>{t.category}</span><span>{t.location}</span></div></div><h2>{t.title}</h2><p>{t.summary}</p><div className="tender-metrics"><Metric label="Tender Value" value={t.value}/><Metric label="EMD" value={t.emd}/><Metric label="Doc Fee" value={t.fee}/><Metric label="Closing Date" value={t.closing}/><Metric label="Type" value={t.type}/></div><div className="tender-actions"><span>{t.docs} docs · {t.location} · {t.status}</span><div><button className="ghost-button">☆ Watchlist</button><button className="details-button">View Details →</button></div></div></article>)}<div className="pagination">{['‹','1','2','3','4','5','…','167','›'].map(x=><button className={x==='1'?'active':''} key={x}>{x}</button>)}</div></section></section>
    </div></main>
}

function SearchFilter({ title, items, value, onChange }) { return <div className="filter-box"><h3>{title}</h3><label><input type="checkbox" checked={!value} onChange={()=>onChange('')}/><span>All active</span><small>16,775</small></label>{items.map((item,i)=><label key={item}><input type="checkbox" checked={value===item} onChange={()=>onChange(value===item?'':item)}/><span>{item}</span><small>{(3612-i*1701).toLocaleString('en-IN')}</small></label>)}</div> }
function VisualFilter({ title, items }) { return <div className="filter-box"><h3>{title}</h3>{items.map((item,i)=><label key={item}><input type="checkbox" defaultChecked={i===0}/><span>{item}</span><small>{(3102-i*331).toLocaleString('en-IN')}</small></label>)}</div> }

function Login({ admin, navigate, setSession }) {
  const [form,setForm]=useState({userId:admin?'superadmin':new URLSearchParams(window.location.search).get('user')||'new.client',password:admin?'Admin@123':'Demo@123'}),[stage,setStage]=useState('credentials'),[mode,setMode]=useState(admin?'password':'otp'),[identified,setIdentified]=useState(null),[otp,setOtp]=useState('123456'),[error,setError]=useState(''),[busy,setBusy]=useState(false),[resend,setResend]=useState(45)
  useEffect(()=>{if(stage!=='credentials'||mode!=='otp'||resend<=0)return undefined;const id=window.setTimeout(()=>setResend(resend-1),1000);return()=>window.clearTimeout(id)},[stage,mode,resend])
  const submit=async(e)=>{e.preventDefault();setBusy(true);setError('');const user=mode==='otp'&&!admin?authServiceV2.identify(form.userId):authServiceV2.verifyPassword(form.userId,form.password);if(!user||(admin&&user.role!=='admin')){setBusy(false);return setError(mode==='otp'?'User ID was not found.':'The credentials do not match the saved account.')}if(mode==='otp'&&!authServiceV2.verifyOtp(otp)){setBusy(false);return setError('Use demo OTP 123456.')}setBusy(false);setIdentified(user);if(user.role==='admin'){const active=authServiceV2.login(user);setSession(active);navigate('admin');return}const account=accountService.get(user.userId);if(user.status==='ACTIVE'&&account?.authenticationPolicy?.dscRequiredForLogin){setStage('dsc');return}finish(user)}
  const finish=(matched=identified)=>{const active=authServiceV2.login(matched);setSession(active);if(active.status==='REGISTERED_ACCOUNT_CREATION_PENDING')navigate('accountSetup');else if(active.status==='CLIENT_QUERY')navigate('queryResponse');else navigate('dashboard')}
  return <main className="sso-login-page"><section className="login-visual"><FloatingProcurementIcons/><button className="login-brand" onClick={()=>navigate('home')}><span>(n)</span><strong>Procure <b>2.0</b></strong></button><div className="login-message"><h1>Secure.<br/><em>Transparent.</em><br/>Future Ready.</h1><p>A unified, secure and transparent procurement platform for Government, PSU, Enterprise and Vendors.</p><div className="login-benefits"><LoginBenefit icon={ShieldCheck} title="Secure" text="Data Protection"/><LoginBenefit icon={Fingerprint} title="Multi-Factor" text="Authentication"/><LoginBenefit icon={UserRound} title="Role-based" text="Access"/><LoginBenefit icon={CheckCircle2} title="Enterprise" text="Grade Security"/></div></div></section><section className="login-form-side"><div className="auth-card modern-auth-card">{stage==='credentials'&&<form onSubmit={submit}><div className="auth-heading"><span><LockKeyhole/></span><h1>{admin?'Super Admin Login':'Welcome back'}</h1><p>Sign in securely to access nProcure 2.0</p></div><label className="login-field"><span>User ID / Email <b>*</b></span><div><UserRound size={19}/><input value={form.userId} onChange={e=>setForm({...form,userId:e.target.value})}/></div></label>{mode==='otp'?<><label className="login-field"><span>Registered Mobile</span><div className="registered-mobile"><span>******* 6789</span><button type="button">Change Mobile?</button></div><small>OTP will be sent to your registered mobile number</small></label><div className="otp-field-group"><div><strong>Enter OTP <b>*</b></strong><small>{resend>0?`Resend OTP in 00:${String(resend).padStart(2,'0')}`:<button type="button" onClick={()=>setResend(45)}>Resend OTP</button>}</small></div><OtpBoxes value={otp} onChange={setOtp}/><p>Demo OTP: 123456</p></div></>:<label className="login-field"><span>Password <b>*</b></span><div><KeyRound size={19}/><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div></label>}<div className="login-options"><label><input type="checkbox"/> Remember me</label><button type="button">{mode==='otp'?'Forgot User ID?':'Forgot Password?'}</button></div>{error&&<ErrorText text={error}/>}<button className="secure-login-button" disabled={busy}><LockKeyhole size={18}/>{busy?'Verifying…':'Continue securely'}</button>{!admin&&<button type="button" className="login-mode-switch" onClick={()=>{setMode(mode==='otp'?'password':'otp');setError('')}}>{mode==='otp'?'Login with your password':'Login with mobile OTP'}</button>}{!admin&&<><div className="login-divider"><span>or</span></div><button type="button" className="sso-button"><Landmark size={20}/><span><strong>Login with SSO</strong><small>Use your organization’s corporate SSO</small></span></button></>}<p className="demo-accounts">Demo Accounts: <b>{admin?'superadmin / Admin@123':'gov.demo · OTP 123456'}</b></p></form>}{stage==='dsc'&&<div className="auth-stage"><div className="auth-heading"><span><ShieldCheck/></span><h1>DSC Authentication</h1><p>Your organization requires certificate authentication</p></div><div className="certificate-card"><ShieldCheck/><div><strong>Demo Certificate Detected</strong><p>{identified.name} · Valid until 31 Dec 2027</p></div></div><button className="secure-login-button" onClick={finish}>Authenticate with DSC</button></div>}{stage==='success'&&<SuccessBlock title="Login successful" text={`Welcome, ${identified.name}. Your authentication policy was verified.`} action={()=>navigate('home')} actionText="Continue to portal"/>}</div></section></main>
}

function OtpBoxes({value,onChange}){const digits=value.padEnd(6,' ').slice(0,6).split('');const change=(index,next,event)=>{if(!/^\d?$/.test(next))return;const copy=value.padEnd(6,' ').slice(0,6).split('');copy[index]=next||' ';onChange(copy.join('').replace(/\s/g,''));if(next)event.currentTarget.nextElementSibling?.focus()};return <div className="otp-boxes">{digits.map((digit,i)=><input key={i} value={digit.trim()} inputMode="numeric" maxLength="1" aria-label={`OTP digit ${i+1}`} onChange={e=>change(i,e.target.value,e)} onKeyDown={e=>{if(e.key==='Backspace'&&!e.currentTarget.value)e.currentTarget.previousElementSibling?.focus()}}/>)}</div>}

const floatingLoginIcons = [Gavel,FileText,Landmark,LineChart,ShieldCheck,Award,IndianRupee,FileCheck2,Building2]
function FloatingProcurementIcons(){return <div className="floating-procurement-icons" aria-hidden="true">{floatingLoginIcons.map((Icon,i)=><span style={{'--icon-index':i}} key={i}><Icon/></span>)}</div>}
function LoginBenefit({icon:Icon,title,text}){return <div><span><Icon/></span><strong>{title}</strong><small>{text}</small></div>}

function CommonRegistration({navigate}) {
  const [step,setStep]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState(''),[otp,setOtp]=useState('123456'),[created,setCreated]=useState(null),[form,setForm]=useState({userType:'client',fullName:'',email:'',mobile:'',userId:'',password:''})
  const set=(key,value)=>setForm({...form,[key]:value})
  const continueToOtp=(e)=>{e.preventDefault();setError('');if(!form.fullName.trim()||!/^\S+@\S+\.\S+$/.test(form.email)||!/^\d{10}$/.test(form.mobile)||form.userId.length<4||form.password.length<8)return setError('Complete all fields with a valid email, 10-digit mobile, User ID and minimum 8-character password.');setStep(1)}
  const createAccount=async(e)=>{e.preventDefault();setError('');if(!(await authService.verifyOtp(otp)))return setError('Use demo OTP 123456.');setBusy(true);const result=await authService.registerBasic(form);setBusy(false);if(result.error)return setError(result.error);setCreated(result.user);setStep(2)}
  return <main className="common-register-page"><section className="common-register-intro"><span className="register-icon"><Users/></span><h1>Join nProcure 2.0</h1><p>Create your basic account first. After login, we’ll guide you through the full Client or Bidder registration.</p><div className="registration-flow"><span className="active">1<strong>Basic Account</strong></span><span className={step>0?'active':''}>2<strong>OTP Verification</strong></span><span>3<strong>Full Profile after Login</strong></span><span>4<strong>Admin Approval</strong></span></div></section><section className="common-register-card">{step===0&&<form onSubmit={continueToOtp}><div className="auth-heading"><h1>Common Registration</h1><p>Enter the details used for login and communication.</p></div><div className="user-type-toggle"><button type="button" className={form.userType==='client'?'selected':''} onClick={()=>set('userType','client')}><Building2/><strong>Client / Buyer</strong><small>Government, PSU or Enterprise</small></button><button type="button" className={form.userType==='bidder'?'selected':''} onClick={()=>set('userType','bidder')}><Users/><strong>Vendor / Bidder</strong><small>Supplier, contractor or service provider</small></button></div><div className="form-grid"><Field label="Full Name" value={form.fullName} onChange={v=>set('fullName',v)} required/><Field label="Email Address" type="email" value={form.email} onChange={v=>set('email',v)} required/><Field label="Mobile Number" value={form.mobile} onChange={v=>set('mobile',v)} required/><Field label="Create User ID" value={form.userId} onChange={v=>set('userId',v)} required/><Field label="Create Password" type="password" value={form.password} onChange={v=>set('password',v)} required/></div><label className="check-line"><input type="checkbox" required/> I accept the Terms, Privacy Policy and communication consent.</label>{error&&<ErrorText text={error}/>}<button className="secure-login-button">Verify Mobile & Email</button><p className="register-login-link">Already registered? <button type="button" onClick={()=>navigate('login')}>Login</button></p></form>}{step===1&&<form onSubmit={createAccount}><div className="auth-heading"><span><Fingerprint/></span><h1>Verify your account</h1><p>Enter the OTP sent to {form.mobile} and {form.email}</p></div><OtpBoxes value={otp} onChange={setOtp}/><p className="demo-hint">Prototype OTP: 123456</p>{error&&<ErrorText text={error}/>}<button className="secure-login-button" disabled={busy}>{busy?'Creating account…':'Verify & Create Account'}</button><button type="button" className="login-mode-switch" onClick={()=>setStep(0)}>← Edit basic details</button></form>}{step===2&&<div className="common-register-success"><CheckCircle2/><h1>Basic Account Created</h1><p>Your account <strong>{created?.userId}</strong> is ready. Login to complete the mandatory {created?.userType==='client'?'Client':'Bidder'} registration profile.</p><button className="secure-login-button" onClick={()=>navigate('login')}>Continue to Login</button></div>}</section></main>
}

function UserDashboard({session,setSession,navigate}) {
  const [submitted,setSubmitted]=useState(null)
  if(!session)return <main className="page-wrap"><Empty title="Login required" text="Please login to access your dashboard."/><button className="primary-wide compact" onClick={()=>navigate('login')}>Open Login</button></main>
  const current=submitted?{...session,profileStatus:'Submitted',applicationId:submitted.id}:session
  const complete=async(record)=>{const updated=await authService.markProfileSubmitted(session.userId,record.id);setSession(updated);setSubmitted(record);window.scrollTo({top:0,behavior:'smooth'})}
  if(!current.profileStatus||current.profileStatus==='Profile Pending')return <div className="profile-onboarding"><div className="onboarding-banner"><div><span>First-time login</span><h1>Complete your {current.userType==='bidder'?'Bidder':'Client'} Registration</h1><p>This mandatory profile will be submitted to nProcure Admin for verification and approval.</p></div><strong>Profile Pending</strong></div>{current.userType==='bidder'?<BidderRegistration navigate={navigate} onComplete={complete}/>:<ClientRegistration onComplete={complete}/>}</div>
  return <main className="page-wrap user-dashboard"><div className="dashboard-welcome"><div><span className="status-pill">{current.profileStatus}</span><h1>Welcome, {current.name}</h1><p>Application {current.applicationId}</p></div><button className="ghost-button" onClick={()=>{setSession(null);navigate('home')}}>Logout</button></div><section className="status-card"><h2>Registration Approval Status</h2><Timeline status={current.profileStatus}/><p>{current.profileStatus==='Approved'?'Your account is approved. Assigned modules will be available after activation.':'Your full registration has been sent to nProcure Admin. You will see approved modules here after verification.'}</p></section></main>
}

const clientSteps = ['Organization Type','Organization Details','Office / Address','Authorized User','Required Modules','Authentication','Documents','Review','Verification','Submission']
function ClientRegistration({ onComplete }) {
  const [step, setStep] = useState(0), [busy, setBusy] = useState(false), [errors, setErrors] = useState({}), [otp, setOtp] = useState(''), [draft, setDraft] = useState({ edition:'Government', orgSubtype:'State Government Department', organization:'', shortName:'', website:'', pan:'', gst:'', address:'', state:'Gujarat', city:'', pin:'', fullName:'', designation:'', email:'', mobile:'', modules:['e-Tender'], auth:'DSC / PKI (Mandatory)', documents:[] })
  const cfg = organizationConfig[draft.edition]
  const set = (key, value) => setDraft({...draft,[key]:value})
  const validate = () => { const next = {}; if (step === 1 && !draft.organization.trim()) next.organization='Organization name is required.'; if (step === 2 && (!draft.address || !/^\d{6}$/.test(draft.pin))) next.address='Address and a valid 6-digit PIN are required.'; if (step === 3) { if (!draft.fullName) next.fullName='Full name is required.'; if (!/^\S+@\S+\.\S+$/.test(draft.email)) next.email='Enter a valid official email.'; if (!/^\d{10}$/.test(draft.mobile)) next.mobile='Enter a valid 10-digit mobile number.' } if (step === 6 && !draft.documents.length) next.documents='Select at least one document for this demo.'; setErrors(next); return !Object.keys(next).length }
  const next = () => { if (validate()) setStep(Math.min(step + 1, 9)) }
  const submit = async () => { if (!(await authService.verifyOtp(otp))) return setErrors({otp:'Use demo OTP 123456.'}); setBusy(true); const record = await registrationService.submit(draft); setBusy(false); onComplete(record) }
  return <main className="wizard-page page-wrap"><SectionTitle title="Client Organization Registration" text="Fields and policies adapt to the selected organization edition."/><Stepper steps={clientSteps} active={step}/><section className="wizard-card">{step===0 && <div><h2>Select organization edition</h2><div className="option-grid">{Object.keys(organizationConfig).map(type => <button className={draft.edition===type?'selected':''} onClick={() => setDraft({...draft,edition:type,orgSubtype:organizationConfig[type].subtypes[0],auth:organizationConfig[type].auth[0]})} key={type}><Building2/><strong>{type}</strong><span>{organizationConfig[type].subtypes.join(' · ')}</span></button>)}</div><label>Organization subtype<select value={draft.orgSubtype} onChange={(e)=>set('orgSubtype',e.target.value)}>{cfg.subtypes.map(x=><option key={x}>{x}</option>)}</select></label></div>}{step===1 && <FormGrid><Field label="Organization / Department Name" value={draft.organization} onChange={v=>set('organization',v)} required error={errors.organization}/><Field label="Short Name" value={draft.shortName} onChange={v=>set('shortName',v)}/><Field label="Website" value={draft.website} onChange={v=>set('website',v)}/>{cfg.statutory && <><Field label="PAN" value={draft.pan} onChange={v=>set('pan',v)}/><Field label="GSTIN" value={draft.gst} onChange={v=>set('gst',v)}/></>}</FormGrid>}{step===2 && <FormGrid><Field label="Head Office Address" value={draft.address} onChange={v=>set('address',v)} required error={errors.address}/><Field label="State" value={draft.state} onChange={v=>set('state',v)} required/><Field label="City / District" value={draft.city} onChange={v=>set('city',v)} required/><Field label="PIN Code" value={draft.pin} onChange={v=>set('pin',v)} required/></FormGrid>}{step===3 && <FormGrid><Field label="Full Name" value={draft.fullName} onChange={v=>set('fullName',v)} required error={errors.fullName}/><Field label="Designation" value={draft.designation} onChange={v=>set('designation',v)} required/><Field label="Official Email" value={draft.email} onChange={v=>set('email',v)} required error={errors.email}/><Field label="Mobile Number" value={draft.mobile} onChange={v=>set('mobile',v)} required error={errors.mobile}/></FormGrid>}{step===4 && <Selectable title="Request platform modules" items={['e-Tender','e-Auction','Vendor Management','Contract Management','Purchase / Order Management','Payment Management','Analytics & Reports']} selected={draft.modules} onChange={v=>set('modules',v)}/>} {step===5 && <Selectable title="Authentication & security policy" single items={cfg.auth} selected={[draft.auth]} onChange={v=>set('auth',v[0])}/>} {step===6 && <div><h2>Registration documents</h2><p className="help">Files remain in memory and are not uploaded to a server.</p><Selectable items={cfg.documents} selected={draft.documents} onChange={v=>set('documents',v)}/>{errors.documents&&<ErrorText text={errors.documents}/>}</div>}{step===7 && <Review draft={draft}/>} {step===8 && <div><h2>Email & mobile verification</h2><p>A demo OTP has been sent to {draft.email || 'your official email'}.</p><Field label="Verification OTP" value={otp} onChange={setOtp} required error={errors.otp}/><p className="demo-hint">Demo OTP: 123456</p></div>}{step===9 && <div><h2>Ready to submit</h2><p>Your registration will be sent to nProcure for verification. Requested modules are activated only after approval.</p><label className="check-line"><input type="checkbox" defaultChecked/> I confirm that the supplied information is correct and accept the terms.</label></div>}<div className="wizard-actions">{step>0&&<button className="ghost-button" onClick={()=>setStep(step-1)}>Back</button>} {step<9?<button className="details-button" onClick={next}>Save & Continue</button>:<button className="details-button" disabled={busy} onClick={submit}>{busy?'Submitting…':'Submit Registration'}</button>}</div></section></main>
}

function BidderRegistration({ navigate, onComplete }) { const steps=['Authorized User','DSC / PKI','Company Profile','Preferences','Package','Portal Charges','Verification','Review & Submit']; const [step,setStep]=useState(0),[busy,setBusy]=useState(false);const submit=async()=>{setBusy(true);const record=await registrationService.submit({organization:'Registered Bidder Company',edition:'Bidder',orgSubtype:'Vendor / Bidder',fullName:'Authorized Bidder',email:'bidder@example.com',modules:['e-Tender']});setBusy(false);onComplete?.(record)};return <main className="wizard-page page-wrap"><SectionTitle title="Vendor / Bidder Registration" text="Complete your mandatory profile for nProcure Admin approval."/><Stepper steps={steps} active={step}/><section className="wizard-card"><h2>{steps[step]}</h2>{step===0&&<FormGrid><Field label="Authorized Person"/><Field label="Business Email"/><Field label="Mobile Number"/><Field label="Company Name"/></FormGrid>}{step===1&&<div className="certificate-card"><ShieldCheck/><div><strong>Configure DSC / PKI</strong><p>Detect and map the authorized signatory certificate.</p></div></div>}{step===2&&<FormGrid><Field label="PAN"/><Field label="GSTIN"/><Field label="Registered Address"/><Field label="Work Experience"/></FormGrid>}{step===3&&<Selectable title="Product / service preferences" items={['Civil Works','IT & Software','Healthcare','Electrical','Professional Services']} selected={[]} onChange={()=>{}}/>}{step===4&&<div className="option-grid"><button className="selected"><Award/><strong>Standard Vendor</strong><span>Annual registration · ₹2,500 mock charge</span></button><button><Building2/><strong>Enterprise Vendor</strong><span>Multi-user access · ₹7,500 mock charge</span></button></div>}{step===5&&<div><p>Payment gateway simulation only. No payment will be processed.</p><button className="details-button">Simulate successful payment</button></div>}{step===6&&<p>Email, mobile and DSC verification complete for this demo.</p>}{step===7&&<div><h3>Submit Bidder Application</h3><p>Your completed profile will be sent to nProcure Admin. Modules remain locked until approval.</p></div>}<div className="wizard-actions">{step>0&&<button className="ghost-button" onClick={()=>setStep(step-1)}>Back</button>}{step<7?<button className="details-button" onClick={()=>setStep(step+1)}>Continue</button>:<button className="details-button" disabled={busy} onClick={submit}>{busy?'Submitting…':'Submit for Approval'}</button>}</div></section></main> }

function RegistrationSuccess({ record, navigate }) { if(!record) return <main className="page-wrap"><Empty title="No recent registration" text="Complete a client registration to view its receipt."/></main>; return <main className="page-wrap"><section className="success-panel"><CheckCircle2 size={58}/><h1>Registration Successfully Submitted</h1><p>Keep this application number for tracking.</p><strong className="application-number">{record.id}</strong><div className="summary-grid"><Metric label="Organization" value={record.organization}/><Metric label="Submission Date" value={record.submitted}/><Metric label="Current Status" value={record.status}/></div><Timeline status={record.status}/><div className="hero-actions"><button className="details-button" onClick={()=>navigate('track')}>Track Application</button><button className="ghost-button" onClick={()=>navigate('home')}>Return Home</button></div></section></main> }

function TrackRegistration() { const [id,setId]=useState('NPR-REG-2026-000122'),[contact,setContact]=useState('raj@gov.in'),[record,setRecord]=useState(null),[searched,setSearched]=useState(false),[reply,setReply]=useState(''); const search=async(e)=>{e.preventDefault();setRecord(await registrationService.find(id,contact));setSearched(true)}; const respond=async()=>setRecord(await registrationService.reply(record.id,reply)); return <main className="page-wrap"><SectionTitle title="Track Registration" text="Enter the application number and registered email."/><form className="track-form" onSubmit={search}><Field label="Application Number" value={id} onChange={setId} required/><Field label="Registered Email" value={contact} onChange={setContact} required/><button className="details-button">Track Application</button></form>{searched&&!record&&<Empty title="Application not found" text="Check the application number and registered email."/>}{record&&<section className="status-card"><div className="status-heading"><div><span className="status-pill">{record.status}</span><h2>{record.organization}</h2><p>{record.id}</p></div></div><Timeline status={record.status}/>{record.query&&<div className="query-box"><strong>Query from nProcure review team</strong><p>{record.query}</p>{record.status==='Query Raised'&&<><Field label="Your clarification" value={reply} onChange={setReply}/><label className="upload-box"><UploadCloud/> Upload supporting document (demo)<input type="file"/></label><button className="details-button" disabled={!reply} onClick={respond}>Reply & Resubmit</button></>}</div>}</section>}</main> }

function AdminDashboard({ session, navigate }) { const [items,setItems]=useState([]),[filter,setFilter]=useState('All'); useEffect(()=>{registrationService.list().then(setItems)},[]); if(session?.role!=='admin') return <main className="page-wrap"><Empty title="Admin authentication required" text="Sign in with the Super Admin demo account."/><button className="primary-wide compact" onClick={()=>navigate('adminLogin')}>Open Admin Login</button></main>; const shown=filter==='All'?items:items.filter(x=>x.status===filter); return <main className="page-wrap admin-page"><SectionTitle title="Registration Management" text="Review and configure new nProcure organization tenants."/><div className="admin-stats">{['All','Submitted','Under Review','Query Raised','Approved','Rejected','Activated'].map(s=><button className={filter===s?'selected':''} key={s} onClick={()=>setFilter(s)}><strong>{s==='All'?items.length:items.filter(x=>x.status===s).length}</strong><span>{s}</span></button>)}</div><div className="admin-list">{shown.map(item=><article key={item.id}><div><span className="status-pill">{item.status}</span><h3>{item.organization}</h3><p>{item.id} · {item.edition} · {item.type}</p></div><div><p>{item.person}</p><small>{item.modules.join(', ')}</small></div><button className="details-button" onClick={()=>navigate(`/admin/registrations/${item.id}`)}>Review</button></article>)}</div></main> }

function AdminReview({ navigate }) { const id=decodeURIComponent(window.location.pathname.split('/').pop()),[record,setRecord]=useState(null),[note,setNote]=useState(''),[busy,setBusy]=useState(false); useEffect(()=>{registrationService.list().then(list=>setRecord(list.find(x=>x.id===id)))},[id]); const act=async(status)=>{setBusy(true);setRecord(await registrationService.updateStatus(id,status,note));setBusy(false)}; if(!record)return <main className="page-wrap"><p>Loading registration…</p></main>; return <main className="page-wrap"><button className="ghost-button" onClick={()=>navigate('admin')}>← Registrations</button><section className="review-layout"><div className="wizard-card"><span className="status-pill">{record.status}</span><h1>{record.organization}</h1><Review draft={{...record,fullName:record.person,auth:record.edition==='Government'?'DSC / PKI':'Password + OTP',documents:['Organization proof','Authorization letter']}}/></div><aside className="decision-card"><h2>Admin decision</h2><label>Edition Pack<select defaultValue={record.edition}><option>Government</option><option>PSU</option><option>Enterprise</option></select></label><label>Tenant Code<input defaultValue={record.organization.replace(/\W/g,'').slice(0,8).toUpperCase()}/></label><label>Primary User Role<select><option>Organization Admin</option><option>Procurement Admin</option></select></label><label>Query / decision notes<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Required for query or rejection"/></label><button disabled={busy} className="details-button" onClick={()=>act('Approved')}>Approve & Configure</button><button disabled={busy||!note} className="ghost-button" onClick={()=>act('Query Raised')}>Raise Query</button><button disabled={busy||!note} className="danger-button" onClick={()=>act('Rejected')}>Reject</button>{record.status==='Approved'&&<button className="primary-wide" onClick={()=>act('Activated')}>Activate Tenant</button>}{record.activation&&<div className="activation-box"><CheckCircle2/><strong>Tenant activated</strong><span>Tenant code: {record.activation}</span></div>}</aside></section></main> }

function Stepper({steps,active}) { return <ol className="stepper" aria-label="Registration progress">{steps.map((s,i)=><li className={i===active?'active':i<active?'done':''} key={s}><span>{i<active?'✓':i+1}</span><small>{s}</small></li>)}</ol> }
function Field({label,type='text',value,onChange,required,error}) { const controlled = onChange ? { value: value ?? '', onChange: e=>onChange(e.target.value) } : {}; return <label className="field"><span>{label}{required&&<b> *</b>}</span><input type={type} {...controlled} aria-invalid={!!error}/>{error&&<small className="error-text">{error}</small>}</label> }
function FormGrid({children}) { return <div className="form-grid">{children}</div> }
function Selectable({title,items,selected,onChange,single=false}) { const toggle=(x)=>onChange(single?[x]:selected.includes(x)?selected.filter(y=>y!==x):[...selected,x]); return <div><h2>{title}</h2><div className="select-grid">{items.map(x=><button key={x} className={selected.includes(x)?'selected':''} onClick={()=>toggle(x)}><CheckCircle2 size={18}/>{x}</button>)}</div></div> }
function Review({draft}) { return <div className="review-sections"><section><h3>Organization</h3><p>{draft.organization} · {draft.edition} · {draft.type||draft.orgSubtype}</p></section><section><h3>Authorized User</h3><p>{draft.fullName} {draft.email&&`· ${draft.email}`}</p></section><section><h3>Requested Modules</h3><p>{draft.modules?.join(', ')}</p></section><section><h3>Security</h3><p>{draft.auth}</p></section><section><h3>Documents</h3><p>{draft.documents?.join(', ')}</p></section></div> }
function Timeline({status}) { const stages=['Submitted','Under Review',status==='Rejected'?'Rejected':status==='Query Raised'||status==='Query Responded'?'Query Raised':'Approved','Activated']; const index=status==='Query Responded'?2:stages.indexOf(status); return <div className="timeline">{stages.map((s,i)=><div className={i<=Math.max(index,0)?'done':''} key={s}><span>{i+1}</span><small>{s}</small></div>)}</div> }
function Choice({icon:Icon,title,text,options,action,onClick}) { return <article className="choice-card"><span><Icon size={34}/></span><h2>{title}</h2><p>{text}</p><small>{options}</small><button className="details-button" onClick={onClick}>{action}</button></article> }
function Metric({label,value}) { return <div><small>{label}</small><strong>{value}</strong></div> }
function SectionTitle({title,text}) { return <div className="section-heading"><h1>{title}</h1><p>{text}</p></div> }
function PanelTitle({icon:Icon,title}) { return <div className="panel-heading"><span className="panel-icon"><Icon/></span><h2>{title}</h2></div> }
function Empty({title,text}) { return <section className="empty-state"><Search/><h2>{title}</h2><p>{text}</p></section> }
function ErrorText({text}) { return <p className="error-banner" role="alert">{text}</p> }
function SuccessBlock({title,text,action,actionText}) { return <div className="success-block"><CheckCircle2 size={54}/><h2>{title}</h2><p>{text}</p><button className="details-button" onClick={action}>{actionText}</button></div> }
function Footer({navigate}) { return <footer className="footer"><div className="footer-grid"><div><h2>nProcure 2.0</h2><p>One Platform · Multiple Editions · Configurable · Secure · Transparent · Future Ready</p></div><div><h2>Quick Access</h2><button onClick={()=>navigate('tenders')}>Tender Search</button><button onClick={()=>navigate('track')}>Track Registration</button><button onClick={()=>navigate('adminLogin')}>Admin Demo</button></div><div className="footer-contact"><h2>Contact Us</h2><p>(n)Code Solutions, GNFC Infotower, Ahmedabad</p><p>Toll Free: 7359 021 663</p><BackupManager /></div></div><div className="footer-bottom"><span>© 2026 (n)Code Solutions. All rights reserved.</span><span>Frontend prototype · Browser-local persistent data</span></div></footer> }

export default App
