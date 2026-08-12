import { useEffect, useMemo, useState } from 'react'
import {
  Award,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Construction,
  Droplets,
  FileText,
  GraduationCap,
  Hospital,
  IndianRupee,
  Laptop,
  LineChart,
  Network,
  Package,
  Play,
  Route,
  Search,
  ShieldCheck,
  Sun,
  UploadCloud,
  Wrench,
  Zap,
} from 'lucide-react'
import './App.css'
import { benefits, categories, journeySteps, notices, stats, tenders } from './data'

const navItems = ['Home', 'Legal', 'Resources', 'Support', 'FAQS', 'About Us', 'Contact Us']

const iconMap = {
  Award,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Construction,
  Droplets,
  FileText,
  GraduationCap,
  Hospital,
  IndianRupee,
  Laptop,
  LineChart,
  Network,
  Package,
  Play,
  Route,
  Search,
  ShieldCheck,
  Sun,
  UploadCloud,
  Wrench,
  Zap,
}

const journeyIcons = [Search, FileText, ClipboardCheck, LineChart, UploadCloud, Award]
const benefitIcons = [ShieldCheck, Clock3, CheckCircle2, LineChart]

function App() {
  const [page, setPage] = useState(() => (window.location.pathname === '/tenders' ? 'tenders' : 'home'))
  const [query, setQuery] = useState('')

  const goTo = (target) => {
    setPage(target)
    window.history.pushState(null, '', target === 'tenders' ? '/tenders' : '/')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    goTo('tenders')
  }

  return (
    <div className="portal-shell">
      <Header goTo={goTo} />
      <Hero query={query} setQuery={setQuery} onSearch={handleSearch} />
      {page === 'home' ? <HomePage /> : <TenderSearchPage query={query} setQuery={setQuery} />}
      <Footer />
    </div>
  )
}

function Header({ goTo }) {
  return (
    <header className="site-header">
      <div className="utility-bar">
        <span className="toll-free">Toll Free : +91 7359021663</span>
        <div className="utility-actions">
          <button type="button">Login / Sign Up</button>
          <button type="button" className="charge-button">Pay Portal Charges</button>
        </div>
      </div>
      <nav className="navbar" aria-label="Primary navigation">
        <button type="button" className="brand" onClick={() => goTo('home')} aria-label="nProcure home">
          <span className="brand-mark">(n)</span>
          <span className="brand-word">
            <span className="brand-text">Procure</span>
          </span>
        </button>
        <div className="nav-links">
          {navItems.map((item) => (
            <button key={item} type="button" onClick={() => (item === 'Home' ? goTo('home') : null)}>
              {item}
            </button>
          ))}
        </div>
        <div className="gnfc-mark">GNFC</div>
      </nav>
    </header>
  )
}

function Hero({ query, setQuery, onSearch }) {
  return (
    <section className="hero-section">
      <div className="hero-bg" />
      <div className="hero-content">
        <h1>
          <span>(n)procure</span> Portal
        </h1>
        <p>All government tenders from Roads & Buildings, GWSSB, GUVNL, GIDC, GMC and 500+ Gujarat departments - in one trusted portal.</p>
        <form className="smart-search" onSubmit={onSearch}>
          <label className="sr-only" htmlFor="smart-search">
            Search tenders
          </label>
          <Search className="search-icon" size={28} aria-hidden="true" />
          <input
            id="smart-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tender, department, category, location, product or Tender ID..."
          />
          <button type="submit">Search</button>
          <button type="button" className="secondary-search">Advance Search</button>
        </form>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <main>
      <section className="stats-strip" aria-label="Portal statistics">
        {stats.map((stat) => {
          const StatIcon = iconMap[stat.icon]
          return (
            <article key={stat.label} className="stat-card">
              <span className={`mini-icon ${stat.tone}`}>{StatIcon ? <StatIcon size={22} /> : null}</span>
              <div>
                <AnimatedStat value={stat.value} />
                <span>{stat.label}</span>
              </div>
            </article>
          )
        })}
      </section>

      <section className="section process-section">
        <div className="section-heading">
          <h2>Complete e-Tender Process</h2>
          <p>Simple steps to discover opportunities, submit bids and win contracts online</p>
        </div>
        <div className="journey-grid">
          {journeySteps.map(([title, text], index) => {
            const StepIcon = journeyIcons[index]
            return (
              <article key={title} className="journey-card">
                <span className="journey-icon"><StepIcon size={34} /></span>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            )
          })}
        </div>
        <div className="benefit-grid">
          {benefits.map(([title, text], index) => {
            const BenefitIcon = benefitIcons[index]
            return (
              <article key={title} className="benefit-card">
                <span><BenefitIcon size={21} /></span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="updates-band">
        <div className="updates-grid">
          <NoticeBoard />
          <TrainingCard />
          <NewsCard />
        </div>
      </section>
    </main>
  )
}

function AnimatedStat({ value }) {
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    const match = value.match(/^([^0-9]*)([\d,.]+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return undefined
    }

    const [, prefix, numberPart, suffix] = match
    const target = Number(numberPart.replace(/,/g, ''))
    const decimals = numberPart.includes('.') ? numberPart.split('.')[1].length : 0
    const duration = 1250
    const startedAt = performance.now()
    let frameId

    const formatNumber = (number) => {
      if (decimals > 0) return number.toFixed(decimals)
      return Math.round(number).toLocaleString('en-IN')
    }

    const tick = (time) => {
      const progress = Math.min((time - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(`${prefix}${formatNumber(target * eased)}${suffix}`)
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [value])

  return <strong className="animated-number">{displayValue}</strong>
}

function NoticeBoard() {
  return (
    <article className="panel notice-panel">
      <PanelHeading icon={Bell} title="Notice Board" text="Stay updated with latest notices and tenders" action="View All" />
      <div className="tabs">
        {['All', 'Latest', 'Tenders', 'Corrigendum', 'Awards'].map((tab, index) => (
          <button key={tab} className={index === 0 ? 'active' : ''} type="button">
            {tab}
          </button>
        ))}
      </div>
      <div className="notice-list">
        {notices.map(([badge, title, dept, date]) => (
          <div className="notice-item" key={title}>
            <div>
              <span className="notice-badge">{badge}</span>
              <h3>{title}</h3>
              <p>{dept} | {date}</p>
            </div>
            <span className="pdf-chip">PDF</span>
          </div>
        ))}
      </div>
      <button type="button" className="panel-link">View All Notices -&gt;</button>
    </article>
  )
}

function TrainingCard() {
  return (
    <article className="panel training-panel">
      <PanelHeading icon={GraduationCap} title="Online Training" text="Enhance your skills with our live training sessions" />
      <div className="training-visual">
        <span className="play-button"><Play size={30} fill="currentColor" /></span>
      </div>
      <h3>Click to Join the Weekly Bidder Online Training</h3>
      <p>*Online Training sessions are held every Thursday from 15:30 to 16:30 Hrs IST</p>
      <button type="button" className="primary-wide">Join Training</button>
    </article>
  )
}

function NewsCard() {
  return (
    <article className="panel news-panel">
      <PanelHeading icon={CalendarDays} title="News & Events" text="Latest updates and upcoming events" action="View All" />
      <div className="news-image" />
      <span className="news-tag">News</span>
      <h3>Gujarat Launches New E-Procurement Portal with Advanced Features</h3>
      <p>The new portal aims to bring transparency, efficiency and ease of doing business for vendors and departments.</p>
      <button type="button" className="read-more">Read More -&gt;</button>
      <div className="event-row">
        <strong>20 APR</strong>
        <span>Webinar on E-Procurement Best Practices</span>
      </div>
      <div className="event-row green">
        <strong>25 APR</strong>
        <span>Training Session for Department Users</span>
      </div>
    </article>
  )
}

function PanelHeading({ icon: Icon, title, text, action }) {
  return (
    <div className="panel-heading">
      <span className="panel-icon"><Icon size={27} /></span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {action ? <button type="button">{action}</button> : null}
    </div>
  )
}

function TenderSearchPage({ query, setQuery }) {
  const filteredTenders = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return tenders
    return tenders.filter((tender) =>
      [tender.title, tender.org, tender.id, tender.category, tender.location].join(' ').toLowerCase().includes(term),
    )
  }, [query])

  return (
    <main className="search-page">
      <section className="category-row">
        <div className="category-heading">
          <h2>Browse by Category</h2>
          <button type="button">All 42 categories -&gt;</button>
        </div>
        <div className="category-grid">
          {categories.map(([name, count, icon]) => {
            const CategoryIcon = iconMap[icon]
            return (
              <button key={name} type="button" className="category-card">
                <span>{CategoryIcon ? <CategoryIcon size={25} /> : null}</span>
                <strong>{name}</strong>
                <small>{count}</small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="results-layout">
        <aside className="filters" aria-label="Tender filters">
          <FilterGroup title="Status" items={['Open / Active', 'Closing Today', 'Closing This Week', 'New (Last 24h)', 'Corrigendum', 'Re-Tender']} />
          <div className="filter-box">
            <h3>Tender Value</h3>
            <input type="range" min="0" max="100" defaultValue="38" aria-label="Tender value range" />
            <div className="range-labels"><span>Rs. 0</span><span>Rs. 1 Cr+</span></div>
          </div>
          <FilterGroup title="District" items={['Ahmedabad', 'Surat', 'Vadodara', 'Gandhinagar', 'Rajkot', 'Bhavnagar', 'Anand']} />
          <FilterGroup title="Department" items={['Roads & Buildings', 'GWSSB', 'GUVNL / GETCO', 'GIDC', 'Municipal Corps.', 'NHM Gujarat']} />
          <FilterGroup title="Tender Type" items={['Open Tender', 'Limited Tender', 'EOI', 'Rate Contract', 'e-Auction']} />
          <div className="alert-box">
            <strong>Daily Tender Alerts</strong>
            <p>Get matching tenders in your inbox every morning - free.</p>
            <input placeholder="your@company.com" />
            <button type="button">Set Free Alert</button>
          </div>
        </aside>

        <section className="results-column">
          <div className="result-toolbar">
            <p>
              Showing <strong>{filteredTenders.length.toLocaleString()} active tenders</strong>
              <span> Gujarat eTendering Portal</span>
            </p>
            <div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter current results" />
              <select aria-label="Sort tenders" defaultValue="closing">
                <option value="closing">Sort: Closing Soonest</option>
                <option value="value">Sort: Tender Value</option>
              </select>
            </div>
          </div>
          {filteredTenders.length ? (
            filteredTenders.map((tender, index) => <TenderCard key={tender.id} tender={tender} featured={index === 0} />)
          ) : (
            <div className="empty-state">
              <h2>No tenders found</h2>
              <p>Try searching by department, location, category or tender ID.</p>
            </div>
          )}
          <div className="pagination">
            {['<', '1', '2', '3', '4', '5', '...', '167', '>'].map((item) => (
              <button key={item} className={item === '1' ? 'active' : ''} type="button">{item}</button>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

function FilterGroup({ title, items }) {
  return (
    <div className="filter-box">
      <h3>{title}</h3>
      {items.map((item, index) => (
        <label key={item}>
          <input type="checkbox" defaultChecked={index === 0 || index === 1} />
          <span>{item}</span>
          <small>{(1680 + index * 247).toLocaleString()}</small>
        </label>
      ))}
    </div>
  )
}

function TenderCard({ tender, featured }) {
  return (
    <article className={`tender-card ${featured ? 'featured' : ''}`}>
      <div className="tender-head">
        <span className="org-chip">{tender.org.split(' ').map((word) => word[0]).slice(0, 4).join('')}</span>
        <div>
          <strong>{tender.org}</strong>
          <small>NIT No: {tender.id}</small>
        </div>
        <div className="tag-row">
          {tender.tags.map((tag) => <span key={tag}>{tag}</span>)}
          <span>{tender.category}</span>
          <span>{tender.location}</span>
        </div>
      </div>
      <h2>{tender.title}</h2>
      <p>{tender.summary}</p>
      <div className="tender-metrics">
        <Metric label="Tender Value" value={tender.value} />
        <Metric label="EMD" value={tender.emd} />
        <Metric label="Doc Fee" value={tender.fee} />
        <Metric label="Closing Date" value={tender.closing} />
        <Metric label="Type" value={tender.type} />
      </div>
      <div className="tender-actions">
        <span>{tender.docs} docs | {tender.location} | {tender.status}</span>
        <div>
          <button type="button" className="ghost-button">Watchlist</button>
          <button type="button" className="details-button">View Details -&gt;</button>
        </div>
      </div>
    </article>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h2>nProcure<br />Government e-Tender Platform</h2>
          <p>nProcure is Gujarat's official e-Procurement platform that enables seamless participation in government tenders. The portal provides access to live tenders, tender documents, bid submission and real-time updates.</p>
        </div>
        <div>
          <h2>Legal Information</h2>
          <a>Terms & Conditions</a>
          <a>Privacy Policy</a>
          <a>Copyright Policy</a>
          <a>Grievance/Feedback</a>
          <a>Hyperlinking Policy</a>
        </div>
        <div>
          <h2>Contact Us</h2>
          <p><strong>(n)Code Solutions - Division of GNFC Ltd.,</strong></p>
          <p>(n)Procure Cell<br />501, GNFC Infotower, S.G. Road<br />Bodakdev, Ahmedabad - 380054 (Gujarat)</p>
          <p>Toll Free : 7359 021 663 (9:30 AM to 8:00 PM)</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright 2025 (n)Code Solutions. All Rights Reserved | Powered By : (n)Code Solutions</span>
        <span>Website Visitors : <b>00298</b></span>
      </div>
    </footer>
  )
}

export default App
