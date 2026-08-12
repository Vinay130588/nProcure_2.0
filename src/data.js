export const stats = [
  { label: 'Active Tenders', value: '3,598', icon: 'FileText', tone: 'blue' },
  { label: 'Opening Today', value: '320', icon: 'CalendarDays', tone: 'green' },
  { label: 'Closing Today', value: '320', icon: 'Clock3', tone: 'yellow' },
  { label: 'Depts & Boards', value: '55+', icon: 'Network', tone: 'purple' },
  { label: 'Value Published', value: 'Rs. 4.8L Cr', icon: 'IndianRupee', tone: 'red' },
  { label: 'Vendors Registered', value: '2.4L+', icon: 'Building2', tone: 'cyan' },
]

export const journeySteps = [
  ['Discover Opportunities', 'Search tenders by department, category, product or location on the portal.'],
  ['Prepare Required Documents', 'Arrange company documents, certificates and digital signature.'],
  ['Track Evaluation Status', 'Monitor technical qualification and bid comparison updates.'],
  ['Analyze Tender Details', 'Check eligibility, BOQ, technical specs, fees and deadlines carefully.'],
  ['Submit Online Bid', 'Upload technical and financial bid in electronic format only.'],
  ['Win & Execute Contract', 'If selected, proceed with agreement and project execution.'],
]

export const benefits = [
  ['Transparent Process', 'Fair and open tendering for all'],
  ['Saves Time', '100% online process saves effort'],
  ['Secure & Reliable', 'Data security at every step'],
  ['Better Opportunities', 'Connect with more tenders'],
]

export const categories = [
  ['Civil Works', '4,218 tenders', 'Construction'],
  ['Water Supply', '2,107 tenders', 'Droplets'],
  ['Electrical', '1,876 tenders', 'Zap'],
  ['Solar / EPC', '987 tenders', 'Sun'],
  ['Healthcare', '1,243 tenders', 'Hospital'],
  ['Roads & NH', '3,102 tenders', 'Route'],
  ['IT & Software', '743 tenders', 'Laptop'],
  ['AMC / O&M', '2,654 tenders', 'Wrench'],
  ['Supply / Goods', '1,908 tenders', 'Package'],
]

export const tenders = [
  {
    id: 'GIDC/SEZ/ARC/2025-26/42029003',
    org: 'Gujarat Industrial Development Corporation, Surat SEZ',
    title:
      'Annual Rate Contract (ARC) for Operation, Maintenance & Repairing of 60W LED Street Light Fittings incl. Special Repairs @ GIDC SEZ Apparel Park, Sachin, Surat Industrial Estate',
    summary:
      'Comprehensive O&M contract for all LED street lights at GIDC SEZ Apparel Park, Sachin and Surat Industrial Estate.',
    category: 'AMC / Rate Contract',
    location: 'Surat, GJ',
    value: 'Rs. 9.50 Lacs',
    emd: 'Rs. 19,000',
    fee: 'Rs. 500',
    closing: 'Apr 22, 2026',
    type: 'Open / e-Tender',
    status: 'Open',
    tags: ['New', 'Closing in 2 days'],
    docs: 5,
  },
  {
    id: 'GIDC/VAPI/AMC/AC/2025-26/42028899',
    org: 'Gujarat Industrial Development Corporation, Vapi Estate',
    title:
      'Annual Maintenance Contract (AMC) for Window / Split / Cassette Type A/C Machines & Storage Type Water Coolers and RO Installed at Office Building & Guest House @ GIDC, Vapi',
    summary:
      'Preventive and breakdown maintenance, gas charging, spare parts and routine service for air conditioning units.',
    category: 'AMC / O&M Services',
    location: 'Vapi, GJ',
    value: 'Rs. 6.80 Lacs',
    emd: 'Rs. 13,600',
    fee: 'Rs. 500',
    closing: 'May 6, 2026',
    type: 'Open / e-Tender',
    status: 'Open',
    tags: ['Open'],
    docs: 4,
  },
  {
    id: 'GWSSB/GS/PIPELINE/2025/ISFP-0441',
    org: 'Gujarat Water Supply & Sewerage Board - Gir Somnath District',
    title:
      'Providing, Supplying, Lowering, Laying & Jointing of 110mm Dia PVC Pipeline for Ishvariya Village under 15th Finance Programme',
    summary:
      'Pipeline supply and laying with accessories, thrust blocks, valve chambers, excavation and hydraulic testing.',
    category: 'Water Supply - Pipe Line',
    location: 'Gir Somnath, GJ',
    value: 'Rs. 8.12 Lacs',
    emd: 'Rs. 16,240',
    fee: 'Rs. 500',
    closing: 'Apr 30, 2026',
    type: '15th Finance',
    status: 'Open',
    tags: ['New'],
    docs: 7,
  },
  {
    id: 'GUVNL/GETCO/GIS/220KV/2025/42105480',
    org: 'Gujarat Urja Vikas Nigam Ltd. - Transmission Circle',
    title:
      'Design, Engineering, Manufacturing, Supply, Erection, Testing & Commissioning of 220/66kV GIS Equipments & Materials on Turnkey Basis incl. Civil Works',
    summary:
      'EPC turnkey contract for GIS substation including civil, control and protection panels, cables and commissioning.',
    category: 'Electrical - GIS / EHV',
    location: 'Gujarat',
    value: 'Rs. 148.5 Cr',
    emd: 'Rs. 1.48 Cr',
    fee: 'Rs. 25,000',
    closing: 'Apr 25, 2026',
    type: 'EPC Turnkey',
    status: 'Corrigendum',
    tags: ['Corrigendum', 'Closing in 5 days'],
    docs: 14,
  },
  {
    id: 'BNP/SSSS/CIVIL/2025-26/0328',
    org: 'Borsad Nagar Palika - Anand District',
    title:
      'Construction Work for Different Types of Work from Swachh Saher Sundar Saher Yojana under Borsad Nagarpalika',
    summary:
      'Urban development works covering road improvement, footpath construction, public amenity works and storm water repairs.',
    category: 'Civil Works - Urban',
    location: 'Anand, GJ',
    value: 'Rs. 29.30 Lacs',
    emd: 'Rs. 58,600',
    fee: 'Rs. 500',
    closing: 'May 2, 2026',
    type: 'SSSS Yojana',
    status: 'Open',
    tags: ['Open'],
    docs: 6,
  },
]

export const notices = [
  ['Urgent', 'Request for expressions of interest for integrated master plan preparation and gap analysis', 'Urban Development Department', '12 Apr 2026'],
  ['New', 'Gujarat State Highway Project - Pre-Qualification of Contractors', 'Roads & Buildings Department', '10 Apr 2026'],
  ['Update', 'Empanelment of Contractors for Electrical Works 2026-27', 'Energy & Petrochemicals Department', '08 Apr 2026'],
  ['Latest', 'Tender for Supply of IT Hardware for Government Offices', 'General Administration Department', '05 Apr 2026'],
]
