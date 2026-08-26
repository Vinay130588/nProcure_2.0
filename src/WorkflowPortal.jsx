import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileCheck2,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  accountService,
  approvalService,
  authServiceV2,
  governmentRequestService,
  organizationAccessService,
  portalRepository,
  userRegistrationService,
} from "./portalStore";
import "./WorkflowPortal.css";

const OTP = "123456";
const legalStatusOptions = [
  "A: Offices belonging to Govt & under Govt administration",
  "B: Boards & Companies",
  "C: Municipalities & Nagarpalika",
  "D: Other than GoG Departments",
];
const districtsByState = {
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udepur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],
  Maharashtra: [
    "Mumbai City",
    "Mumbai Suburban",
    "Pune",
    "Nashik",
    "Nagpur",
    "Thane",
  ],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "South Delhi",
  ],
};
const systemOptions = {
  erp: [
    "SAP ECC",
    "SAP S/4HANA",
    "Oracle ERP",
    "Microsoft Dynamics",
    "Tally",
    "Custom ERP",
    "Other",
    "None",
  ],
  finance: [
    "SAP FI/CO",
    "Oracle Finance",
    "Tally",
    "Microsoft Dynamics Finance",
    "Custom Accounts Portal",
    "Other",
  ],
  procurement: [
    "SAP MM",
    "Oracle Procurement",
    "SAP Ariba",
    "Internal Procurement Portal",
    "Other",
    "None",
  ],
  vendor: [
    "SAP Ariba",
    "Internal Vendor Portal",
    "Custom Vendor Portal",
    "Other",
    "None",
  ],
  hr: [
    "SAP HCM",
    "SuccessFactors",
    "Oracle HCM",
    "Workday",
    "Custom HRMS",
    "Other",
  ],
  identity: [
    "Microsoft Entra ID",
    "Active Directory / LDAP",
    "ADFS",
    "Okta",
    "Google Workspace",
    "Custom SSO",
    "Other",
  ],
  government: [
    "GeM",
    "IFMS",
    "GRAS",
    "PFMS",
    "Treasury",
    "GST",
    "MSME / Udyam",
    "Internal Department Portal",
    "Other",
  ],
};
const integrationPurposeOptions = [
  "Organization / Business Unit Master",
  "User / Employee Master",
  "Vendor Master",
  "Material / Item Master",
  "Service Master",
  "Cost Centre",
  "GL Account",
  "Budget",
  "Purchase Requisition / Indent",
  "Tender / RFQ",
  "Award",
  "Purchase Order",
  "Contract",
  "GRN",
  "Service Entry",
  "Invoice",
  "Payment Status",
  "Vendor Performance",
  "User Authentication / SSO",
  "Other",
];
const integrationMethodOptions = [
  "REST API",
  "SOAP",
  "SFTP",
  "File",
  "Middleware",
  "Database Interface",
  "Other",
];
const middlewareOptions = [
  "SAP CPI",
  "SAP PI/PO",
  "MuleSoft",
  "Boomi",
  "Azure Integration Services",
  "Custom Middleware",
  "Other",
  "None",
];
const authenticationMethods = [
  "PKI / DSC – Signing",
  "PKI / DSC – Encryption",
  "PKI / DSC – Signing + Encryption",
  "Mobile OTP",
  "Email OTP",
  "OTP + DSC",
  "e-Sign",
  "OTP + e-Sign",
  "DSC + e-Sign",
  "Corporate SSO / MFA",
  "Other",
];
const processStageMaster = {
  TMS: [
    "Tender Creation",
    "Tender Submission",
    "Tender Approval",
    "Tender Publishing",
    "Tender Opening",
    "Technical Evaluation",
    "Financial Evaluation",
    "Award Approval",
    "Contract Signing",
    "Other",
  ],
  AUC: [
    "Auction Creation",
    "Auction Publishing",
    "Auction Opening",
    "Auction Closure",
    "Result Approval",
    "Other",
  ],
  IMS: [
    "Indent Creation",
    "Indent Submission",
    "Indent Approval",
    "Budget Confirmation",
    "Other",
  ],
  VMS: [
    "Vendor Registration Approval",
    "Vendor Suspension",
    "Vendor Re-activation",
    "Vendor Performance Approval",
    "Other",
  ],
  "Contract Management": [
    "Contract Creation",
    "Contract Approval",
    "Contract Signing",
    "Amendment Approval",
    "Other",
  ],
  "Purchase / PO Management": [
    "PO Creation",
    "PO Approval",
    "PO Publishing",
    "Other",
  ],
  "Invoice / Payment Management": [
    "Invoice Approval",
    "Payment Approval",
    "Payment Release",
    "Other",
  ],
  "Analytics & Reports": ["Sensitive Report Export", "Other"],
};
const clientTypeConfig = {
  Government: {
    steps: [
      "Organization",
      "Department",
      "Sub-Department",
      "Office / Division / Circle",
      "Authorized User",
      "Procurement Modules",
      "Advanced Procurement Configuration",
      "Government Systems & Integration",
      "Authentication",
      "Documents",
      "Review & Submit",
    ],
    hierarchy: ["Department", "Sub-Department", "Office / Division / Circle"],
    organizationExtra: ["Organization Type", "Parent Organization"],
    unitFields: {
      departments: [
        "Department Name",
        "Department Code",
        "Department Short Name",
        "Department Type",
        "Department Address",
        "Department Email",
        "Department Contact Number",
        "Head of Department Name",
        "Head of Department Designation",
      ],
      subDepartments: [
        "Sub-Department Name",
        "Sub-Department Code",
        "Parent Department",
        "Sub-Department Email",
        "Sub-Department Contact",
      ],
      offices: [
        "Office Type",
        "Office / Division / Circle Name",
        "Parent Department",
        "Parent Sub-Department",
        "Office Code",
        "Full Office Address",
        "State",
        "District",
        "City / Taluka",
        "PIN Code",
        "Contact Number",
        "Office Email",
        "Accounts Department Email",
        "TAN",
        "GSTIN",
      ],
    },
    systems: [
      "Existing Government System",
      "Department Internal Portal",
      "Systems to Integrate",
      "Integration Purpose",
      "Integration Direction",
      "Integration Method",
      "Integration Frequency",
      "Budget Integration Required",
      "Payment Status Integration",
      "Technical Contact Name",
      "Technical Contact Email",
      "Integration Remarks",
    ],
    auth: [
      "DSC Available",
      "DSC Required for Login",
      "DSC Required For",
      "Register DSC",
      "DSC Holder Name",
      "Certificate Issuer",
      "Certificate Serial Number",
      "Issue Date",
      "Expiry Date",
      "MFA Requirement",
    ],
    documents: [
      "Department Authorization Letter",
      "Government Order / Department Proof",
      "Authorized Officer Proof",
      "Approval Matrix / Organization Structure",
      "Procurement Rules / Manual",
      "Integration Document",
      "Other Supporting Document",
    ],
  },
  PSU: {
    steps: [
      "Organization",
      "Department / Function",
      "Business Unit / Plant / Location",
      "Statutory Details",
      "Authorized User",
      "Procurement Modules",
      "Advanced Procurement Configuration",
      "ERP / Business Systems",
      "Integration",
      "Authentication & Documents",
      "Review & Submit",
    ],
    hierarchy: [
      "Department / Function",
      "Business Unit / Division",
      "Plant / Unit / Regional Office",
    ],
    organizationExtra: [
      "PSU Type",
      "Parent Ministry / Department",
      "CIN / Registration Number",
      "Date of Incorporation",
    ],
    unitFields: {
      departments: [
        "Department / Function Name",
        "Department Code",
        "Parent Function",
      ],
      businessUnits: [
        "Business Unit / Division",
        "Business Unit Code",
        "Plant / Unit Applicable",
        "Plant / Unit / Regional Office",
        "Plant / Unit Code",
      ],
      offices: [
        "Location Type",
        "Location Name",
        "Parent Business Unit",
        "Full Address",
        "State",
        "District",
        "City",
        "PIN Code",
        "Contact Number",
        "Email",
        "Accounts Email",
        "GSTIN",
        "TAN",
      ],
    },
    systems: [
      "Existing ERP",
      "ERP Version",
      "Finance / Accounts System",
      "Procurement System",
      "Vendor Portal",
      "HRMS",
      "Identity Provider",
      "GeM Applicable",
      "Other Government System",
    ],
    integration: [
      "Integration Required",
      "Systems to Integrate",
      "Master Data Integration",
      "Transaction Integration",
      "Integration Direction",
      "API / Interface Available",
      "Middleware",
      "Frequency",
      "Budget Integration",
      "Payment Integration",
      "Technical Contact",
      "Technical Contact Email",
      "Remarks",
    ],
    auth: [
      "DSC Available",
      "DSC Requirement",
      "Corporate SSO Required",
      "SSO Provider",
      "MFA Required",
    ],
    documents: [
      "Authorization Letter",
      "Incorporation / Registration Certificate",
      "PAN / GST Documents",
      "Purchase Manual",
      "Delegation of Authority / Approval Matrix",
      "Integration Document",
      "Organization Structure",
      "Other Supporting Documents",
    ],
  },
  Enterprise: {
    steps: [
      "Corporate Details",
      "Business Unit / Division",
      "Plant / Branch / Location",
      "Statutory Details",
      "Authorized User",
      "Procurement Modules",
      "Advanced Procurement Configuration",
      "Enterprise Systems",
      "Integration",
      "Authentication",
      "Documents",
      "Review & Submit",
    ],
    hierarchy: [
      "Business Unit",
      "Division / Function",
      "Plant / Branch / Location",
    ],
    organizationExtra: [
      "Company Type",
      "Parent / Group Company",
      "CIN / LLPIN / Registration Number",
      "Date of Incorporation",
    ],
    unitFields: {
      businessUnits: [
        "Business Unit Name",
        "Business Unit Code",
        "Division / Function",
        "Division Code",
        "Plant / Branch Applicable",
        "Plant / Branch / Location",
        "Plant Code",
        "Parent Business Unit",
        "Cost Centre",
      ],
      offices: [
        "Location Type",
        "Location Name",
        "Address",
        "Country",
        "State",
        "District",
        "City",
        "PIN Code",
        "Contact Number",
        "Location Email",
        "GSTIN",
      ],
    },
    systems: [
      "ERP System",
      "ERP Version",
      "Procurement Module",
      "Finance / Accounts",
      "HRMS",
      "Vendor Portal",
      "Contract System",
      "Identity Provider",
      "BI / Analytics Tool",
      "Other System",
    ],
    integration: [
      "Integration Required",
      "Systems to Integrate",
      "Vendor Master Integration",
      "Material / Service Master",
      "Cost Centre / GL Integration",
      "Budget Integration",
      "Purchase Requisition Integration",
      "PO Integration",
      "GRN / Service Entry Integration",
      "Invoice Integration",
      "Payment Status Integration",
      "Integration Direction",
      "Integration Method",
      "Middleware",
      "Frequency",
      "Technical Contact Name",
      "Technical Contact Email",
      "Integration Remarks",
    ],
    auth: [
      "Corporate SSO Available",
      "SSO Provider",
      "Corporate Domain",
      "MFA Required",
      "Preferred MFA Method",
      "DSC Required",
      "DSC Requirement",
      "Security Remarks",
    ],
    documents: [
      "Authorization Letter",
      "Incorporation Certificate",
      "PAN Certificate",
      "GST Certificate",
      "Authorized Person Proof",
      "Procurement Policy",
      "Delegation of Authority Matrix",
      "Organization Structure",
      "ERP / API Integration Document",
      "Information Security Policy",
      "Other Supporting Documents",
    ],
  },
};
const modules = [
  "e-Tender",
  "e-Auction",
  "Indent / Requisition",
  "Vendor Management",
  "Purchase / PO Management",
  "Contract Management",
  "Invoice / Payment Management",
  "Analytics & Reports",
  "AUC - Auction",
  "IMS",
  "VMS",
  "TMS - Tender Management System",
];
const clientSteps = [
  "Organization",
  "Statutory",
  "Office / Units",
  "Authorized User",
  "Modules",
  "Systems & Integration",
  "Authentication",
  "Documents",
  "Review",
];
const bidderSteps = [
  "Authorized Person",
  "Company",
  "Address",
  "KYC",
  "Bank",
  "Financial",
  "Category",
  "Experience",
  "DSC",
  "Documents",
  "Review",
  "Package",
  "Payment",
];
const emptyRegistration = {
  userType: "CLIENT",
  clientType: "PSU",
  organizationName: "",
  firstName: "",
  middleName: "",
  lastName: "",
  designation: "",
  mobile: "",
  email: "",
  userId: "",
  password: "",
  confirmPassword: "",
  mobileOtp: "",
  emailOtp: "",
  captcha: "",
  terms: false,
};
const setField = (setter, name, value) =>
  setter((old) => ({ ...old, [name]: value }));
const maskMobile = (mobile = "") =>
  `${"*".repeat(Math.max(0, mobile.length - 4))}${mobile.slice(-4)}`;
const fileMeta = (file) =>
  file
    ? {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: "Uploaded",
        previewUrl: typeof URL !== "undefined" ? URL.createObjectURL(file) : "",
      }
    : null;

export function StatefulRegistration({ navigate }) {
  const [flow, setFlow] = useState("GOG");
  return flow === "GOG" ? (
    <GovernmentClientRegistration navigate={navigate} openOther={() => setFlow("OTHER")} />
  ) : (
    <LegacyRegistration navigate={navigate} openGovernment={() => setFlow("GOG")} />
  );
}

const blankOffice = { type: "Office", otherType: "", name: "", address: "", pinCode: "", state: "Gujarat", district: "", city: "", mobile: "", email: "", accountsEmail: "", tanApplicable: "No", tan: "", gstApplicable: "No", gst: "" };
const blankDesignation = { name: "" };
const blankProposedUser = { officeId: "", officerName: "", designationId: "", email: "", mobile: "", rights: "Creating", nextApprover: "Self", remarks: "" };
const pinDirectory = {
  "380001": { state: "Gujarat", district: "Ahmedabad", city: "Ahmedabad" },
  "382010": { state: "Gujarat", district: "Gandhinagar", city: "Gandhinagar" },
  "390001": { state: "Gujarat", district: "Vadodara", city: "Vadodara" },
  "395003": { state: "Gujarat", district: "Surat", city: "Surat" },
  "360001": { state: "Gujarat", district: "Rajkot", city: "Rajkot" },
  "361001": { state: "Gujarat", district: "Jamnagar", city: "Jamnagar" },
};

function GovernmentClientRegistration({ navigate, openOther }) {
  const [requestor, setRequestor] = useState({ name: "", designation: "", email: "", mobile: "" });
  const [department, setDepartment] = useState({ departmentName: "", departmentSite: "", email: "", logo: null });
  const [offices, setOffices] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [proposedUsers, setProposedUsers] = useState([]);
  const [officeEditor, setOfficeEditor] = useState(null);
  const [designationEditor, setDesignationEditor] = useState(null);
  const [userEditor, setUserEditor] = useState(null);
  const [queryReplyMode, setQueryReplyMode] = useState(false);
  const [declaration, setDeclaration] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const update = (setter, key, value) => setter((old) => ({ ...old, [key]: value }));
  const openOffice = (index = -1) => setOfficeEditor({ index, value: index < 0 ? { ...blankOffice, id: `OFF-${Date.now()}` } : { ...offices[index] } });
  const saveOffice = (event) => {
    event.preventDefault();
    const value = officeEditor.value;
    if (!value.name.trim() || !value.address.trim() || (value.type === "Other" && !value.otherType.trim()) || !/^\d{6}$/.test(value.pinCode) || !value.district || !/^\d{10}$/.test(value.mobile) || !/^\S+@\S+\.\S+$/.test(value.email) || !/^\S+@\S+\.\S+$/.test(value.accountsEmail)) return setError("Complete all mandatory office fields, including the custom Office Type where applicable.");
    if (value.tanApplicable === "Yes" && !value.tan.trim()) return setError("Enter TAN number or select TAN Not Applicable.");
    if (value.gstApplicable === "Yes" && !value.gst.trim()) return setError("Enter GSTIN or select GST Not Applicable.");
    setOffices((old) => officeEditor.index < 0 ? [...old, value] : old.map((item, index) => index === officeEditor.index ? value : item));
    setError(""); setOfficeEditor(null);
  };
  const saveUser = (event) => {
    event.preventDefault();
    const value = userEditor.value;
    if (!value.officeId || !value.officerName.trim() || !value.designationId || !/^\S+@\S+\.\S+$/.test(value.email)) return setError("Complete all mandatory proposed-user fields with a valid official email.");
    setProposedUsers((old) => userEditor.index < 0 ? [...old, { ...value, id: `PUSR-${Date.now()}` }] : old.map((item, index) => index === userEditor.index ? value : item));
    setError(""); setUserEditor(null);
  };
  const saveDesignation = (event) => {
    event.preventDefault();
    const name = designationEditor.value.name.trim();
    if (!name) return setError("Enter a designation name.");
    if (designations.some((item, index) => index !== designationEditor.index && item.name.toLowerCase() === name.toLowerCase())) return setError("This designation is already added.");
    const value = { ...designationEditor.value, name, id: designationEditor.value.id || `DES-${Date.now()}` };
    setDesignations((old) => designationEditor.index < 0 ? [...old, value] : old.map((item, index) => index === designationEditor.index ? value : item));
    setError(""); setDesignationEditor(null);
  };
  const removeOffice = (index) => {
    const office = offices[index];
    if (proposedUsers.some((user) => user.officeId === office.id)) return setError("This office is assigned to a proposed user. Reassign or remove that user first.");
    if (window.confirm("Delete this office entry?")) setOffices((old) => old.filter((_, itemIndex) => itemIndex !== index));
  };
  const submit = (event) => {
    event.preventDefault(); setError("");
    if (!requestor.name.trim() || !requestor.designation.trim() || !/^\S+@\S+\.\S+$/.test(requestor.email) || !/^\d{10}$/.test(requestor.mobile)) return setError("Complete authorized requestor details with valid email and mobile number.");
    if (!department.departmentName.trim() || !/^\S+@\S+\.\S+$/.test(department.email)) return setError("Complete Department Name and Official Email.");
    if (!offices.length) return setError("Add at least one Office, Division or Circle.");
    if (!designations.length) return setError("Add at least one organization designation.");
    if (!proposedUsers.length) return setError("Add at least one proposed user.");
    if (!declaration) return setError("Accept the authorization declaration before submitting.");
    setSubmitted(governmentRequestService.submit({ requestor, department, offices, designations, proposedUsers, declarationAccepted: true }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (queryReplyMode) return <GoGQueryReply back={() => setQueryReplyMode(false)}/>;
  if (submitted) return <main className="flow-page"><section className="flow-success"><CheckCircle2/><span className="wf-status success">REQUEST SUBMITTED</span><h1>Client account request submitted</h1><p>Your GoG client account has not been created yet. The nProcure Admin team will review this request.</p><div className="request-number"><small>Client Request Number</small><strong>{submitted.requestNumber}</strong></div><p>A submission confirmation notification has been recorded for <strong>{submitted.applicantEmail}</strong>.</p><button className="wf-primary" onClick={() => navigate("home")}>Return to Home</button></section></main>;
  return <main className="flow-page government-request-page">
    <div className="flow-heading"><span>Government of Gujarat</span><h1>Client Account Creation Request</h1><p>Submit organization and proposed-user details for nProcure Admin review. No account or login credentials are created at this stage.</p></div>
    <div className="registration-switch"><strong>GoG Client Request</strong><div><button type="button" className="wf-secondary" onClick={() => setQueryReplyMode(true)}>Query Reply</button><button type="button" className="wf-secondary" onClick={openOther}>PSU, Enterprise or Bidder Registration</button></div></div>
    <form onSubmit={submit}>
      <section className="flow-card compact-section"><div className="section-title-row"><div><span>01</span><h2>Authorized Requestor</h2></div></div><div className="wf-grid"><WFInput label="Authorized Person Name" value={requestor.name} onChange={(v) => update(setRequestor, "name", v)} required/><WFInput label="Designation" value={requestor.designation} onChange={(v) => update(setRequestor, "designation", v)} required/><WFInput label="Official Email" type="email" value={requestor.email} onChange={(v) => update(setRequestor, "email", v)} required/><WFInput label="Mobile Number" value={requestor.mobile} onChange={(v) => update(setRequestor, "mobile", v.replace(/\D/g, "").slice(0, 10))} required/></div></section>
      <section className="flow-card compact-section"><div className="section-title-row"><div><span>02</span><h2>Department Details</h2></div></div><div className="wf-grid"><WFInput label="Department Name" value={department.departmentName} onChange={(v) => update(setDepartment, "departmentName", v)} required/><WFInput label="Official Website URL" value={department.departmentSite} onChange={(v) => update(setDepartment, "departmentSite", v)}/><WFInput label="Department Official Email" type="email" value={department.email} onChange={(v) => update(setDepartment, "email", v)} required/><label className="wf-field"><span>Department Logo</span><input type="file" accept="image/*" onChange={(e) => update(setDepartment, "logo", fileMeta(e.target.files?.[0]))}/><small>{department.logo?.name || "Optional · file metadata will be saved"}</small></label></div></section>
      <CollectionSection number="03" title="Offices / Divisions / Circles" action="Add Office" onAdd={() => openOffice()}><DataTable headers={["Type", "Name", "District / City", "PIN Code", "Email", "Actions"]} empty="No office entries added yet.">{offices.map((office, index) => <tr key={office.id}><td>{office.type === "Other" ? office.otherType : office.type}</td><td><strong>{office.name}</strong></td><td>{office.district}<small>{office.city}</small></td><td>{office.pinCode}</td><td>{office.email}</td><td className="table-actions"><button type="button" aria-label="Edit office" onClick={() => openOffice(index)}><Pencil/></button><button type="button" aria-label="Delete office" onClick={() => removeOffice(index)}><Trash2/></button></td></tr>)}</DataTable></CollectionSection>
      <CollectionSection number="04" title="Organization Designation Hierarchy" action="Add Designation" onAdd={() => setDesignationEditor({ index: -1, value: { ...blankDesignation } })}><DataTable headers={["Order", "Designation", "Actions"]} empty="Add designations before adding proposed users.">{designations.map((designation, index) => <tr key={designation.id}><td>{index + 1}</td><td><strong>{designation.name}</strong></td><td className="table-actions"><button type="button" aria-label="Edit designation" onClick={() => setDesignationEditor({ index, value: { ...designation } })}><Pencil/></button><button type="button" aria-label="Delete designation" onClick={() => { if (proposedUsers.some((user) => user.designationId === designation.id || user.nextApprover === designation.id)) return setError("This designation is being used by a proposed user."); setDesignations((old) => old.filter((_, itemIndex) => itemIndex !== index)); }}><Trash2/></button></td></tr>)}</DataTable></CollectionSection>
      <CollectionSection number="05" title="Proposed Users" action="Add Proposed User" onAdd={() => designations.length ? setUserEditor({ index: -1, value: { ...blankProposedUser } }) : setError("Add organization designations before adding proposed users.")}><DataTable headers={["Officer", "Office / Division", "Designation", "Official Email", "Rights", "Next Approver", "Actions"]} empty="No proposed users added yet.">{proposedUsers.map((user, index) => <tr key={user.id}><td><strong>{user.officerName}</strong></td><td>{offices.find((office) => office.id === user.officeId)?.name}</td><td>{designations.find((item) => item.id === user.designationId)?.name}</td><td>{user.email}</td><td>{user.rights}</td><td>{user.nextApprover === "Self" ? "Self" : designations.find((item) => item.id === user.nextApprover)?.name}</td><td className="table-actions"><button type="button" aria-label="Edit proposed user" onClick={() => setUserEditor({ index, value: { ...user } })}><Pencil/></button><button type="button" aria-label="Delete proposed user" onClick={() => setProposedUsers((old) => old.filter((_, itemIndex) => itemIndex !== index))}><Trash2/></button></td></tr>)}</DataTable></CollectionSection>
      <section className="flow-card compact-section"><div className="section-title-row"><div><span>06</span><h2>Declaration & Submission</h2></div></div><div className="submission-summary"><span>{offices.length}<small>Office entries</small></span><span>{proposedUsers.length}<small>Proposed users</small></span><span>No credentials<small>Created before approval</small></span></div><label className="wf-check"><input type="checkbox" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)}/> I confirm that I am authorized to submit this Client Account Creation Request and that the supplied information is correct.</label>{error && <p className="wf-error">{error}</p>}<div className="submit-request-row"><p>After submission, a unique Client Request Number will be generated and confirmation will be recorded for the requestor email.</p><button className="wf-primary">Submit Client Account Request</button></div></section>
    </form>
    {officeEditor && <EditorModal title={officeEditor.index < 0 ? "Add Office / Division / Circle" : "Edit Office / Division / Circle"} close={() => { setOfficeEditor(null); setError(""); }} submit={saveOffice} action={officeEditor.index < 0 ? "Add Office" : "Save Changes"} error={error}><OfficeEditor value={officeEditor.value} setValue={(value) => setOfficeEditor((old) => ({ ...old, value }))}/></EditorModal>}
    {designationEditor && <EditorModal title={designationEditor.index < 0 ? "Add Organization Designation" : "Edit Organization Designation"} close={() => { setDesignationEditor(null); setError(""); }} submit={saveDesignation} action={designationEditor.index < 0 ? "Add Designation" : "Save Changes"} error={error}><WFInput label="Designation / Post Name" value={designationEditor.value.name} onChange={(name) => setDesignationEditor((old) => ({ ...old, value: { ...old.value, name } }))} required/></EditorModal>}
    {userEditor && <EditorModal title={userEditor.index < 0 ? "Add Proposed User" : "Edit Proposed User"} close={() => { setUserEditor(null); setError(""); }} submit={saveUser} action={userEditor.index < 0 ? "Add User" : "Save Changes"} error={error}><UserEditor value={userEditor.value} setValue={(value) => setUserEditor((old) => ({ ...old, value }))} offices={offices} designations={designations}/></EditorModal>}
  </main>;
}

function CollectionSection({ number, title, action, onAdd, children }) { return <section className="flow-card compact-section"><div className="section-title-row"><div><span>{number}</span><h2>{title}</h2></div><button type="button" className="wf-primary" onClick={onAdd}><Plus/> {action}</button></div>{children}</section>; }
function DataTable({ headers, empty, children }) { const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children); return <div className="request-table-wrap"><table className="request-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{hasRows ? children : <tr><td colSpan={headers.length} className="empty-table">{empty}</td></tr>}</tbody></table></div>; }
function EditorModal({ title, close, submit, action, error, children }) { return <div className="editor-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && close()}><section className="editor-modal" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button type="button" onClick={close} aria-label="Close"><X/></button></header><form onSubmit={submit}><div className="editor-body">{children}{error && <p className="wf-error">{error}</p>}</div><footer><button type="button" className="wf-secondary" onClick={close}>Cancel</button><button className="wf-primary">{action}</button></footer></form></section></div>; }
function OfficeEditor({ value, setValue }) { const set = (key, next) => setValue({ ...value, [key]: next }); const setPin = (pinCode) => { const digits = pinCode.replace(/\D/g, "").slice(0, 6); const found = pinDirectory[digits]; const location = found || (digits.length === 6 && /^(36|37|38|39)/.test(digits) ? { state: "Gujarat" } : {}); setValue({ ...value, pinCode: digits, ...location }); }; return <div className="wf-grid"><WFSelect label="Office Type" value={value.type} onChange={(v) => setValue({ ...value, type: v, otherType: v === "Other" ? value.otherType : "" })} options={["Head Office", "Office", "Division", "Circle", "Other"]}/>{value.type === "Other" && <WFInput label="Specify Other Office Type" value={value.otherType} onChange={(v) => set("otherType", v)} required/>}<WFInput label="Office / Division / Circle Name" value={value.name} onChange={(v) => set("name", v)} required/><label className="wf-field editor-full"><span>Full Office Address *</span><textarea value={value.address} onChange={(e) => set("address", e.target.value)}/></label><WFInput label="PIN Code" value={value.pinCode} onChange={setPin} hint={value.pinCode.length === 6 && !pinDirectory[value.pinCode] ? "State identified; select district manually" : pinDirectory[value.pinCode] ? "Location identified from PIN code" : "Enter a 6-digit PIN"} required/><WFInput label="State" value={value.state} readOnly/><WFSelect label="District" value={value.district} onChange={(v) => set("district", v)} options={["", ...districtsByState.Gujarat]}/><WFInput label="City / Taluka" value={value.city} onChange={(v) => set("city", v)} required/><WFInput label="Mobile Number" value={value.mobile} onChange={(v) => set("mobile", v.replace(/\D/g, "").slice(0, 10))} required/><WFInput label="Office Email" type="email" value={value.email} onChange={(v) => set("email", v)} required/><WFInput label="Accounts Department Email" type="email" value={value.accountsEmail} onChange={(v) => set("accountsEmail", v)} required/><WFSelect label="TAN Applicable?" value={value.tanApplicable} onChange={(v) => set("tanApplicable", v)} options={["No", "Yes"]}/>{value.tanApplicable === "Yes" && <WFInput label="TAN Number" value={value.tan} onChange={(v) => set("tan", v.toUpperCase())} required/>}<WFSelect label="GST Registration Applicable?" value={value.gstApplicable} onChange={(v) => set("gstApplicable", v)} options={["No", "Yes"]}/>{value.gstApplicable === "Yes" && <WFInput label="GSTIN" value={value.gst} onChange={(v) => set("gst", v.toUpperCase())} required/>}</div>; }
function UserEditor({ value, setValue, offices, designations }) { const set = (key, next) => setValue({ ...value, [key]: next }); const designationLabels = Object.fromEntries(designations.map((item) => [item.id, item.name])); return <div className="wf-grid"><WFSelect label="Office / Division" value={value.officeId} onChange={(v) => set("officeId", v)} options={offices.map((office) => office.id)} optionLabels={Object.fromEntries(offices.map((office) => [office.id, office.name]))}/><WFInput label="Officer Name" value={value.officerName} onChange={(v) => set("officerName", v)} required/><WFSelect label="Designation" value={value.designationId} onChange={(v) => set("designationId", v)} options={designations.map((item) => item.id)} optionLabels={designationLabels}/><WFInput label="Official Email" type="email" value={value.email} onChange={(v) => set("email", v)} required/><WFInput label="Mobile Number" value={value.mobile} onChange={(v) => set("mobile", v.replace(/\D/g, "").slice(0, 10))}/><WFSelect label="Rights" value={value.rights} onChange={(v) => set("rights", v)} options={["Creating", "Publishing/Approving", "Only Opening"]}/><WFSelect label="Next Approver" value={value.nextApprover} onChange={(v) => set("nextApprover", v)} options={["Self", ...designations.map((item) => item.id)]} optionLabels={{ Self: "Self", ...designationLabels }}/><label className="wf-field editor-full"><span>Remarks</span><textarea value={value.remarks} onChange={(e) => set("remarks", e.target.value)}/></label></div>; }

function GoGQueryReply({ back }) {
  const [requestNumber,setRequestNumber]=useState(""),[request,setRequest]=useState(null),[query,setQuery]=useState(null),[reply,setReply]=useState(""),[supporting,setSupporting]=useState([]),[additional,setAdditional]=useState([]),[error,setError]=useState(""),[success,setSuccess]=useState("");
  const searchRequest=(event)=>{event.preventDefault();setError("");setSuccess("");const found=governmentRequestService.find(requestNumber);const open=found?.queryHistory?.find((item)=>item.status==="OPEN");if(!found)return setError("Valid GoG Request Number was not found.");if(!open)return setError("This request has no pending clarification query.");setRequest(found);setQuery(open);};
  const files=(fileList)=>Array.from(fileList||[]).filter((file)=>file.size<=5*1024*1024&&["application/pdf","image/jpeg","image/png"].includes(file.type)).map(fileMeta);
  const submit=()=>{setError("");const result=governmentRequestService.replyToQuery(request.requestNumber,{reply,supportingDocuments:supporting,additionalDocuments:additional});if(result.error)return setError(result.error);setSuccess(`Reply submitted for ${query.queryNumber}.`);setRequest(null);setQuery(null);setReply("");};
  return <main className="flow-page gog-query-reply"><button className="wf-secondary" onClick={back}><ChevronLeft/> Back to GoG Request</button><div className="flow-heading"><span>GoG Client Account Request</span><h1>Query Reply</h1><p>Enter the GoG Request Number to view and reply to a pending clarification.</p></div><form className="flow-card gog-query-search" onSubmit={searchRequest}><WFInput label="GoG Request Number" value={requestNumber} onChange={setRequestNumber} required/><button className="wf-primary"><Search/> Search Request</button></form>{error&&<p className="wf-error">{error}</p>}{success&&<section className="flow-success"><CheckCircle2/><h2>Clarification reply submitted</h2><p>{success}</p></section>}{request&&query&&<section className="flow-card gog-query-reply-card"><div className="gog-admin-summary"><div><small>Request Number</small><strong>{request.requestNumber}</strong></div><div><small>Organization</small><strong>{request.organizationName}</strong></div><div><small>Request Status</small><strong>{request.status.replaceAll("_"," ")}</strong></div><div><small>Query Reference</small><strong>{query.queryNumber}</strong></div></div><GoGSection title="Pending Query"><p><strong>{query.subject}</strong> · {query.category}</p><p>{query.details}</p><small>{new Date(query.createdAt).toLocaleString()}</small></GoGSection><label className="wf-field"><span>Reply Details *</span><textarea value={reply} onChange={(event)=>setReply(event.target.value)}/></label><div className="wf-grid"><label className="upload-v2">Supporting Documents<input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(event)=>setSupporting(files(event.target.files))}/><span>{supporting.length} file(s)</span></label><label className="upload-v2">Additional Documents<input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(event)=>setAdditional(files(event.target.files))}/><span>{additional.length} file(s)</span></label></div><p className="wf-note">PDF/JPG/PNG only, maximum 5 MB per file. Prototype stores file metadata only.</p><button className="wf-primary" disabled={!reply.trim()} onClick={submit}>Submit Reply</button></section>}</main>;
}

function LegacyRegistration({ navigate, openGovernment }) {
  const [form, setForm] = useState(emptyRegistration),
    [mobileSent, setMobileSent] = useState(false),
    [emailSent, setEmailSent] = useState(false),
    [mobileOk, setMobileOk] = useState(false),
    [emailOk, setEmailOk] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!mobileOk || !emailOk)
      return setError("Verify both mobile and email OTP before registering.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    if (form.captcha.trim().toUpperCase() !== "NPR20")
      return setError("Captcha is incorrect. Enter NPR20.");
    if (!form.terms) return setError("Accept the Terms & Conditions.");
    const result = userRegistrationService.register(form);
    if (result.error) return setError(result.error);
    setMessage(
      `Registration completed successfully. Your User ID ${form.userId} has been created. Please login to nProcure 2.0 using your credentials to complete the Account Creation process.`,
    );
  };
  if (message)
    return (
      <main className="flow-page">
        <section className="flow-success">
          <CheckCircle2 />
          <h1>Registration completed</h1>
          <p>{message}</p>
          <button
            className="wf-primary"
            onClick={() =>
              navigate(`/login?user=${encodeURIComponent(form.userId)}`)
            }
          >
            Continue to Login
          </button>
        </section>
      </main>
    );
  return (
    <main className="flow-page">
      <div className="flow-heading">
        <span>New User Registration</span>
        <h1>Create your nProcure 2.0 User ID</h1>
        <p>
          Verify your registered contact details. Account setup starts after
          your first secure login.
        </p>
      </div>
      <form className="flow-card" onSubmit={submit}>
        <div className="choice-tabs">
          <button type="button" onClick={openGovernment}>GoG Client Request</button>
          <button
            type="button"
            className={form.userType === "CLIENT" ? "selected" : ""}
            onClick={() => setField(setForm, "userType", "CLIENT")}
          >
            Client
          </button>
          <button
            type="button"
            className={form.userType === "BIDDER" ? "selected" : ""}
            onClick={() => setField(setForm, "userType", "BIDDER")}
          >
            Bidder
          </button>
        </div>
        {form.userType === "CLIENT" && (
          <WFSelect
            label="Client Type"
            value={form.clientType}
            onChange={(v) => setField(setForm, "clientType", v)}
            options={["PSU", "Enterprise"]}
          />
        )}
        <div className="wf-grid">
          <WFInput
            label="Organization Full Name"
            value={form.organizationName}
            onChange={(v) => setField(setForm, "organizationName", v)}
            required
          />
          <WFInput
            label="Designation"
            value={form.designation}
            onChange={(v) => setField(setForm, "designation", v)}
            required
          />
          <WFInput
            label="Authorized Person First Name"
            value={form.firstName}
            onChange={(v) => setField(setForm, "firstName", v)}
            required
          />
          <WFInput
            label="Middle Name"
            value={form.middleName}
            onChange={(v) => setField(setForm, "middleName", v)}
          />
          <WFInput
            label="Last Name"
            value={form.lastName}
            onChange={(v) => setField(setForm, "lastName", v)}
            required
          />
          <WFInput
            label="User ID"
            value={form.userId}
            onChange={(v) => setField(setForm, "userId", v)}
            hint={
              form.userId &&
              (authServiceV2.isAvailable(form.userId)
                ? "User ID is available"
                : "User ID already exists")
            }
            required
          />
        </div>
        <OtpVerify
          label="Mobile Number"
          value={form.mobile}
          setValue={(v) => setField(setForm, "mobile", v)}
          otp={form.mobileOtp}
          setOtp={(v) => setField(setForm, "mobileOtp", v)}
          sent={mobileSent}
          send={() => setMobileSent(true)}
          verified={mobileOk}
          verify={() => setMobileOk(form.mobileOtp === OTP)}
        />
        <OtpVerify
          label="Email ID"
          type="email"
          value={form.email}
          setValue={(v) => setField(setForm, "email", v)}
          otp={form.emailOtp}
          setOtp={(v) => setField(setForm, "emailOtp", v)}
          sent={emailSent}
          send={() => setEmailSent(true)}
          verified={emailOk}
          verify={() => setEmailOk(form.emailOtp === OTP)}
        />
        <div className="wf-grid">
          <WFInput
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setField(setForm, "password", v)}
            required
          />
          <WFInput
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(v) => setField(setForm, "confirmPassword", v)}
            required
          />
          <WFInput
            label="Captcha: NPR20"
            value={form.captcha}
            onChange={(v) => setField(setForm, "captcha", v)}
            required
          />
        </div>
        <label className="wf-check">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => setField(setForm, "terms", e.target.checked)}
          />{" "}
          I accept the Terms & Conditions
        </label>
        {error && <p className="wf-error">{error}</p>}
        <button className="wf-primary">Register</button>
      </form>
    </main>
  );
}

function OtpVerify({
  label,
  type = "text",
  value,
  setValue,
  otp,
  setOtp,
  sent,
  send,
  verified,
  verify,
}) {
  return (
    <div className="otp-row">
      <WFInput
        label={label}
        type={type}
        value={value}
        onChange={setValue}
        readOnly={verified}
      />
      <button
        type="button"
        className="wf-secondary"
        onClick={send}
        disabled={!value || verified}
      >
        {sent ? "Resend OTP" : "Send OTP"}
      </button>
      {sent && (
        <>
          <WFInput
            label="Enter OTP"
            value={otp}
            onChange={setOtp}
            hint="Demo OTP: 123456"
          />
          <button
            type="button"
            className="wf-secondary"
            onClick={verify}
            disabled={verified}
          >
            {verified ? "Verified" : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
}

export function StatefulLogin({ navigate, onSession }) {
  const preset = new URLSearchParams(window.location.search).get("user") || "";
  const [userId, setUserId] = useState(preset),
    [password, setPassword] = useState(""),
    [user, setUser] = useState(null),
    [otp, setOtp] = useState(""),
    [sent, setSent] = useState(false),
    [error, setError] = useState(""),
    [dscStage, setDscStage] = useState(false);
  useEffect(
    () => setUser(userId ? authServiceV2.identify(userId) : null),
    [userId],
  );
  const submit = (e) => {
    e.preventDefault();
    setError("");
    const found = authServiceV2.verifyPassword(userId, password);
    if (!found) return setError("User ID or password is incorrect.");
    if (!sent || !authServiceV2.verifyOtp(otp))
      return setError("Send OTP and enter demo OTP 123456.");
    const account = accountService.get(userId);
    if (
      found.status === "ACTIVE" &&
      account?.authenticationPolicy?.dscRequiredForLogin
    )
      return setDscStage(true);
    finish(found);
  };
  const finish = (found = user) => {
    const session = authServiceV2.login(found);
    onSession(session);
    if (session.role === "admin") navigate("/admin/account-requests");
    else if (session.status === "REGISTERED_ACCOUNT_CREATION_PENDING")
      navigate("/dashboard/account-setup");
    else if (session.status === "CLIENT_QUERY") navigate("/dashboard/query");
    else navigate("/dashboard");
  };
  if (dscStage)
    return (
      <main className="flow-page">
        <section className="flow-card dsc-panel">
          <ShieldCheck />
          <h1>DSC Authentication</h1>
          <p>
            Approved policy requires a valid Digital Signature Certificate
            before operational access.
          </p>
          <button className="wf-primary" onClick={() => finish()}>
            Detect Demo Certificate & Continue
          </button>
          <small>No private key or real certificate data is stored.</small>
        </section>
      </main>
    );
  return (
    <main className="login-v2">
      <section className="login-v2-brand">
        <span>(n)</span>
        <h1>
          Secure. Transparent.
          <br />
          Future Ready.
        </h1>
        <p>
          One configurable procurement platform for Government, PSU, Enterprise
          and Vendors.
        </p>
      </section>
      <form className="login-v2-card" onSubmit={submit}>
        <LockKeyhole />
        <h1>Welcome back</h1>
        <p>Sign in securely to nProcure 2.0</p>
        <WFInput label="User ID" value={userId} onChange={setUserId} required />
        {user && (
          <div className="mapped-mobile">
            <small>Registered Mobile Number</small>
            <strong>{maskMobile(user.mobile)}</strong>
          </div>
        )}
        <WFInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        <div className="login-otp">
          <button
            type="button"
            className="wf-secondary"
            disabled={!user}
            onClick={() => setSent(true)}
          >
            {sent ? "Resend OTP" : "Send OTP"}
          </button>
          {sent && (
            <WFInput
              label="Enter OTP"
              value={otp}
              onChange={setOtp}
              hint="Demo OTP: 123456"
            />
          )}
        </div>
        {error && <p className="wf-error">{error}</p>}
        <button className="wf-primary">Login</button>
        <div className="login-links">
          <button type="button">Forgot Password?</button>
          <button type="button" onClick={() => navigate("/register")}>
            New User Registration
          </button>
        </div>
        <div className="demo-box">
          <strong>Demo users</strong>
          <span>new.client / Demo@123</span>
          <span>new.bidder / Demo@123</span>
          <span>superadmin / Admin@123</span>
        </div>
      </form>
    </main>
  );
}

export function AuthenticatedPortal({ session, navigate, onLogout }) {
  const [collapsed, setCollapsed] = useState(
      () => localStorage.getItem("nprocure2.sidebar.collapsed") === "true",
    ),
    [mobileOpen, setMobileOpen] = useState(false),
    [profileOpen, setProfileOpen] = useState(false),
    [refresh, setRefresh] = useState(0);
  const user = authServiceV2.current() || session;
  if (!user)
    return (
      <main className="flow-page">
        <section className="flow-card">
          <h1>Session required</h1>
          <button className="wf-primary" onClick={() => navigate("/login")}>
            Open Login
          </button>
        </section>
      </main>
    );
  const path = window.location.pathname;
  const menu = menuFor(user, accountService.get(user.userId));
  const logout = () => {
    authServiceV2.logout();
    onLogout();
    navigate("/");
  };
  const toggleSidebar = () =>
    setCollapsed((value) => {
      localStorage.setItem("nprocure2.sidebar.collapsed", String(!value));
      return !value;
    });
  return (
    <div className={`portal-layout ${collapsed ? "is-collapsed" : ""}`}>
      <header className="portal-topbar">
        <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
          <Menu />
        </button>
        <button className="portal-brand" onClick={() => navigate("/dashboard")}>
          <span>(n)</span>
          <strong>
            Procure <b>2.0</b>
          </strong>
        </button>
        <div className="portal-top-actions">
          <button title="Notifications">
            <Bell />
          </button>
          <button
            title="Help & Support"
            onClick={() => navigate("/dashboard/help")}
          >
            <CircleHelp />
          </button>
          <div className="profile-menu">
            <button
              className="profile-trigger"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <UserRound />
              <span>
                <small>Welcome</small>
                <strong>{user.displayName}</strong>
              </span>
            </button>
            {profileOpen && (
              <div className="profile-popover">
                <button
                  onClick={() => {
                    navigate("/dashboard/profile");
                    setProfileOpen(false);
                  }}
                >
                  <UserRound /> Account / Profile
                </button>
                <button onClick={logout}>
                  <LogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <aside className={`portal-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <button className="close-mobile" onClick={() => setMobileOpen(false)}>
          <X />
        </button>
        <nav>
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <button
                title={item.label}
                className={path === item.route ? "active" : ""}
                key={item.id}
                onClick={() => {
                  navigate(item.route);
                  setMobileOpen(false);
                }}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button className="collapse-control" onClick={toggleSidebar}>
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          <span>{collapsed ? "Expand" : "Collapse"}</span>
        </button>
      </aside>
      <main className="portal-main">
        <div className="breadcrumb">
          Dashboard <ChevronRight /> {titleFor(path)}
        </div>
        {path === "/dashboard/account-setup" ? (
          <AccountWizard
            user={user}
            navigate={navigate}
            onChange={() => setRefresh(refresh + 1)}
          />
        ) : path === "/dashboard/query" ? (
          <QueryResponse user={user} navigate={navigate} />
        ) : path === "/dashboard/users" ? (
          <UserManagement
            user={user}
            account={accountService.get(user.userId)}
          />
        ) : path === "/dashboard/roles" ? (
          <RoleAssignment
            user={user}
            account={accountService.get(user.userId)}
          />
        ) : path === "/dashboard/hierarchy" ? (
          <OrganizationHierarchy
            user={user}
            account={accountService.get(user.userId)}
          />
        ) : (
          <DashboardHome
            user={user}
            account={accountService.get(user.userId)}
            navigate={navigate}
          />
        )}
      </main>
      <footer className="portal-footer">
        © 2026 (n)Code Solutions{" "}
        <span>Prototype v2.0 · Privacy · Terms · Help</span>
      </footer>
    </div>
  );
}

function menuFor(user, account) {
  const base = [
    {
      id: "dashboard",
      label: "Dashboard",
      route: "/dashboard",
      icon: LayoutDashboard,
    },
  ];
  if (user.status === "REGISTERED_ACCOUNT_CREATION_PENDING")
    return [
      ...base,
      {
        id: "setup",
        label: "Account Setup",
        route: "/dashboard/account-setup",
        icon: FileCheck2,
      },
      {
        id: "help",
        label: "Help & Support",
        route: "/dashboard/help",
        icon: CircleHelp,
      },
    ];
  if (user.status === "CLIENT_QUERY")
    return [
      ...base,
      {
        id: "status",
        label: "Account Status",
        route: "/dashboard",
        icon: FileText,
      },
      {
        id: "query",
        label: "Respond to Query",
        route: "/dashboard/query",
        icon: Bell,
      },
      {
        id: "details",
        label: "Submitted Details",
        route: "/dashboard/details",
        icon: Building2,
      },
      {
        id: "help",
        label: "Help & Support",
        route: "/dashboard/help",
        icon: CircleHelp,
      },
    ];
  if (user.status !== "ACTIVE")
    return [
      ...base,
      {
        id: "status",
        label: "Account Status",
        route: "/dashboard",
        icon: FileText,
      },
      {
        id: "details",
        label: "Submitted Details",
        route: "/dashboard/details",
        icon: Building2,
      },
      {
        id: "help",
        label: "Help & Support",
        route: "/dashboard/help",
        icon: CircleHelp,
      },
    ];
  const configured = account?.approvedModules || [];
  const active =
    user.userType === "BIDDER"
      ? [
          "Search Tenders",
          "My Tenders",
          "My Bids",
          "Auctions",
          "Documents",
          "Payments",
          "Subscription / Renewal",
        ]
      : configured.filter(
          (module) =>
            !account?.permissions?.[module] ||
            account.permissions[module].includes("VIEW"),
        );
  return [
    ...base,
    ...(user.userType === "CLIENT"
      ? [
          {
            id: "hierarchy",
            label: "Organization Hierarchy",
            route: "/dashboard/hierarchy",
            icon: Building2,
          },
          {
            id: "users",
            label: "User Management",
            route: "/dashboard/users",
            icon: UserRound,
          },
          {
            id: "roles",
            label: "Role Assignment",
            route: "/dashboard/roles",
            icon: ShieldCheck,
          },
        ]
      : []),
    ...active.map((label, i) => ({
      id: `mod-${i}`,
      label,
      route: `/dashboard/module/${encodeURIComponent(label)}`,
      icon: label.includes("Payment") ? CreditCard : Package,
    })),
    {
      id: "profile",
      label: "Account / Profile",
      route: "/dashboard/profile",
      icon: UserRound,
    },
    {
      id: "help",
      label: "Help & Support",
      route: "/dashboard/help",
      icon: CircleHelp,
    },
  ];
}
const titleFor = (path) =>
  path.includes("account-setup")
    ? "Account Setup"
    : path.includes("query")
      ? "Respond to Query"
      : path.includes("users")
        ? "User Management"
        : path.includes("roles")
          ? "Role Assignment"
          : path.includes("hierarchy")
            ? "Organization Hierarchy"
            : "Dashboard";

function DashboardHome({ user, account, navigate }) {
  const statusText =
    {
      REGISTERED_ACCOUNT_CREATION_PENDING:
        "Your registration is complete. Finish account setup to continue.",
      CLIENT_PENDING_APPROVAL: "Your account request is under nProcure review.",
      CLIENT_QUERY: "Admin needs a clarification from you.",
      BIDDER_PAYMENT_PENDING: "Complete or retry package payment.",
      ACTIVE: "Your account is active.",
    }[user.status] || user.status;
  return (
    <section>
      <div className="dashboard-title">
        <div>
          <h1>Hello, {user.displayName}</h1>
          <p>Here is your nProcure account overview.</p>
        </div>
        <span
          className={`wf-status ${user.status === "ACTIVE" ? "success" : ""}`}
        >
          {user.status.replaceAll("_", " ")}
        </span>
      </div>
      <div className="status-banner">
        <ShieldCheck />
        <div>
          <strong>{statusText}</strong>
          <p>Organization: {user.organizationName}</p>
        </div>
        {user.status === "REGISTERED_ACCOUNT_CREATION_PENDING" && (
          <button
            className="wf-primary"
            onClick={() => navigate("/dashboard/account-setup")}
          >
            Complete Setup
          </button>
        )}
        {user.status === "CLIENT_QUERY" && (
          <button
            className="wf-primary"
            onClick={() => navigate("/dashboard/query")}
          >
            Respond Now
          </button>
        )}
      </div>
      {user.status === "ACTIVE" && (
        <div className="dashboard-cards">
          <article>
            <Building2 />
            <h3>Tenant / Account</h3>
            <p>{account?.tenantCode || account?.id}</p>
          </article>
          <article>
            <Package />
            <h3>Enabled Modules</h3>
            <p>{account?.approvedModules?.join(", ") || "Bidder Portal"}</p>
          </article>
          <article>
            <UserRound />
            <h3>Role</h3>
            <p>{account?.role || "Bidder User"}</p>
          </article>
        </div>
      )}
    </section>
  );
}

function AccountWizard({ user, navigate }) {
  return user.userType === "CLIENT" ? (
    <ConfigurableClientWizard user={user} navigate={navigate} />
  ) : (
    <BidderWizard user={user} navigate={navigate} />
  );
}

function ConfigurableClientWizard({ user, navigate }) {
  const config =
    clientTypeConfig[user.clientType] || clientTypeConfig.Government;
  const saved = accountService.get(user.userId);
  const [step, setStep] = useState(
    Math.min(saved?.currentStep || 0, config.steps.length - 1),
  );
  const [data, setData] = useState(
    saved?.data || {
      clientType: user.clientType,
      organizationName: user.organizationName,
      country: "India",
      officialEmail: user.email,
      officialContact: user.mobile,
      firstName: user.displayName.split(" ")[0],
      middleName: "",
      lastName: user.displayName.split(" ").slice(-1)[0],
      designation: user.designation,
      registeredMobile: user.mobile,
      registeredEmail: user.email,
      departments: [{}],
      subDepartments: [{}],
      businessUnits: [{}],
      offices: [{}],
      integrations: [{}],
      existingSystems: {},
      modules: [],
      documents: [],
      declaration: false,
    },
  );
  const update = (name, value) => setField(setData, name, value);
  const normalized = () => ({
    ...data,
    baseCurrency: data.baseCurrency || "INR",
    hierarchyType: user.clientType,
    existingSystems: data.existingSystems || legacySystemsFrom(data),
    integrations: stableRecords(data.integrations || [{}], "INT"),
    authenticationPolicyRequest: {
      ...(data.authenticationPolicyRequest || {}),
      processRules: stableRecords(
        data.authenticationPolicyRequest?.processRules || [],
        "AUT",
      ),
    },
    moduleDefinition: (data.modules || []).map((value) => ({
      value,
      code: moduleCodeFor(value),
    })),
    departments: stableRecords(data.departments, "DEP"),
    subDepartments: stableRecords(data.subDepartments, "SUB"),
    businessUnits: stableRecords(data.businessUnits, "BUS"),
    offices: stableRecords(data.offices, "OFF"),
  });
  const save = () => accountService.saveDraft(user.userId, normalized(), step);
  const next = () => {
    save();
    setStep(Math.min(step + 1, config.steps.length - 1));
  };
  const submit = () => {
    const bank = data.bankConfiguration || {};
    const invalidBank =
      (bank.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc)) ||
      (bank.accountNumber && bank.accountNumber !== bank.confirmAccountNumber);
    if (!data.declaration || !data.modules?.length || invalidBank) return;
    const ready = normalized();
    accountService.saveDraft(user.userId, ready, step);
    accountService.submitClient(user.userId, ready);
    navigate("/dashboard");
  };
  const current = config.steps[step];
  return (
    <WizardShell
      title={`Complete Your ${user.clientType} Client Account Setup`}
      text={`${user.clientType} configuration and hierarchy are loaded from your saved registration.`}
      steps={config.steps}
      step={step}
      setStep={setStep}
      onSave={save}
      onNext={next}
      onSubmit={submit}
    >
      {(current === "Organization" || current === "Corporate Details") && (
        <ClientOrganizationStep data={data} update={update} config={config} />
      )}
      {current === "Department" && (
        <Repeatable
          title="Departments"
          items={data.departments}
          setItems={(v) => update("departments", v)}
          fields={config.unitFields.departments}
        />
      )}
      {current === "Sub-Department" && (
        <FormSection title="Sub-Department Hierarchy">
          <WFSelect
            label="Sub-Department Applicable"
            value={data.subDepartmentApplicable || "No"}
            onChange={(v) => update("subDepartmentApplicable", v)}
            options={["No", "Yes"]}
          />
          {data.subDepartmentApplicable === "Yes" && (
            <Repeatable
              title="Sub-Departments"
              items={data.subDepartments}
              setItems={(v) => update("subDepartments", v)}
              fields={config.unitFields.subDepartments}
            />
          )}
        </FormSection>
      )}
      {current === "Department / Function" && (
        <Repeatable
          title="Departments / Functions"
          items={data.departments}
          setItems={(v) => update("departments", v)}
          fields={config.unitFields.departments}
        />
      )}
      {(current === "Business Unit / Plant / Location" ||
        current === "Business Unit / Division") && (
        <Repeatable
          title={current}
          items={data.businessUnits}
          setItems={(v) => update("businessUnits", v)}
          fields={config.unitFields.businessUnits}
        />
      )}
      {(current === "Office / Division / Circle" ||
        current === "Plant / Branch / Location") && (
        <Repeatable
          title={current}
          items={data.offices}
          setItems={(v) => update("offices", v)}
          fields={config.unitFields.offices}
        />
      )}
      {current === "Statutory Details" && (
        <ClientStatutoryStep
          data={data}
          update={update}
          clientType={user.clientType}
        />
      )}
      {current === "Authorized User" && (
        <ClientAuthorizedUserStep
          user={user}
          data={data}
          update={update}
          config={config}
        />
      )}
      {current === "Procurement Modules" && (
        <ModuleDefinition
          values={data.modules || []}
          onChange={(v) => update("modules", v)}
        />
      )}
      {current === "Advanced Procurement Configuration" && (
        <AdvancedProcurementConfiguration
          clientType={user.clientType}
          modules={data.modules || []}
          value={data.advancedPrivileges || {}}
          onChange={(v) => update("advancedPrivileges", v)}
          bank={data.bankConfiguration || {}}
          onBankChange={(v) => update("bankConfiguration", v)}
        />
      )}
      {(current.includes("Systems") ||
        current === "ERP / Business Systems") && (
        <>
          <ExistingSystemsSection
            clientType={user.clientType}
            value={data.existingSystems || legacySystemsFrom(data)}
            onChange={(v) => update("existingSystems", v)}
          />
          {current === "Government Systems & Integration" && (
            <IntegrationRecords
              systems={data.existingSystems || legacySystemsFrom(data)}
              items={data.integrations || [{}]}
              onChange={(v) => update("integrations", v)}
            />
          )}
        </>
      )}
      {current === "Integration" && (
        <IntegrationRecords
          systems={data.existingSystems || legacySystemsFrom(data)}
          items={data.integrations || [{}]}
          onChange={(v) => update("integrations", v)}
        />
      )}
      {(current === "Authentication" ||
        current === "Authentication & Documents") && (
        <>
          <ClientAuthenticationPolicy
            clientType={user.clientType}
            modules={data.modules || []}
            value={data.authenticationPolicyRequest || {}}
            onChange={(v) => update("authenticationPolicyRequest", v)}
          />
          {current === "Authentication & Documents" && (
            <DocumentUpload
              documents={data.documents || []}
              onChange={(v) => update("documents", v)}
              types={config.documents}
            />
          )}
        </>
      )}
      {current === "Documents" && (
        <DocumentUpload
          documents={data.documents || []}
          onChange={(v) => update("documents", v)}
          types={config.documents}
        />
      )}
      {current === "Review & Submit" && (
        <ReviewData
          data={data}
          user={user}
          onDeclaration={(v) => update("declaration", v)}
        />
      )}
    </WizardShell>
  );
}

const stableRecords = (records = [], prefix) =>
  records.map((record, index) => ({
    ...record,
    id:
      record.id ||
      `${prefix}-${Date.now().toString(36).toUpperCase()}-${index + 1}`,
  }));
const legacySystemsFrom = (data) => ({
  erp: [data.erp || data["Existing ERP"] || data["ERP System"]].filter(Boolean),
  finance: [
    data.financeSystem ||
      data["Finance / Accounts System"] ||
      data["Finance / Accounts"],
  ].filter(Boolean),
  procurement: [
    data["Procurement System"] || data["Procurement Module"],
  ].filter(Boolean),
  vendor: [data["Vendor Portal"]].filter(Boolean),
  hr: [data["HRMS"]].filter(Boolean),
  identity: [data["Identity Provider"]].filter(Boolean),
  government: [data["Existing Government System"]].filter(Boolean),
});
const moduleCodeFor = (value) =>
  ({
    "e-Tender": "TMS",
    "TMS - Tender Management System": "TMS",
    "e-Auction": "AUC",
    "AUC - Auction": "AUC",
    "Vendor Management": "VMS",
    VMS: "VMS",
    "Indent / Requisition": "IMS",
    IMS: "IMS",
  })[value] || value;

function ModuleDefinition({ values, onChange }) {
  return (
    <FormSection title="Module Definition / Procurement Modules">
      <p className="wf-note">
        Friendly module names and legacy AUC / IMS / VMS / TMS codes are
        preserved for compatibility.
      </p>
      <CardSelect
        title="Select one or more modules"
        values={values}
        options={modules}
        onChange={onChange}
      />
      <div className="module-code-list">
        {values.map((value) => (
          <span key={value}>
            <b>{moduleCodeFor(value)}</b>
            {value}
          </span>
        ))}
      </div>
    </FormSection>
  );
}

function SearchableMultiSelect({ label, values = [], options, onChange }) {
  const [search, setSearch] = useState("");
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );
  const toggle = (option) =>
    onChange(
      values.includes(option)
        ? values.filter((item) => item !== option)
        : [...values, option],
    );
  return (
    <div className="search-multi">
      <span>{label}</span>
      <details>
        <summary>
          {values.length ? values.join(", ") : "Select one or more"}
        </summary>
        <div className="search-multi-popover">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search options..."
          />
          {filtered.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={values.includes(option)}
                onChange={() => toggle(option)}
              />
              {option}
            </label>
          ))}
          {!filtered.length && <small>No matching option</small>}
        </div>
      </details>
    </div>
  );
}

function ExistingSystemsSection({ clientType, value, onChange }) {
  const fields = [
    ["erp", "Existing ERP / Business System"],
    ["finance", "Finance / Accounts System"],
    ["procurement", "Procurement System"],
    ["vendor", "Vendor Management System"],
    ["hr", "HR / Employee System"],
    ["identity", "Identity Provider"],
    ...(clientType === "Government" || clientType === "PSU"
      ? [["government", "Government Systems Used"]]
      : []),
  ];
  return (
    <FormSection title="Existing Systems">
      <p className="wf-note">
        Select every system currently used by the organization.
      </p>
      <div className="wf-grid">
        {fields.map(([key, label]) => (
          <SearchableMultiSelect
            key={key}
            label={label}
            values={value[key] || []}
            options={systemOptions[key]}
            onChange={(next) => onChange({ ...value, [key]: next })}
          />
        ))}
      </div>
    </FormSection>
  );
}

function IntegrationRecords({ systems, items, onChange }) {
  const selectedSystems = [...new Set(Object.values(systems).flat())].filter(
    (item) => item !== "None",
  );
  const systemChoices = [
    ...selectedSystems,
    ...(selectedSystems.includes("Other") ? [] : ["Other"]),
  ];
  const update = (index, name, next) =>
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [name]: next } : item,
      ),
    );
  return (
    <FormSection title="Multiple System Integration">
      <p className="wf-note">
        Add one record for each system/interface. Selected existing systems are
        available below.
      </p>
      {items.map((item, index) => (
        <div className="repeat-card integration-card" key={item.id || index}>
          <div className="repeat-card-title">
            <strong>Integration {index + 1}</strong>
            {items.length > 1 && (
              <button
                className="wf-danger"
                onClick={() =>
                  onChange(items.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                Remove
              </button>
            )}
          </div>
          <div className="wf-grid">
            <SearchableSelect
              label="System to Integrate"
              value={item.system || ""}
              options={systemChoices}
              onChange={(next) => update(index, "system", next)}
            />
            {item.system === "Other" && (
              <WFInput
                label="Specify Other System"
                value={item.otherSystem || ""}
                onChange={(next) => update(index, "otherSystem", next)}
              />
            )}
            <SearchableMultiSelect
              label="Integration Purpose"
              values={item.purpose || []}
              options={integrationPurposeOptions}
              onChange={(next) => update(index, "purpose", next)}
            />
            <WFSelect
              label="Integration Direction"
              value={item.direction || ""}
              onChange={(next) => update(index, "direction", next)}
              options={["Incoming", "Outgoing", "Bi-directional"]}
            />
            <SearchableMultiSelect
              label="Integration Method"
              values={item.methods || []}
              options={integrationMethodOptions}
              onChange={(next) => update(index, "methods", next)}
            />
            <WFSelect
              label="Integration Frequency"
              value={item.frequency || ""}
              onChange={(next) => update(index, "frequency", next)}
              options={["Real-time", "Scheduled", "Batch", "On-demand"]}
            />
            <WFSelect
              label="Middleware"
              value={item.middleware || ""}
              onChange={(next) => update(index, "middleware", next)}
              options={middlewareOptions}
            />
            {item.middleware === "Other" && (
              <WFInput
                label="Specify Other Middleware"
                value={item.otherMiddleware || ""}
                onChange={(next) => update(index, "otherMiddleware", next)}
              />
            )}
            <WFInput
              label="Technical Contact Name"
              value={item.technicalContactName || ""}
              onChange={(next) => update(index, "technicalContactName", next)}
            />
            <WFInput
              label="Technical Contact Email"
              type="email"
              value={item.technicalContactEmail || ""}
              onChange={(next) => update(index, "technicalContactEmail", next)}
            />
            <WFInput
              label="Technical Contact Mobile"
              value={item.technicalContactMobile || ""}
              onChange={(next) => update(index, "technicalContactMobile", next)}
            />
            <WFInput
              label="Integration Remarks"
              value={item.remarks || ""}
              onChange={(next) => update(index, "remarks", next)}
            />
          </div>
        </div>
      ))}
      <button className="wf-secondary" onClick={() => onChange([...items, {}])}>
        + Add Integration
      </button>
    </FormSection>
  );
}

function SearchableSelect({ label, value, options, onChange }) {
  const [search, setSearch] = useState("");
  const filtered = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <label className="wf-field searchable-select">
      <span>{label}</span>
      <input
        value={search || value}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search system..."
      />
      <div className="searchable-options">
        {(search || !value) &&
          filtered.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                onChange(option);
                setSearch("");
              }}
            >
              {option}
            </button>
          ))}
      </div>
    </label>
  );
}

function ClientAuthenticationPolicy({
  clientType,
  modules: selectedModules,
  value,
  onChange,
}) {
  const government = clientType === "Government";
  const login = value.loginPolicy || {
    primaryMethod: government ? "PKI / DSC – Signing" : "Password + OTP",
    additionalMethods: government ? ["Mobile OTP"] : [],
    dscRequiredForLogin: government,
    mfaRequired: government,
  };
  const rules = value.processRules || [];
  const updateLogin = (name, next) =>
    onChange({
      ...value,
      loginPolicy: {
        ...login,
        [name]: next,
        ...(government ? { dscRequiredForLogin: true } : {}),
      },
      processRules: rules,
    });
  const updateRules = (next) =>
    onChange({ ...value, loginPolicy: login, processRules: next });
  const updateRule = (index, name, next) =>
    updateRules(
      rules.map((rule, ruleIndex) =>
        ruleIndex === index ? { ...rule, [name]: next } : rule,
      ),
    );
  const moduleChoices = selectedModules.map((module) => ({
    label: module,
    code: moduleCodeFor(module),
  }));
  return (
    <FormSection title="Authentication & Security">
      <div className="advanced-subsection">
        <h3>Login Authentication Policy</h3>
        {government && (
          <p className="wf-note">
            PKI / DSC is mandatory for Government operational login. OTP can be
            an additional layer.
          </p>
        )}
        <div className="wf-grid">
          <WFSelect
            label="Primary Login Method"
            value={login.primaryMethod || ""}
            onChange={(next) => updateLogin("primaryMethod", next)}
            options={
              government
                ? authenticationMethods.filter(
                    (method) =>
                      method.includes("PKI") || method.includes("DSC"),
                  )
                : [
                    "Password + OTP",
                    "Corporate SSO / MFA",
                    ...authenticationMethods,
                  ]
            }
          />
          <SearchableMultiSelect
            label="Additional Authentication Methods"
            values={login.additionalMethods || []}
            options={authenticationMethods}
            onChange={(next) => updateLogin("additionalMethods", next)}
          />
          <WFSelect
            label="DSC Required for Login"
            value={
              government ? "Yes" : login.dscRequiredForLogin ? "Yes" : "No"
            }
            onChange={(next) =>
              updateLogin("dscRequiredForLogin", next === "Yes")
            }
            options={["Yes", "No"]}
          />
          <WFSelect
            label="MFA Requirement"
            value={login.mfaRequired ? "Yes" : "No"}
            onChange={(next) => updateLogin("mfaRequired", next === "Yes")}
            options={["Yes", "No"]}
          />
        </div>
      </div>
      <div className="advanced-subsection">
        <h3>Process Authentication & Confirmation Rules</h3>
        <p className="wf-note">
          These rules define how an already-authorized user confirms a sensitive
          transaction. They do not grant Role & Rights.
        </p>
        {rules.map((rule, index) => {
          const code = moduleCodeFor(rule.module);
          const stages = processStageMaster[code] ||
            processStageMaster[rule.module] || [
              "Create",
              "Submit",
              "Approve",
              "Publish",
              "Open",
              "Sign",
              "Other",
            ];
          return (
            <div className="repeat-card" key={rule.id || index}>
              <div className="repeat-card-title">
                <strong>Authentication Rule {index + 1}</strong>
                <button
                  className="wf-danger"
                  onClick={() =>
                    updateRules(
                      rules.filter((_, ruleIndex) => ruleIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
              <div className="wf-grid">
                <WFSelect
                  label="Module"
                  value={rule.module || ""}
                  onChange={(next) => updateRule(index, "module", next)}
                  options={moduleChoices.map((item) => item.label)}
                />
                <SearchableSelect
                  label="Process Stage / Activity"
                  value={rule.processStage || ""}
                  onChange={(next) => updateRule(index, "processStage", next)}
                  options={stages}
                />
                {rule.processStage === "Other" && (
                  <WFInput
                    label="Specify Other Process Stage"
                    value={rule.otherProcessStage || ""}
                    onChange={(next) =>
                      updateRule(index, "otherProcessStage", next)
                    }
                  />
                )}
                <WFSelect
                  label="Confirmation Required"
                  value={rule.confirmationRequired || ""}
                  onChange={(next) =>
                    updateRule(index, "confirmationRequired", next)
                  }
                  options={["Yes", "No"]}
                />
                <SearchableMultiSelect
                  label="Authentication / Confirmation Method"
                  values={rule.methods || []}
                  options={authenticationMethods}
                  onChange={(next) => updateRule(index, "methods", next)}
                />
                {rule.methods?.includes("Other") && (
                  <WFInput
                    label="Specify Other Method"
                    value={rule.otherMethod || ""}
                    onChange={(next) => updateRule(index, "otherMethod", next)}
                  />
                )}
                <WFSelect
                  label="Mandatory / Optional"
                  value={rule.requirement || ""}
                  onChange={(next) => updateRule(index, "requirement", next)}
                  options={["Mandatory", "Optional"]}
                />
                <WFSelect
                  label="Re-authentication Required"
                  value={rule.reauthenticationRequired || ""}
                  onChange={(next) =>
                    updateRule(index, "reauthenticationRequired", next)
                  }
                  options={["Yes", "No"]}
                />
                <WFInput
                  label="Remarks"
                  value={rule.remarks || ""}
                  onChange={(next) => updateRule(index, "remarks", next)}
                />
              </div>
            </div>
          );
        })}
        <button
          className="wf-secondary"
          disabled={!moduleChoices.length}
          onClick={() =>
            updateRules([
              ...rules,
              {
                module: moduleChoices[0]?.label || "",
                processStage: "",
                confirmationRequired: "Yes",
                methods: [],
                requirement: "Mandatory",
                reauthenticationRequired: "Yes",
                remarks: "",
              },
            ])
          }
        >
          + Add Authentication Rule
        </button>
        {!moduleChoices.length && (
          <p className="wf-error">
            Select at least one Procurement Module before adding process rules.
          </p>
        )}
      </div>
    </FormSection>
  );
}

function AdvancedProcurementConfiguration({
  clientType,
  modules: selectedModules,
  value,
  onChange,
  bank,
  onBankChange,
}) {
  const tenderSelected = selectedModules.some(
    (item) => item === "e-Tender" || item.startsWith("TMS"),
  );
  const showTender = clientType !== "Enterprise" || tenderSelected;
  const setAdvanced = (name, next) => onChange({ ...value, [name]: next });
  const setBank = (name, next) => onBankChange({ ...bank, [name]: next });
  const yesNo = (label, name) => (
    <WFSelect
      label={`${label} *`}
      value={value[name] ?? ""}
      onChange={(next) => setAdvanced(name, next)}
      options={["Yes", "No"]}
    />
  );
  const ifscInvalid =
    bank.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifsc.toUpperCase());
  const accountMismatch =
    bank.accountNumber &&
    bank.confirmAccountNumber &&
    bank.accountNumber !== bank.confirmAccountNumber;
  return (
    <FormSection title="Advanced Procurement Configuration">
      <p className="wf-note">
        Organization-level procurement settings. Role and user rights are
        configured only after account activation.
      </p>
      <div className="advanced-subsection">
        <h3>Advanced Privileges</h3>
        <div className="wf-grid">
          {yesNo("Result Sharing", "resultSharing")}
          {showTender && yesNo("Bid Withdrawal", "bidWithdrawal")}
          {showTender && (
            <WFSelect
              label="Min. No. Decryptors *"
              value={value.minDecryptors || ""}
              onChange={(next) => setAdvanced("minDecryptors", next)}
              options={["1", "2", "3", "4"]}
            />
          )}
          <WFSelect
            label="User ID Creation Type"
            value={value.userIdCreationType || ""}
            onChange={(next) => setAdvanced("userIdCreationType", next)}
            options={["Alpha Numeric", "Numeric"]}
          />
          <WFSelect
            label="Min. No. Evaluators *"
            value={value.minEvaluators || ""}
            onChange={(next) => setAdvanced("minEvaluators", next)}
            options={["1", "2", "3", "4"]}
          />
          {showTender &&
            yesNo(
              "Notification to Department for Stage Opening via Mail",
              "stageOpeningEmail",
            )}
          {showTender &&
            yesNo("Mandate Alternate Decryptor", "mandateAlternateDecryptor")}
          {showTender &&
            yesNo("Unlock Price Bid Format", "unlockPriceBidFormat")}
          {showTender &&
            yesNo(
              "Amendment Approval Document Mandatory",
              "amendmentApprovalDocumentMandatory",
            )}
          {showTender &&
            yesNo("Amendment Post Bidding Date", "amendmentPostBiddingDate")}
          {showTender && yesNo("Bid Count Status", "bidCountStatus")}
          <WFSelect
            label="Payment Mode"
            value={value.paymentMode || ""}
            onChange={(next) => setAdvanced("paymentMode", next)}
            options={["Online", "Offline"]}
          />
          {yesNo("Auto Draw", "autoDraw")}
        </div>
        {clientType === "Enterprise" && !tenderSelected && (
          <p className="wf-note">
            Tender-specific privileges will appear after selecting e-Tender or
            TMS.
          </p>
        )}
      </div>
      <div className="advanced-subsection">
        <h3>Client Bank / Payment Configuration</h3>
        <div className="wf-grid">
          <WFInput
            label="Bank IFSC Code"
            value={bank.ifsc || ""}
            onChange={(next) => {
              const upper = next.toUpperCase();
              setBank("ifsc", upper);
              if (/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upper))
                onBankChange({
                  ...bank,
                  ifsc: upper,
                  bankAddress: bank.bankAddress || "Demo Bank Branch, India",
                });
            }}
            hint={
              ifscInvalid
                ? "Use format ABCD0123456"
                : bank.ifsc
                  ? "Mock IFSC verified"
                  : ""
            }
          />
          <WFInput
            label="Account Holder Name"
            value={bank.accountHolderName || ""}
            onChange={(next) => setBank("accountHolderName", next)}
          />
          <WFSelect
            label="Account Type"
            value={bank.accountType || ""}
            onChange={(next) => setBank("accountType", next)}
            options={["Current", "Savings"]}
          />
          <WFInput
            label="Bank Account Number"
            value={bank.accountNumber || ""}
            onChange={(next) => setBank("accountNumber", next)}
          />
          <WFInput
            label="Confirm Bank Account Number"
            value={bank.confirmAccountNumber || ""}
            onChange={(next) => setBank("confirmAccountNumber", next)}
            hint={accountMismatch ? "Account numbers do not match" : ""}
          />
          <WFInput
            label="Bank Address"
            value={bank.bankAddress || ""}
            onChange={(next) => setBank("bankAddress", next)}
          />
        </div>
        {(ifscInvalid || accountMismatch) && (
          <p className="wf-error">
            Correct the highlighted bank information before final submission.
          </p>
        )}
      </div>
    </FormSection>
  );
}

function ClientOrganizationStep({ data, update, config }) {
  return (
    <FormSection
      title={
        data.clientType === "Enterprise"
          ? "Corporate Details"
          : "Organization Details"
      }
    >
      <div className="wf-grid">
        <WFInput label="Client Type" value={data.clientType} readOnly />
        <WFInput
          label="Organization Full Name"
          value={data.organizationName}
          readOnly
        />
        <WFInput
          label="Organization Short Name"
          value={data.shortName || ""}
          onChange={(v) => update("shortName", v)}
        />
        <WFInput
          label="Organization Category"
          value={data.category || ""}
          onChange={(v) => update("category", v)}
        />
        <WFSelect
          label="Client Category"
          value={data.clientCategory || ""}
          onChange={(v) => update("clientCategory", v)}
          options={["GOG", "Non GOG"]}
        />
        <WFSelect
          label="Base Currency *"
          value={data.baseCurrency || "INR"}
          onChange={(v) => update("baseCurrency", v)}
          options={["INR"]}
        />
        {data.clientCategory === "Non GOG" && (
          <>
            <WFInput
              label="Standard Charges"
              type="number"
              value={data.standardCharges || ""}
              onChange={(v) => update("standardCharges", v)}
            />
            <WFInput
              label="Premium Charges"
              type="number"
              value={data.premiumCharges || ""}
              onChange={(v) => update("premiumCharges", v)}
            />
          </>
        )}
        <label className="wf-check">
          <input
            type="checkbox"
            checked={!!data.includeInGog}
            onChange={(e) => update("includeInGog", e.target.checked)}
          />{" "}
          Include in GOG
        </label>
        <WFSelect
          label="Legal Status *"
          value={data.legalStatus || ""}
          onChange={(v) => update("legalStatus", v)}
          options={legalStatusOptions}
        />
        {config.organizationExtra.map((field) => (
          <WFInput
            key={field}
            label={field}
            value={data[field] || ""}
            onChange={(v) => update(field, v)}
          />
        ))}
        <WFInput
          label="Official Website"
          value={data.website || ""}
          onChange={(v) => update("website", v)}
        />
        <WFInput
          label="Client URL"
          type="url"
          value={data.clientUrl || ""}
          onChange={(v) => update("clientUrl", v)}
        />
        <WFInput
          label="Official Email"
          value={data.officialEmail || ""}
          onChange={(v) => update("officialEmail", v)}
        />
        <WFInput
          label="Official Contact Number"
          value={data.officialContact || ""}
          onChange={(v) => update("officialContact", v)}
        />
        <WFInput
          label="Address Line 1"
          value={data.address1 || ""}
          onChange={(v) => update("address1", v)}
        />
        <WFInput label="Country" value={data.country || "India"} readOnly />
        <WFSelect
          label="State"
          value={data.state || ""}
          onChange={(v) => {
            update("state", v);
            update("district", "");
          }}
          options={Object.keys(districtsByState)}
        />
        <WFSelect
          label="District"
          value={data.district || ""}
          onChange={(v) => update("district", v)}
          options={districtsByState[data.state] || []}
        />
        <WFInput
          label="PIN Code"
          value={data.pin || ""}
          onChange={(v) => update("pin", v)}
        />
      </div>
      <div className="contact-person-section">
        <h3>Contact Person</h3>
        <p>Primary contact person for organization communication.</p>
        <div className="wf-grid">
          <WFInput
            label="Contact Person First Name *"
            value={data.contactPersonFirstName || data.contactPersonName || ""}
            onChange={(v) => update("contactPersonFirstName", v)}
          />
          <WFInput
            label="Middle Name"
            value={data.contactPersonMiddleName || ""}
            onChange={(v) => update("contactPersonMiddleName", v)}
          />
          <WFInput
            label="Last Name *"
            value={data.contactPersonLastName || ""}
            onChange={(v) => update("contactPersonLastName", v)}
          />
          <WFInput
            label="Designation *"
            value={data.contactPersonDesignation || ""}
            onChange={(v) => update("contactPersonDesignation", v)}
          />
          <WFInput
            label="Telephone Number"
            value={data.contactPersonTelephone || ""}
            onChange={(v) => update("contactPersonTelephone", v)}
          />
          <WFInput
            label="Mobile Number *"
            value={data.contactPersonMobile || ""}
            onChange={(v) => update("contactPersonMobile", v)}
          />
          <WFInput
            label="Fax Number"
            value={data.contactPersonFax || ""}
            onChange={(v) => update("contactPersonFax", v)}
          />
          <WFInput
            label="Email Address *"
            type="email"
            value={data.contactPersonEmail || ""}
            onChange={(v) => update("contactPersonEmail", v)}
          />
          <WFInput
            label="Alternate Email"
            type="email"
            value={data.contactPersonAlternateEmail || ""}
            onChange={(v) => update("contactPersonAlternateEmail", v)}
          />
        </div>
      </div>
    </FormSection>
  );
}

function ClientStatutoryStep({ data, update, clientType }) {
  const fields =
    clientType === "Enterprise"
      ? [
          "PAN",
          "GST Status",
          "GSTIN",
          "TAN",
          "CIN / LLPIN",
          "MSME Status",
          "Udyam Number",
          "Registration Verification",
        ]
      : [
          "PAN",
          "GST Status",
          "GSTIN",
          "TAN",
          "CIN",
          "GST / PAN Verification Status",
          "Other Registration",
        ];
  return (
    <DynamicFields
      title="Statutory Details"
      fields={fields}
      data={data}
      update={update}
      user={{}}
    />
  );
}
function ClientAuthorizedUserStep({ user, data, update, config }) {
  return (
    <FormSection title="Primary Authorized User">
      <div className="wf-grid">
        <WFInput label="User ID" value={user.userId} readOnly />
        <WFInput label="First Name" value={data.firstName || ""} readOnly />
        <WFInput label="Middle Name" value={data.middleName || ""} readOnly />
        <WFInput label="Last Name" value={data.lastName || ""} readOnly />
        <WFInput label="Designation" value={data.designation || ""} readOnly />
        <WFInput
          label="Employee / Officer ID"
          value={data.employeeId || ""}
          onChange={(v) => update("employeeId", v)}
        />
        {config.hierarchy.map((label) => (
          <WFInput
            key={label}
            label={label}
            value={data[`user${label}`] || ""}
            onChange={(v) => update(`user${label}`, v)}
          />
        ))}
        <WFInput label="Registered Mobile" value={user.mobile} readOnly />
        <WFInput label="Registered Email" value={user.email} readOnly />
        <WFInput
          label="Procurement Responsibility"
          value={data.responsibility || ""}
          onChange={(v) => update("responsibility", v)}
        />
      </div>
    </FormSection>
  );
}

function ClientWizard({ user, navigate }) {
  const saved = accountService.get(user.userId),
    [step, setStep] = useState(saved?.currentStep || 0),
    [data, setData] = useState(
      saved?.data || {
        clientType: user.clientType,
        organizationName: user.organizationName,
        officialEmail: user.email,
        officialContact: user.mobile,
        country: "India",
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ").slice(-1)[0],
        designation: user.designation,
        registeredMobile: user.mobile,
        registeredEmail: user.email,
        modules: [],
        offices: [{}],
        documents: [],
        declaration: false,
      },
    );
  const update = (name, value) => setField(setData, name, value);
  const save = () => accountService.saveDraft(user.userId, data, step);
  const next = () => {
    save();
    setStep(Math.min(step + 1, clientSteps.length - 1));
  };
  const submit = () => {
    if (!data.declaration || !data.modules?.length) return;
    accountService.saveDraft(user.userId, data, step);
    accountService.submitClient(user.userId, data);
    navigate("/dashboard");
  };
  return (
    <WizardShell
      title="Complete Your Client Account Setup"
      text="Save at any step—your draft survives refresh and future login."
      steps={clientSteps}
      step={step}
      setStep={setStep}
      onSave={save}
      onNext={next}
      onSubmit={submit}
    >
      {step === 0 && (
        <FormSection title="Organization">
          <div className="wf-grid">
            <WFInput label="Client Type" value={data.clientType} readOnly />
            <WFInput
              label="Organization Full Name"
              value={data.organizationName}
              readOnly
            />
            <WFInput
              label="Organization Short Name"
              value={data.shortName || ""}
              onChange={(v) => update("shortName", v)}
            />
            <WFInput
              label="Organization Category"
              value={data.category || ""}
              onChange={(v) => update("category", v)}
            />
            <WFSelect
              label="Legal Status *"
              value={data.legalStatus || ""}
              onChange={(v) => update("legalStatus", v)}
              options={legalStatusOptions}
            />
            <WFInput
              label="Parent Department / Group"
              value={data.parent || ""}
              onChange={(v) => update("parent", v)}
            />
            <WFInput
              label="Website"
              value={data.website || ""}
              onChange={(v) => update("website", v)}
            />
            <WFInput
              label="Official Email"
              value={data.officialEmail || ""}
              onChange={(v) => update("officialEmail", v)}
            />
            <WFInput
              label="Address Line 1"
              value={data.address1 || ""}
              onChange={(v) => update("address1", v)}
            />
            <WFInput label="Country" value={data.country || "India"} readOnly />
            <WFSelect
              label="State"
              value={data.state || ""}
              onChange={(v) => {
                update("state", v);
                update("district", "");
              }}
              options={Object.keys(districtsByState)}
            />
            <WFSelect
              label="District"
              value={data.district || ""}
              onChange={(v) => update("district", v)}
              options={districtsByState[data.state] || []}
            />
            <WFInput
              label="PIN Code"
              value={data.pin || ""}
              onChange={(v) => update("pin", v)}
            />
          </div>
          <div className="contact-person-section">
            <h3>Contact Person</h3>
            <p>Primary contact person for organization communication.</p>
            <div className="wf-grid">
              <WFInput
                label="Contact Person Name *"
                value={data.contactPersonName || ""}
                onChange={(v) => update("contactPersonName", v)}
              />
              <WFInput
                label="Designation *"
                value={data.contactPersonDesignation || ""}
                onChange={(v) => update("contactPersonDesignation", v)}
              />
              <WFInput
                label="Contact Number *"
                value={data.contactPersonMobile || ""}
                onChange={(v) => update("contactPersonMobile", v)}
              />
              <WFInput
                label="Email Address *"
                type="email"
                value={data.contactPersonEmail || ""}
                onChange={(v) => update("contactPersonEmail", v)}
              />
            </div>
          </div>
        </FormSection>
      )}
      {step === 1 && (
        <FormSection title="Statutory Details">
          <div className="wf-grid">
            <WFInput
              label="PAN Number"
              value={data.pan || ""}
              onChange={(v) => update("pan", v)}
            />
            <WFSelect
              label="PAN Verification"
              value={data.panStatus || ""}
              onChange={(v) => update("panStatus", v)}
              options={["Not Verified", "Mock Verified"]}
            />
            <WFSelect
              label="GST Status"
              value={data.gstStatus || ""}
              onChange={(v) => update("gstStatus", v)}
              options={["Applicable", "Not Applicable"]}
            />
            <WFInput
              label="GSTIN"
              value={data.gstin || ""}
              onChange={(v) => update("gstin", v)}
            />
            <WFInput
              label="TAN Number"
              value={data.tan || ""}
              onChange={(v) => update("tan", v)}
            />
            <WFInput
              label="CIN / Registration Number"
              value={data.cin || ""}
              onChange={(v) => update("cin", v)}
            />
          </div>
        </FormSection>
      )}
      {step === 2 && (
        <Repeatable
          title="Office / Business Units"
          items={data.offices}
          setItems={(v) => update("offices", v)}
          fields={[
            "Office / Unit Type",
            "Office / Unit Name",
            "Full Address",
            "State",
            "District",
            "City",
            "PIN Code",
            "Contact Number",
            "Office Email",
            "GSTIN",
          ]}
        />
      )}{" "}
      {step === 3 && (
        <FormSection title="Authorized User">
          <div className="wf-grid">
            <WFInput label="User ID" value={user.userId} readOnly />
            <WFInput
              label="Authorized Person"
              value={user.displayName}
              readOnly
            />
            <WFInput
              label="Designation"
              value={user.designation || ""}
              readOnly
            />
            <WFInput
              label="Employee / Officer ID"
              value={data.employeeId || ""}
              onChange={(v) => update("employeeId", v)}
            />
            <WFInput label="Registered Mobile" value={user.mobile} readOnly />
            <WFInput label="Registered Email" value={user.email} readOnly />
            <WFInput
              label="Alternate Email"
              value={data.alternateEmail || ""}
              onChange={(v) => update("alternateEmail", v)}
            />
            <WFInput
              label="Procurement Responsibility"
              value={data.responsibility || ""}
              onChange={(v) => update("responsibility", v)}
            />
          </div>
        </FormSection>
      )}
      {step === 4 && (
        <CardSelect
          title="Requested Procurement Modules"
          values={data.modules || []}
          options={modules}
          onChange={(v) => update("modules", v)}
        />
      )}{" "}
      {step === 5 && (
        <FormSection title="Systems & Integration">
          <div className="wf-grid">
            <WFSelect
              label="Existing ERP"
              value={data.erp || ""}
              onChange={(v) => update("erp", v)}
              options={[
                "None",
                "SAP ECC",
                "SAP S/4HANA",
                "Oracle ERP",
                "Tally",
                "Microsoft Dynamics",
                "Custom ERP",
              ]}
            />
            <WFInput
              label="ERP Version"
              value={data.erpVersion || ""}
              onChange={(v) => update("erpVersion", v)}
            />
            <WFInput
              label="Finance / Accounts System"
              value={data.financeSystem || ""}
              onChange={(v) => update("financeSystem", v)}
            />
            <WFSelect
              label="Integration Required"
              value={data.integrationRequired || "No"}
              onChange={(v) => update("integrationRequired", v)}
              options={["No", "Yes"]}
            />
            <WFSelect
              label="Integration Direction"
              value={data.integrationDirection || ""}
              onChange={(v) => update("integrationDirection", v)}
              options={["Incoming", "Outgoing", "Bi-directional"]}
            />
            <WFSelect
              label="Available Method"
              value={data.integrationMethod || ""}
              onChange={(v) => update("integrationMethod", v)}
              options={[
                "REST API",
                "SOAP",
                "SFTP",
                "File",
                "Middleware",
                "Other",
              ]}
            />
            <WFInput
              label="Technical Contact Name"
              value={data.technicalContact || ""}
              onChange={(v) => update("technicalContact", v)}
            />
            <WFInput
              label="Technical Contact Email"
              value={data.technicalEmail || ""}
              onChange={(v) => update("technicalEmail", v)}
            />
          </div>
          <p className="wf-note">
            Do not enter passwords, secrets, API keys or production credentials.
          </p>
        </FormSection>
      )}
      {step === 6 && (
        <FormSection title="Authentication & Security">
          <div className="wf-grid">
            <WFSelect
              label="DSC Available"
              value={data.dscAvailable || "No"}
              onChange={(v) => update("dscAvailable", v)}
              options={["No", "Yes"]}
            />
            <WFSelect
              label="DSC Requirement"
              value={data.dscRequirement || ""}
              onChange={(v) => update("dscRequirement", v)}
              options={[
                "Login",
                "Tender Approval",
                "Tender Publishing",
                "Tender Opening",
                "Document Signing",
              ]}
            />
            <WFInput
              label="DSC Holder Name"
              value={data.dscHolder || ""}
              onChange={(v) => update("dscHolder", v)}
            />
            <WFInput
              label="Certificate Issuer"
              value={data.certificateIssuer || ""}
              onChange={(v) => update("certificateIssuer", v)}
            />
            <WFSelect
              label="Corporate SSO Required"
              value={data.ssoRequired || "No"}
              onChange={(v) => update("ssoRequired", v)}
              options={["No", "Yes"]}
            />
            <WFInput
              label="SSO Provider"
              value={data.ssoProvider || ""}
              onChange={(v) => update("ssoProvider", v)}
            />
          </div>
        </FormSection>
      )}
      {step === 7 && (
        <DocumentUpload
          documents={data.documents || []}
          onChange={(v) => update("documents", v)}
          types={[
            "Authorization Letter",
            "Organization / Department Proof",
            "Registration Certificate",
            "PAN Document",
            "GST Certificate",
            "Authorized Person Proof",
          ]}
        />
      )}{" "}
      {step === 8 && (
        <ReviewData
          data={data}
          user={user}
          onDeclaration={(v) => update("declaration", v)}
        />
      )}
    </WizardShell>
  );
}

function BidderWizard({ user, navigate }) {
  const saved = accountService.get(user.userId),
    [step, setStep] = useState(saved?.currentStep || 0),
    [data, setData] = useState(
      saved?.data || {
        companyName: user.organizationName,
        person: user.displayName,
        mobile: user.mobile,
        email: user.email,
        financialYears: [{}],
        experience: [{}],
        documents: [],
        packageId: "PKG-1Y",
      },
    );
  const update = (n, v) => setField(setData, n, v);
  const save = () => accountService.saveDraft(user.userId, data, step);
  const next = () => {
    save();
    setStep(Math.min(step + 1, bidderSteps.length - 1));
  };
  const pay = (status) => {
    accountService.activateBidder(user.userId, data, data.packageId, status);
    navigate("/dashboard");
  };
  const simpleFields = {
    0: [
      "Authorized Person",
      "Designation",
      "Registered Mobile",
      "Registered Email",
      "Alternate Email",
      "Authorized Person Address",
    ],
    1: [
      "Company Full Name",
      "Company Type",
      "Legal Status",
      "Type of Business",
      "Company Phone",
      "Company Email",
      "Website",
      "Registration No. / CIN / LLPIN",
    ],
    2: [
      "Registered Address",
      "Country",
      "State",
      "District",
      "City",
      "PIN Code",
      "Communication Address",
    ],
    3: [
      "PAN",
      "GST Status",
      "GSTIN",
      "MSME Status",
      "Udyam Registration Number",
      "TAN",
    ],
    4: [
      "IFSC",
      "Bank Name",
      "Branch / Address",
      "Account Holder Name",
      "Account Type",
      "Account Number",
      "Confirm Account Number",
    ],
    6: [
      "Sector",
      "Product / Service Category",
      "Sub-category",
      "Preferred State",
      "Preferred District",
      "Preferred Tender Value Range",
    ],
    8: [
      "DSC Available",
      "Certificate Type",
      "DSC Holder Name / Subject DN",
      "Certificate Issuer",
      "Certificate Serial Number",
      "Issue Date",
      "Expiry Date",
      "Thumbprint",
    ],
  };
  return (
    <WizardShell
      title="Complete Your Bidder Account Setup"
      text="Profile, package, payment and activation in one saved workflow."
      steps={bidderSteps}
      step={step}
      setStep={setStep}
      onSave={save}
      onNext={next}
      submitLabel="Pay & Activate"
    >
      {simpleFields[step] && (
        <DynamicFields
          title={bidderSteps[step]}
          fields={simpleFields[step]}
          data={data}
          update={update}
          user={user}
        />
      )}{" "}
      {step === 5 && (
        <Repeatable
          title="Financial Years"
          items={data.financialYears}
          setItems={(v) => update("financialYears", v)}
          fields={[
            "Financial Year",
            "Annual Turnover",
            "Turnover Certificate",
            "Balance Sheet",
            "Profit & Loss",
          ]}
        />
      )}{" "}
      {step === 7 && (
        <Repeatable
          title="Work Experience"
          items={data.experience}
          setItems={(v) => update("experience", v)}
          fields={[
            "PO / Work Order Number",
            "PO / Work Order Date",
            "Project Details",
            "Client / Company Name",
            "Contract / PO Value",
            "Completion Status",
          ]}
        />
      )}{" "}
      {step === 9 && (
        <DocumentUpload
          documents={data.documents}
          onChange={(v) => update("documents", v)}
          types={[
            "PAN Document",
            "GST Certificate",
            "Cancelled Cheque",
            "Authorized Person Proof",
            "Supporting Documents",
          ]}
        />
      )}{" "}
      {step === 10 && <ReviewData data={data} user={user} />}{" "}
      {step === 11 && (
        <PackageCards
          value={data.packageId}
          onChange={(v) => update("packageId", v)}
        />
      )}{" "}
      {step === 12 && <PaymentPanel packageId={data.packageId} onPay={pay} />}
    </WizardShell>
  );
}

function OrganizationHierarchy({ user, account }) {
  const data = account?.data || {};
  const config =
    clientTypeConfig[user.clientType] || clientTypeConfig.Government;
  const groups =
    user.clientType === "Government"
      ? [
          ["Departments", data.departments],
          ["Sub-Departments", data.subDepartments],
          ["Offices / Divisions / Circles", data.offices],
        ]
      : user.clientType === "PSU"
        ? [
            ["Departments / Functions", data.departments],
            ["Business Units / Plants", data.businessUnits],
            ["Locations", data.offices],
          ]
        : [
            ["Business Units / Divisions", data.businessUnits],
            ["Plants / Branches / Locations", data.offices],
          ];
  return (
    <section>
      <div className="dashboard-title">
        <div>
          <h1>{user.clientType} Organization Hierarchy</h1>
          <p>{config.hierarchy.join(" → ")} → User</p>
        </div>
      </div>
      <div className="hierarchy-grid">
        {groups.map(([title, records]) => (
          <article key={title}>
            <h2>{title}</h2>
            {(records || [])
              .filter((record) => Object.values(record).some(Boolean))
              .map((record) => (
                <div
                  className="hierarchy-record"
                  key={record.id || JSON.stringify(record)}
                >
                  <strong>
                    {Object.values(record).find(
                      (value) =>
                        typeof value === "string" &&
                        value &&
                        !value.startsWith(title.slice(0, 3).toUpperCase()),
                    ) || "Saved record"}
                  </strong>
                  <small>{record.id || "Legacy record"}</small>
                </div>
              ))}
            {!(records || []).some((record) =>
              Object.values(record).some(Boolean),
            ) && <p>No records captured.</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function UserManagement({ user, account }) {
  const [records, setRecords] = useState(() =>
    organizationAccessService.users(account.id),
  );
  const [form, setForm] = useState({
    userId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    designation: "",
    employeeId: "",
    mobile: "",
    email: "",
    status: "ACTIVE",
    authenticationPolicy: "Password + OTP",
    dscRequired: false,
    scope: {},
  });
  const [message, setMessage] = useState("");
  const config =
    clientTypeConfig[user.clientType] || clientTypeConfig.Government;
  const create = () => {
    const result = organizationAccessService.createUser(account.id, form);
    if (result.error) return setMessage(result.error);
    setRecords(organizationAccessService.users(account.id));
    setMessage("Operational user created successfully.");
    setForm({
      ...form,
      userId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      mobile: "",
    });
  };
  return (
    <section>
      <div className="dashboard-title">
        <div>
          <h1>User Management</h1>
          <p>
            Create operational users under the approved {user.clientType}{" "}
            hierarchy.
          </p>
        </div>
        <span className="wf-status success">{records.length} Users</span>
      </div>
      <div className="management-grid">
        <div className="flow-card">
          <h2>Create User</h2>
          <div className="wf-grid">
            <WFInput
              label="User ID *"
              value={form.userId}
              onChange={(v) => setField(setForm, "userId", v)}
            />
            <WFInput
              label="First Name *"
              value={form.firstName}
              onChange={(v) => setField(setForm, "firstName", v)}
            />
            <WFInput
              label="Middle Name"
              value={form.middleName}
              onChange={(v) => setField(setForm, "middleName", v)}
            />
            <WFInput
              label="Last Name *"
              value={form.lastName}
              onChange={(v) => setField(setForm, "lastName", v)}
            />
            <WFInput
              label="Designation"
              value={form.designation}
              onChange={(v) => setField(setForm, "designation", v)}
            />
            <WFInput
              label="Employee / Officer ID"
              value={form.employeeId}
              onChange={(v) => setField(setForm, "employeeId", v)}
            />
            {config.hierarchy.map((label) => (
              <WFInput
                key={label}
                label={label}
                value={form.scope[label] || ""}
                onChange={(v) =>
                  setForm((old) => ({
                    ...old,
                    scope: { ...old.scope, [label]: v },
                  }))
                }
              />
            ))}
            <WFInput
              label="Mobile Number"
              value={form.mobile}
              onChange={(v) => setField(setForm, "mobile", v)}
            />
            <WFInput
              label="Email ID"
              type="email"
              value={form.email}
              onChange={(v) => setField(setForm, "email", v)}
            />
            <WFSelect
              label="User Status"
              value={form.status}
              onChange={(v) => setField(setForm, "status", v)}
              options={["ACTIVE", "INACTIVE"]}
            />
            <WFSelect
              label="Authentication Policy"
              value={form.authenticationPolicy}
              onChange={(v) => setField(setForm, "authenticationPolicy", v)}
              options={[
                "Password + OTP",
                "Password + OTP + DSC",
                "Corporate SSO + MFA",
              ]}
            />
          </div>
          <label className="wf-check">
            <input
              type="checkbox"
              checked={form.dscRequired}
              onChange={(e) =>
                setField(setForm, "dscRequired", e.target.checked)
              }
            />{" "}
            DSC Required
          </label>
          {message && (
            <p
              className={
                message.includes("successfully") ? "wf-note" : "wf-error"
              }
            >
              {message}
            </p>
          )}
          <button
            className="wf-primary"
            disabled={!form.userId || !form.firstName}
            onClick={create}
          >
            Create User
          </button>
        </div>
        <div className="flow-card">
          <h2>Organization Users</h2>
          {records.map((record) => (
            <article className="user-row" key={record.id}>
              <UserRound />
              <div>
                <strong>
                  {record.firstName} {record.lastName}
                </strong>
                <span>
                  {record.userId} · {record.designation}
                </span>
                <small>
                  {record.email} · {record.status}
                </small>
              </div>
            </article>
          ))}
          {!records.length && <p>No additional operational users created.</p>}
        </div>
      </div>
    </section>
  );
}

function RoleAssignment({ user, account }) {
  const users = organizationAccessService.users(account.id),
    [records, setRecords] = useState(() =>
      organizationAccessService.assignments(account.id),
    );
  const [form, setForm] = useState({
      userId: "",
      module: "",
      roleName: "Procurement Admin",
      permissions: ["VIEW"],
      scope: {},
      dscRequired: false,
      effectiveFrom: "",
      effectiveTo: "",
    }),
    [message, setMessage] = useState("");
  const config =
      clientTypeConfig[user.clientType] || clientTypeConfig.Government,
    activities = [
      "VIEW",
      "CREATE",
      "EDIT",
      "DELETE",
      "SUBMIT",
      "APPROVE",
      "PUBLISH",
      "OPEN",
      "EVALUATE",
      "SIGN",
    ];
  const toggle = (activity) =>
    setField(
      setForm,
      "permissions",
      form.permissions.includes(activity)
        ? form.permissions.filter((x) => x !== activity)
        : [...form.permissions, activity],
    );
  const assign = () => {
    const organizationDsc = account.authenticationPolicy?.dscRequiredForLogin;
    const result = organizationAccessService.assignRole(account.id, {
      ...form,
      dscRequired: organizationDsc || form.dscRequired,
    });
    if (result.error) return setMessage(result.error);
    setRecords(organizationAccessService.assignments(account.id));
    setMessage("Role and rights assigned successfully.");
  };
  return (
    <section>
      <div className="dashboard-title">
        <div>
          <h1>Role & Rights Assignment</h1>
          <p>Only organization-approved modules can be assigned.</p>
        </div>
      </div>
      <div className="management-grid">
        <div className="flow-card">
          <div className="wf-grid">
            <WFSelect
              label="Select User"
              value={form.userId}
              onChange={(v) => setField(setForm, "userId", v)}
              options={users.map((x) => x.userId)}
            />
            <WFSelect
              label="Approved Module"
              value={form.module}
              onChange={(v) => setField(setForm, "module", v)}
              options={account.approvedModules || []}
            />
            <WFSelect
              label="Role Name"
              value={form.roleName}
              onChange={(v) => setField(setForm, "roleName", v)}
              options={[
                "Organization Admin",
                "Procurement Admin",
                "Department Admin",
                "Tender Creator",
                "Tender Approver",
                "Tender Publisher",
                "Tender Opener",
                "Evaluator",
                "Contract User",
                "Report Viewer",
              ]}
            />
            {config.hierarchy.map((label) => (
              <WFInput
                key={label}
                label={`${label} Scope`}
                value={form.scope[label] || ""}
                onChange={(v) =>
                  setForm((old) => ({
                    ...old,
                    scope: { ...old.scope, [label]: v },
                  }))
                }
              />
            ))}
            <WFInput
              label="Effective From"
              type="date"
              value={form.effectiveFrom}
              onChange={(v) => setField(setForm, "effectiveFrom", v)}
            />
            <WFInput
              label="Effective To"
              type="date"
              value={form.effectiveTo}
              onChange={(v) => setField(setForm, "effectiveTo", v)}
            />
          </div>
          <h3>Activity Permissions</h3>
          <div className="permission-grid">
            {activities.map((activity) => (
              <label key={activity}>
                <input
                  type="checkbox"
                  checked={form.permissions.includes(activity)}
                  onChange={() => toggle(activity)}
                />
                {activity}
              </label>
            ))}
          </div>
          <label className="wf-check">
            <input
              type="checkbox"
              checked={
                form.dscRequired ||
                account.authenticationPolicy?.dscRequiredForLogin
              }
              disabled={account.authenticationPolicy?.dscRequiredForLogin}
              onChange={(e) =>
                setField(setForm, "dscRequired", e.target.checked)
              }
            />{" "}
            DSC Required for Assigned Role
          </label>
          {message && (
            <p
              className={
                message.includes("successfully") ? "wf-note" : "wf-error"
              }
            >
              {message}
            </p>
          )}
          <button
            className="wf-primary"
            disabled={!form.userId || !form.module}
            onClick={assign}
          >
            Assign Role
          </button>
        </div>
        <div className="flow-card">
          <h2>Current Assignments</h2>
          {records.map((record) => (
            <article className="user-row" key={record.id}>
              <ShieldCheck />
              <div>
                <strong>
                  {record.userId} · {record.roleName}
                </strong>
                <span>{record.module}</span>
                <small>{record.permissions.join(", ")}</small>
              </div>
            </article>
          ))}
          {!records.length && <p>No roles assigned yet.</p>}
        </div>
      </div>
    </section>
  );
}

function WizardShell({
  title,
  text,
  steps,
  step,
  setStep,
  onSave,
  onNext,
  onSubmit,
  submitLabel = "Submit Account Request",
  children,
}) {
  return (
    <section>
      <div className="dashboard-title">
        <div>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
        <span className="wf-status">Draft saved locally</span>
      </div>
      <div className="wizard-v2">
        <ol>
          {steps.map((s, i) => (
            <li
              key={s}
              className={i === step ? "active" : i < step ? "done" : ""}
              onClick={() => setStep(i)}
            >
              <span>{i < step ? "✓" : i + 1}</span>
              <small>{s}</small>
            </li>
          ))}
        </ol>
        <div className="wizard-body">
          {children}
          <div className="wizard-buttons">
            <button className="wf-secondary" onClick={onSave}>
              Save Draft
            </button>
            {step > 0 && (
              <button
                className="wf-secondary"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft /> Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button className="wf-primary" onClick={onNext}>
                Save & Continue <ChevronRight />
              </button>
            ) : (
              onSubmit && (
                <button className="wf-primary" onClick={onSubmit}>
                  {submitLabel}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function QueryResponse({ user, navigate }) {
  const queries = approvalService.queriesForUser(user.userId),
    open = queries.find((x) => x.status === "OPEN"),
    [response, setResponse] = useState(""),
    [document, setDocument] = useState(null);
  if (!open)
    return (
      <section className="flow-card">
        <h1>No open query</h1>
        <button className="wf-primary" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </section>
    );
  const submit = () => {
    if (!response) return;
    approvalService.respond(open.id, response, document);
    navigate("/dashboard");
  };
  return (
    <section>
      <div className="dashboard-title">
        <div>
          <h1>Respond to Query</h1>
          <p>Provide the requested correction and resubmit for review.</p>
        </div>
      </div>
      <article className="query-v2">
        <span>Action required</span>
        <h2>{open.subject}</h2>
        <p>{open.description}</p>
        <strong>Required correction: {open.requiredCorrection}</strong>
        <small>{new Date(open.queryDate).toLocaleString()}</small>
        <label>
          Reply
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </label>
        <label className="upload-v2">
          Supporting document
          <input
            type="file"
            onChange={(e) => setDocument(fileMeta(e.target.files[0]))}
          />
          {document?.name}
        </label>
        <button className="wf-primary" onClick={submit}>
          Reply & Resubmit
        </button>
      </article>
    </section>
  );
}

export function AdminPortal({ session, navigate, onLogout }) {
  const admin = authServiceV2.current() || session;
  const [module, setModule] = useState("GOG"), [accountOpen, setAccountOpen] = useState(true), [sidebarCollapsed, setSidebarCollapsed] = useState(false), [selectedGog, setSelectedGog] = useState(null), [selectedExisting, setSelectedExisting] = useState(null), [refresh, setRefresh] = useState(0);
  if (admin?.role !== "admin") return <main className="flow-page"><section className="flow-card"><h1>Super Admin authentication required</h1><button className="wf-primary" onClick={() => navigate("/login")}>Admin Login</button></section></main>;
  const logout = () => { authServiceV2.logout(); onLogout(); navigate("/"); };
  const select = (next) => { setModule(next); setSelectedGog(null); setSelectedExisting(null); };
  const title = module === "GOG" ? "GoG Account Creation" : module === "PSU" ? "PSU Account Creation" : module === "ENTERPRISE" ? "Enterprise Account Creation" : module === "MIS" ? "MIS Reports" : "Analysis Dashboard";
  return <div className={`professional-admin ${sidebarCollapsed ? "admin-sidebar-collapsed" : ""}`}>
    <header className="admin-topbar"><div className="portal-brand"><span>(n)</span><strong>Procure <b>2.0</b></strong><small>Administration Console</small></div><button className="admin-sidebar-toggle" onClick={() => setSidebarCollapsed((value) => !value)} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>{sidebarCollapsed ? <PanelLeftOpen/> : <PanelLeftClose/>}</button><div className="admin-header-context"><strong>Government e-Procurement Platform</strong><small>Secure administration workspace</small></div><div className="admin-profile"><div><strong>{admin.displayName}</strong><small>Super Administrator</small></div><span className="admin-avatar">SA</span><button onClick={logout} title="Logout"><LogOut/></button></div></header>
    <aside className="admin-sidebar"><div className="admin-sidebar-title"><small>ADMINISTRATION</small><strong>Control Center</strong></div><nav>
      <button data-label="Analysis Dashboard" className={module === "DASHBOARD" ? "active" : ""} onClick={() => select("DASHBOARD")}><span className="menu-icon"><LayoutDashboard/></span><b>Analysis Dashboard</b></button>
      <button data-label="Account Creation" className={["GOG", "PSU", "ENTERPRISE"].includes(module) ? "active parent" : ""} onClick={() => setAccountOpen((open) => !open)}><span className="menu-icon"><Building2/></span><b>Account Creation</b><ChevronDown className={accountOpen ? "rotate" : ""}/></button>
      {accountOpen && <div className="admin-submenu"><button data-label="GoG Account Creation" className={module === "GOG" ? "active" : ""} onClick={() => select("GOG")}><span>G</span><b>GoG Account Creation</b></button><button data-label="PSU Account Creation" className={module === "PSU" ? "active" : ""} onClick={() => select("PSU")}><span>P</span><b>PSU Account Creation</b></button><button data-label="Enterprise Account Creation" className={module === "ENTERPRISE" ? "active" : ""} onClick={() => select("ENTERPRISE")}><span>E</span><b>Enterprise Account Creation</b></button></div>}
      <button data-label="MIS Reports" className={module === "MIS" ? "active" : ""} onClick={() => select("MIS")}><span className="menu-icon"><FileText/></span><b>MIS Reports</b></button>
    </nav><div className="admin-sidebar-foot"><ShieldCheck/><div><strong>Secure Session</strong><small>Role-based admin access</small></div></div></aside>
    <main className="admin-workspace"><div className="admin-breadcrumb"><span>Administration</span><ChevronRight/><strong>{title}</strong></div>
      {module === "DASHBOARD" ? <AdminAnalysisDashboard/> : module === "MIS" ? <AdminPlaceholder title="MIS Reports" text="Generate and review management reports for account creation, decisions and user activation."/> : module === "GOG" ? <GoGAdminDashboard selected={selectedGog} setSelected={setSelectedGog} refresh={() => setRefresh(refresh + 1)}/> : <ExistingAdminRequests clientType={module === "PSU" ? "PSU" : "Enterprise"} selected={selectedExisting} setSelected={setSelectedExisting} refresh={() => setRefresh(refresh + 1)}/>} 
    </main>
  </div>;
}

function AdminAnalysisDashboard() {
  const gog = governmentRequestService.list(), existing = approvalService.list(), total = gog.length + existing.length, pending = gog.filter((item) => !["ACCOUNT_ACTIVATED", "REJECTED"].includes(item.status)).length, approved = gog.filter((item) => item.status === "ACCOUNT_ACTIVATED").length + existing.filter((item) => item.status === "ACTIVE").length;
  return <section><div className="dashboard-title"><div><h1>Analysis Dashboard</h1><p>Account-creation activity across nProcure editions.</p></div><span className="wf-status success">Live prototype data</span></div><div className="analysis-hero-cards"><article><span><FileText/></span><div><small>Total Applications</small><strong>{total}</strong><p>Across all client editions</p></div></article><article><span><Pencil/></span><div><small>Pending Review</small><strong>{pending}</strong><p>Awaiting admin action</p></div></article><article><span><CheckCircle2/></span><div><small>Accounts Approved</small><strong>{approved}</strong><p>Successfully processed</p></div></article></div><AdminPlaceholder title="Account Creation Analytics" text="Edition-wise trends, turnaround time and approval metrics will appear here as prototype activity grows."/></section>;
}
function AdminPlaceholder({ title, text }) { return <section className="admin-placeholder-3d"><span><FileText/></span><h2>{title}</h2><p>{text}</p></section>; }
function ExistingAdminRequests({ clientType, selected, setSelected, refresh }) {
  const requests = approvalService.list().filter((request) => request.clientType === clientType);
  if (selected) return <AdminReviewV2 request={approvalService.find(selected)} back={() => setSelected(null)} done={() => { refresh(); setSelected(null); }}/>;
  return <section><div className="dashboard-title"><div><h1>{clientType} Account Creation</h1><p>Review account requests submitted through the existing client flow.</p></div><span className="wf-status">{requests.length} requests</span></div><div className="request-list">{!requests.length && <div className="empty-v2"><Search/><h2>No {clientType} requests yet</h2><p>Submitted requests will appear here.</p></div>}{requests.map((request) => <article key={request.id}><div><span className="wf-status">{request.status.replaceAll("_", " ")}</span><h2>{request.organizationName}</h2><p>{request.requestNumber} · {request.clientType}</p></div><div><strong>{request.requestedModules.join(", ") || "No modules selected"}</strong><small>{new Date(request.submittedAt).toLocaleString()}</small></div><button className="wf-primary" onClick={() => setSelected(request.id)}>Review</button></article>)}</div></section>;
}

function LegacyAdminPortal({ session, navigate, onLogout }) {
  const admin = authServiceV2.current() || session,
    [adminModule, setAdminModule] = useState("GOG"),
    [selected, setSelected] = useState(null),
    [selectedGog, setSelectedGog] = useState(null),
    [refresh, setRefresh] = useState(0);
  if (admin?.role !== "admin")
    return (
      <main className="flow-page">
        <section className="flow-card">
          <h1>Super Admin authentication required</h1>
          <button className="wf-primary" onClick={() => navigate("/login")}>
            Admin Login
          </button>
        </section>
      </main>
    );
  const requests = approvalService.list();
  const logout = () => {
    authServiceV2.logout();
    onLogout();
    navigate("/");
  };
  return (
    <div className="admin-v2">
      <header>
        <div className="portal-brand">
          <span>(n)</span>
          <strong>Procure 2.0 · Super Admin</strong>
        </div>
        <button className="wf-secondary" onClick={logout}>
          <LogOut /> Logout
        </button>
      </header>
      <main>
        <div className="admin-module-tabs">
          <button className={adminModule === "GOG" ? "active" : ""} onClick={() => { setAdminModule("GOG"); setSelected(null); }}><Building2/> GoG Account Creation</button>
          <button className={adminModule === "OTHER" ? "active" : ""} onClick={() => { setAdminModule("OTHER"); setSelectedGog(null); }}><FileCheck2/> Existing Client Requests</button>
        </div>
        {adminModule === "GOG" ? <GoGAdminDashboard selected={selectedGog} setSelected={setSelectedGog} refresh={() => setRefresh(refresh + 1)}/> : !selected ? (
          <>
          <div className="dashboard-title"><div><h1>Client Account Requests</h1><p>Review account requests submitted through the existing client flow.</p></div><span className="wf-status">{requests.length} requests</span></div>
          <div className="request-list">
            {requests.length === 0 && (
              <div className="empty-v2">
                <Search />
                <h2>No account requests yet</h2>
                <p>Submit a Client Account wizard to see it here.</p>
              </div>
            )}
            {requests.map((r) => (
              <article key={r.id}>
                <div>
                  <span className="wf-status">
                    {r.status.replaceAll("_", " ")}
                  </span>
                  <h2>{r.organizationName}</h2>
                  <p>
                    {r.requestNumber} · {r.clientType}
                  </p>
                </div>
                <div>
                  <strong>
                    {r.requestedModules.join(", ") || "No modules selected"}
                  </strong>
                  <small>{new Date(r.submittedAt).toLocaleString()}</small>
                </div>
                <button
                  className="wf-primary"
                  onClick={() => setSelected(r.id)}
                >
                  Review
                </button>
              </article>
            ))}
          </div>
          </>
        ) : (
          <AdminReviewV2
            request={approvalService.find(selected)}
            back={() => setSelected(null)}
            done={() => {
              setRefresh(refresh + 1);
              setSelected(null);
            }}
          />
        )}
      </main>
    </div>
  );
}

function GoGAdminDashboard({ selected, setSelected, refresh }) {
  const requests = governmentRequestService.list();
  const pendingStatuses = ["SUBMITTED", "IN_PROGRESS", "PENDING_ADMIN_REVIEW", "UNDER_VERIFICATION", "CONFIGURATION_IN_PROGRESS", "CLARIFICATION_REQUESTED", "CLARIFICATION_REPLY_RECEIVED", "READY_FOR_APPROVAL"];
  const [searchText, setSearchText] = useState(""), [statusFilter, setStatusFilter] = useState("ALL"), [pageSize, setPageSize] = useState(5), [page, setPage] = useState(1);
  if (selected) return <GoGAccountCreation request={governmentRequestService.find(selected)} back={() => setSelected(null)} done={() => { refresh(); setSelected(null); }}/>;
  const count = (status) => requests.filter((request) => status.includes(request.status)).length;
  const normalizedSearch = searchText.trim().toLowerCase();
  const filtered = requests.filter((request) => {
    const statusMatch = statusFilter === "ALL" || (statusFilter === "PENDING" ? pendingStatuses.includes(request.status) : statusFilter === "APPROVED" ? ["APPROVED", "ACCOUNT_ACTIVATED"].includes(request.status) : request.status === statusFilter);
    const searchMatch = !normalizedSearch || [request.requestNumber, request.organizationName, request.applicantName, request.applicantEmail].some((value) => String(value || "").toLowerCase().includes(normalizedSearch));
    return statusMatch && searchMatch;
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)), safePage = Math.min(page, pageCount), visibleRequests = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const applyStatus = (status) => { setStatusFilter(status); setPage(1); };
  const openRequest = (id) => { governmentRequestService.openForAdmin(id); setSelected(id); };
  return <section className="gog-admin-dashboard">
    <div className="dashboard-title"><div><h1>GoG Account Creation</h1><p>Review submitted GoG registration files and create approved client accounts.</p></div><span className="wf-status">{requests.length} request files</span></div>
    <div className="gog-status-cards">
      <button className={statusFilter === "ALL" ? "selected" : ""} onClick={() => applyStatus("ALL")}><span className="status-icon"><FileText/></span><div><small>Total Requests</small><strong>{requests.length}</strong></div></button>
      <button className={`pending ${statusFilter === "PENDING" ? "selected" : ""}`} onClick={() => applyStatus("PENDING")}><span className="status-icon"><Pencil/></span><div><small>My Pending</small><strong>{count(pendingStatuses)}</strong></div></button>
      <button className={`approved ${statusFilter === "APPROVED" ? "selected" : ""}`} onClick={() => applyStatus("APPROVED")}><span className="status-icon"><CheckCircle2/></span><div><small>Approved / Activated</small><strong>{count(["APPROVED", "ACCOUNT_ACTIVATED"])}</strong></div></button>
      <button className={`rejected ${statusFilter === "REJECTED" ? "selected" : ""}`} onClick={() => applyStatus("REJECTED")}><span className="status-icon"><X/></span><div><small>Rejected</small><strong>{count(["REJECTED"])}</strong></div></button>
    </div>
    <div className="flow-card gog-request-files"><div className="section-title-row"><div><span>RF</span><h2>Request File Details</h2></div><span className="active-table-filter">{statusFilter === "ALL" ? "All files" : statusFilter === "PENDING" ? "My Pending" : statusFilter}</span></div><div className="request-table-toolbar"><label className="admin-table-search"><Search/><input value={searchText} onChange={(event) => { setSearchText(event.target.value); setPage(1); }} placeholder="Search request no., department or requestor…"/></label><label className="rows-per-page">Rows per page<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}>{[5,10,15,20,25].map((size) => <option key={size} value={size}>{size}</option>)}</select></label></div><DataTable headers={["Request Number", "Department", "Requestor", "Submitted On", "Status", "Action"]} empty="No matching GoG request files found.">{visibleRequests.map((request) => { const pending = pendingStatuses.includes(request.status); return <tr key={request.id}><td><strong>{request.requestNumber}</strong></td><td>{request.organizationName}</td><td>{request.applicantName}<small>{request.applicantEmail}</small></td><td>{new Date(request.submittedAt).toLocaleString()}</td><td><span className={`wf-status ${request.status === "ACCOUNT_ACTIVATED" ? "success" : ""}`}>{request.status.replaceAll("_", " ")}</span></td><td className="table-actions"><button type="button" title={pending ? "Open account creation" : "View request"} aria-label={pending ? "Open account creation" : "View request"} onClick={() => openRequest(request.id)}>{pending ? <Pencil/> : <Search/>}</button></td></tr>; })}</DataTable><div className="table-pagination"><span>Showing {filtered.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}</span><div><button disabled={safePage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft/> Previous</button><strong>Page {safePage} of {pageCount}</strong><button disabled={safePage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Next <ChevronRight/></button></div></div></div>
  </section>;
}

const gogAdminTabs = ["Client Information", "Department Structure", "Roles & Responsibilities", "User Creation & Access", "Advanced / Security / Integration", "Final Review"];
const gogRoleOptions = ["Indent Creator", "Indent Approver", "Tender Creator", "Tender Approver", "Tender Publisher", "Technical Bid Opener", "Financial Bid Opener", "Technical Evaluator", "Financial Evaluator", "Reverse Auction Administrator", "Award Approver", "Report Viewer", "Organization Admin"];
const gogPermissionOptions = ["View", "Create", "Edit", "Submit", "Query / Send Back", "Approve", "Reject", "Publish", "Bid Open", "Evaluate", "Download", "Export"];
const gogModuleOptions = ["e-Tender", "Auction / e-Auction", "Vendor Management System (VMS)", "Indent Management", "Reports & MIS", "Analytics Dashboard"];
const gogPrivilegeOptions = ["Tender Publishing Authority", "Technical Bid Opening", "Financial Bid Opening", "Evaluation Authority", "Reverse Auction Administration", "Cross-Office Access", "Delegation Authority", "User Administration", "Report Export", "Special Administrative Rights"];
const isMeaningfulGoGIntegration = (item) => Boolean(item?.systemName?.trim() && item?.purpose?.trim() && item?.technicalContact?.trim()) && !(item.systemName === "Configured Integration" && item.purpose === "Account Integration" && item.technicalContact === "Admin");
const credentialId = (source, name, index) => `${(source || "gog").replace(/\W/g, "").toLowerCase().slice(0, 10)}.${name.replace(/\W/g, "").toLowerCase().slice(0, 12) || `user${index + 1}`}`;
const makeGoGAdminConfig = (request) => {
  const submitted = request.submittedData, source = submitted.department.departmentName;
  const designationName = (id) => submitted.designations?.find((item) => item.id === id)?.name || "";
  return { verification: { status: "Pending Verification", remarks: "" }, organization: { name: source, shortName: "", tenantCode: source.replace(/\W/g, "").toUpperCase().slice(0, 12), organizationType: "GoG", administrativeDepartment: "", department: source, officialEmail: submitted.department.email || "", website: submitted.department.departmentSite || "", address: submitted.offices[0]?.address || "", logo: null, effectiveFrom: new Date().toISOString().slice(0,10), status: "Active" }, departmentStructures: submitted.offices.map((office,index) => ({ ...office, id: office.id || `UNIT-${Date.now()}-${index}`, unitType: index ? "Division" : "Department", department: source, division: index ? office.name : "", subDivision: "", unitCode: `UNIT-${String(index+1).padStart(3,"0")}`, parentUnit: index ? submitted.offices[0]?.id || "" : "", officialEmail: office.email || "", contactNumber: office.mobile || "", status: "Active", remarks: "", sourceOfficeId: office.id })), offices: [], roleDefinitions: [], users: [], approvalWorkflow: [], modules: [], moduleDefinitions: gogModuleOptions.map((name) => ({ name, enabled: false, effectiveFrom: "", effectiveTo: "", remarks: "" })), advancedPrivileges: [], security: { primaryAuthentication: "Password + OTP", pkiEnabled: true, dscRequiredForLogin: true, otpEnabled: true, eSignEnabled: false, sessionTimeout: "30", certificateMappingRequired: true, certificateExpiryValidation: true, stageMatrix: ["Login", "Indent Approval", "Tender Approval", "Tender Publishing", "Technical Bid Opening", "Financial Bid Opening", "Award Approval"].map((stage) => ({ stage, otp: stage === "Login", dsc: stage !== "Login", eSign: false })) }, integrationRequired: "No", integrations: [], finalRemarks: "", accountEffectiveFrom: new Date().toISOString().slice(0,10) };
};

const normalizeGoGConfig = (request) => {
  const fresh = makeGoGAdminConfig(request), saved = request.adminConfiguration;
  if (!saved) return fresh;
  const structures = saved.departmentStructures || (saved.offices || []).map((office,index) => ({ ...office, unitType:index?"Division":"Department", department:saved.organization?.department || request.organizationName, division:index?office.name:"", subDivision:"", unitCode:office.officeCode || `UNIT-${index+1}`, parentUnit:office.parentOffice || "", officialEmail:office.email || "", contactNumber:office.mobile || "" }));
  return { ...fresh, ...saved, organization:{...fresh.organization,...saved.organization}, departmentStructures:structures, roleDefinitions:saved.roleDefinitions || [], customRoleMaster:saved.customRoleMaster || [], advancedAuthentication:saved.advancedAuthentication || {}, integrations:(saved.integrations || []).filter(isMeaningfulGoGIntegration), users:(saved.users || []).map((u) => ({...u,moduleAccess:u.moduleAccess || (u.primaryRole ? [{id:`ACC-${u.id}`,module:saved.moduleDefinitions?.find((m)=>m.enabled)?.name || "e-Tender",roleId:"",roleName:u.primaryRole,responsibilities:u.permissions || [],accessScope:"Department Level"}] : [])})) };
};

function GoGAccountCreation({ request, back, done }) {
  const readOnly = ["ACCOUNT_ACTIVATED", "REJECTED"].includes(request.status), [step, setStep] = useState(Math.min(request.currentStep || 0, 5)), [config, setConfig] = useState(() => normalizeGoGConfig(request)), [error, setError] = useState(""), [draftMessage,setDraftMessage]=useState(""), [queryOpen, setQueryOpen] = useState(false), [rejectOpen, setRejectOpen] = useState(false);
  const update = (section, key, value) => setConfig((old) => ({ ...old, [section]: { ...old[section], [key]: value } }));
  const save = (nextStep = step, action = "DRAFT_SAVED") => { governmentRequestService.saveDraft(request.id, config, nextStep, action); setError(""); setDraftMessage(action === "DRAFT_SAVED" ? `Draft saved successfully at ${new Date().toLocaleTimeString()}.` : ""); };
  const continueTo = (next) => { save(next, step === 0 ? "REQUEST_VERIFIED" : "ADMIN_CONFIGURATION_SAVED"); setStep(next); };
  const activeUsers = config.users.filter((user) => user.status === "Active");
  const validationIssues = [!config.organization.department && "Client / Department is required", !config.organization.shortName && "Client Short Name is required", !config.organization.tenantCode && "Client Code is required", !config.departmentStructures.some((unit)=>unit.unitType === "Department" && unit.status === "Active") && "An active Department structure is required", !config.roleDefinitions.some((role)=>role.status === "Active" && role.responsibilities.length) && "At least one active Module-wise Role with Responsibilities is required", !activeUsers.length && "At least one active User is required", activeUsers.some((user)=>!user.department) && "Department is mandatory for every User", activeUsers.some((user)=>!user.displayName || !user.email || !user.mobile || !user.userId || !user.password) && "Every active User requires identity, contact and login details", activeUsers.some((user)=>!user.moduleAccess?.length) && "Every active User requires Module Access", activeUsers.some((user)=>user.moduleAccess?.some((a)=>!a.roleId || !config.roleDefinitions.some((r)=>r.id===a.roleId && r.module===a.module))) && "Every Module Access requires a valid Role from the selected Module", !config.security.primaryAuthentication || !config.security.sessionTimeout ? "Security configuration is incomplete" : false, config.integrationRequired === "Yes" && !config.integrations.some(isMeaningfulGoGIntegration) && "Complete External Integration details are required", request.queryHistory?.some((query) => query.status !== "CLOSED") && "All clarification queries must be closed"].filter(Boolean);
  const activate = () => { if (validationIssues.length) return setError(validationIssues.join(" · ")); const result = governmentRequestService.approve(request.id, { ...config, integrations: config.integrations.filter(isMeaningfulGoGIntegration), modules: config.moduleDefinitions.filter((item) => item.enabled).map((item) => item.name) }); if (result.error) return setError(result.error); done(); };
  return <section className="gog-admin-config"><button className="wf-secondary" onClick={back}><ChevronLeft/> GoG Requests</button><header className="gog-admin-page-head"><div><span>GoG CLIENT ACCOUNT CREATION</span><h1>GoG Client Account Creation – Admin Configuration</h1><p>Client request information is reference-only. Admin configuration below is authoritative.</p></div>{readOnly && <strong>View Mode</strong>}</header><div className="gog-admin-summary"><div><small>Request Number</small><strong>{request.requestNumber}</strong></div><div><small>Department / Organization</small><strong>{request.organizationName}</strong></div><div><small>Request Date</small><strong>{new Date(request.submittedAt).toLocaleDateString()}</strong></div><div><small>Current Status</small><strong>{request.status.replaceAll("_"," ")}</strong></div><div><small>Client Type</small><strong>GoG</strong></div></div>
    <div className="gog-admin-tabs">{gogAdminTabs.map((tab, index) => <button key={tab} className={step === index ? "active" : index < step ? "complete" : ""} onClick={() => setStep(index)}><span>{index < step ? "✓" : index + 1}</span><b>{tab}</b></button>)}</div>
    <div className="gog-admin-tab-panel">
      {step === 0 && <GoGClientTab request={request} config={config} update={update} readOnly={readOnly}/>} {step === 1 && <><GoGDepartmentDetailsCard config={config} setConfig={setConfig} readOnly={readOnly}/><GoGStructureTabPro config={config} setConfig={setConfig} readOnly={readOnly}/></>} {step === 2 && <GoGRolesTab config={config} setConfig={setConfig} readOnly={readOnly}/>} {step === 3 && <GoGUsersTab request={request} config={config} setConfig={setConfig} readOnly={readOnly}/>} {step === 4 && <GoGAdvancedTabPro config={config} setConfig={setConfig} update={update} readOnly={readOnly}/>} {step === 5 && <><GoGClarificationInbox request={request} acceptQuery={(queryId)=>{governmentRequestService.acceptClarification(request.id,queryId);done();}}/><GoGFullReviewTab request={request} config={config} setConfig={setConfig} issues={validationIssues} readOnly={readOnly} acceptQuery={(queryId) => { governmentRequestService.acceptClarification(request.id, queryId); done(); }}/></>} {error && <p className="wf-error">{error}</p>}{draftMessage&&<p className="gog-ready">{draftMessage}</p>}
      {!readOnly && <div className="gog-admin-actions">{step > 0 && <button className="wf-secondary" onClick={() => setStep(step - 1)}><ChevronLeft/> Back</button>}<button className="wf-secondary" onClick={() => save()}>Save Draft</button>{step < 5 ? <button className="wf-primary" onClick={() => continueTo(step + 1)}>Save & Continue<ChevronRight/></button> : <><button className="wf-secondary" onClick={() => setQueryOpen(true)}>Send Query / Clarification</button><button className="wf-danger" onClick={() => setRejectOpen(true)}>Reject Request</button><button className="wf-primary" disabled={validationIssues.length > 0} onClick={activate}>Approve & Activate</button></>}</div>}
    </div>{queryOpen && <GoGQueryModal request={request} close={() => setQueryOpen(false)} sent={() => { setQueryOpen(false); done(); }}/>} {rejectOpen && <GoGRejectModal request={request} close={() => setRejectOpen(false)} rejected={() => { setRejectOpen(false); done(); }}/>}</section>;
}

function GoGClientTab({request,config,update,readOnly}) { const d=request.submittedData; return <div className="gog-admin-tab"><GoGSection title="Request Reference"><div className="gog-read-grid"><article><small>Request Number / Date</small><strong>{request.requestNumber}</strong><p>{new Date(request.submittedAt).toLocaleString()} · {request.status.replaceAll("_"," ")}</p></article><article><small>Authorized Requestor</small><strong>{d.requestor.name}</strong><p>{d.requestor.designation}</p></article><article><small>Registered Contact</small><strong>{d.requestor.email}</strong><p>{d.requestor.mobile}</p></article></div></GoGSection><GoGSection title="Client Information"><p className="gog-reference-note">Client / Department is the operational entity. Government Organization / Vibhag is retained only for classification and reporting.</p><div className="wf-grid"><WFInput label="Government Organization / Vibhag" value={config.organization.administrativeDepartment} onChange={(v)=>update("organization","administrativeDepartment",v)} readOnly={readOnly}/><WFInput label="Client / Department Name" value={config.organization.department} onChange={(v)=>update("organization","department",v)} readOnly={readOnly}/><WFInput label="Client Short Name" value={config.organization.shortName} onChange={(v)=>update("organization","shortName",v)} readOnly={readOnly}/><WFInput label="Client Code" value={config.organization.tenantCode} onChange={(v)=>update("organization","tenantCode",v.toUpperCase())} readOnly={readOnly}/><WFInput label="Client Type" value="GoG" readOnly/><WFInput label="Official Email" value={config.organization.officialEmail} onChange={(v)=>update("organization","officialEmail",v)} readOnly={readOnly}/><WFInput label="Website" value={config.organization.website} onChange={(v)=>update("organization","website",v)} readOnly={readOnly}/><WFInput label="Address" value={config.organization.address} onChange={(v)=>update("organization","address",v)} readOnly={readOnly}/><WFInput label="Account Effective From" type="date" value={config.organization.effectiveFrom} onChange={(v)=>update("organization","effectiveFrom",v)} readOnly={readOnly}/><WFSelect label="Client Status" value={config.organization.status} onChange={(v)=>update("organization","status",v)} options={["Active","Inactive"]}/></div></GoGSection></div>; }

const emptyUnit = (department="") => ({id:`UNIT-${Date.now()}`,unitType:"Department",department,division:"",subDivision:"",unitCode:"",parentUnit:"",address:"",pinCode:"",state:"Gujarat",district:"",city:"",officialEmail:"",contactNumber:"",status:"Active",remarks:""});
function GoGStructureTab({config,setConfig,readOnly}) { const [edit,setEdit]=useState(null); const remove=(id)=>{if(config.users.some((u)=>u.divisionId===id||u.subDivisionId===id))return;setConfig((o)=>({...o,departmentStructures:o.departmentStructures.filter((x)=>x.id!==id)}));}; return <div className="gog-admin-tab"><GoGSection title="Department / Division / Sub-Division Structure"><div className="section-title-row"><p className="gog-reference-note">Use Department → Division → Sub-Division dependency. Referenced units cannot be deleted.</p>{!readOnly&&<button className="wf-primary" onClick={()=>setEdit(emptyUnit(config.organization.department))}><Plus/> Add Department Structure</button>}</div><DataTable headers={["Sr.","Level / Unit Type","Department","Division","Sub-Division","Unit Code","Parent Unit","Email","Status","Actions"]}>{config.departmentStructures.map((u,i)=><tr key={u.id}><td>{i+1}</td><td>{u.unitType}</td><td>{u.department}</td><td>{u.division||"—"}</td><td>{u.subDivision||"—"}</td><td>{u.unitCode}</td><td>{config.departmentStructures.find((x)=>x.id===u.parentUnit)?.subDivision||config.departmentStructures.find((x)=>x.id===u.parentUnit)?.division||config.departmentStructures.find((x)=>x.id===u.parentUnit)?.department||"Root"}</td><td>{u.officialEmail||"—"}</td><td>{u.status}</td><td className="table-actions"><button title="View / Edit" onClick={()=>setEdit({...u,_view:readOnly})}><Pencil/></button>{!readOnly&&<button title="Delete" onClick={()=>remove(u.id)}><Trash2/></button>}</td></tr>)}</DataTable></GoGSection>{edit&&<GoGUnitModal unit={edit} units={config.departmentStructures} close={()=>setEdit(null)} save={(unit)=>{setConfig((o)=>({...o,departmentStructures:o.departmentStructures.some((x)=>x.id===unit.id)?o.departmentStructures.map((x)=>x.id===unit.id?unit:x):[...o.departmentStructures,unit]}));setEdit(null);}}/>}</div>; }
function GoGUnitModal({unit,units,close,save}) { const [f,setF]=useState(unit), set=(k,v)=>setF((o)=>({...o,[k]:v})); const divisions=units.filter((u)=>u.unitType==="Division"&&u.department===f.department); return <EditorModal title={`${units.some((u)=>u.id===f.id)?"Edit":"Add"} Department Structure`} close={close} submit={(e)=>{e.preventDefault();save(f);}} action="Save Structure"><div className="wf-grid"><WFInput label="Department" value={f.department} onChange={(v)=>set("department",v)} required/><WFSelect label="Unit Type" value={f.unitType} onChange={(v)=>setF((o)=>({...o,unitType:v,division:"",subDivision:"",parentUnit:""}))} options={["Department","Division","Sub-Division"]}/>{f.unitType!=="Department"&&<WFInput label="Division" value={f.division} onChange={(v)=>set("division",v)} required/>}{f.unitType==="Sub-Division"&&<WFInput label="Sub-Division" value={f.subDivision} onChange={(v)=>set("subDivision",v)} required/>}<WFInput label="Unit / Office Code" value={f.unitCode} onChange={(v)=>set("unitCode",v)} required/><WFSelect label="Parent Unit" value={f.parentUnit} onChange={(v)=>set("parentUnit",v)} options={units.filter((u)=>u.id!==f.id&&(f.unitType==="Division"?u.unitType==="Department":f.unitType==="Sub-Division"?u.unitType==="Division":false)).map((u)=>u.id)} optionLabels={Object.fromEntries(units.map((u)=>[u.id,u.subDivision||u.division||u.department]))}/><WFInput label="Address" value={f.address} onChange={(v)=>set("address",v)}/><WFInput label="PIN Code" value={f.pinCode} onChange={(v)=>set("pinCode",v)}/><WFInput label="State" value={f.state} onChange={(v)=>set("state",v)}/><WFInput label="District" value={f.district} onChange={(v)=>set("district",v)}/><WFInput label="City / Taluka" value={f.city} onChange={(v)=>set("city",v)}/><WFInput label="Official Email" value={f.officialEmail} onChange={(v)=>set("officialEmail",v)}/><WFInput label="Contact Number" value={f.contactNumber} onChange={(v)=>set("contactNumber",v)}/><WFSelect label="Status" value={f.status} onChange={(v)=>set("status",v)} options={["Active","Inactive"]}/><label className="wf-field editor-full"><span>Remarks</span><textarea value={f.remarks} onChange={(e)=>set("remarks",e.target.value)}/></label></div></EditorModal>; }

function GoGRolesTab({config,setConfig,readOnly}) { const [edit,setEdit]=useState(null); const enabled=config.moduleDefinitions.filter((m)=>m.enabled); return <div className="gog-admin-tab"><GoGSection title="Client Module Master"><p className="gog-reference-note">Only high-level product modules are listed. Tender Creation, Approval, Publishing and Bid Opening are responsibilities—not modules.</p><div className="gog-module-grid">{config.moduleDefinitions.map((m,i)=><article className={m.enabled?"enabled":""} key={m.name}><label><input type="checkbox" disabled={readOnly} checked={m.enabled} onChange={(e)=>setConfig((o)=>({...o,moduleDefinitions:o.moduleDefinitions.map((x,n)=>n===i?{...x,enabled:e.target.checked}:x)}))}/><strong>{m.name}</strong></label></article>)}</div></GoGSection><GoGSection title="Module-wise Role & Responsibility Definition"><div className="section-title-row"><p>Roles are defined once at Client + Module level and can be assigned to multiple Users.</p>{!readOnly&&<button className="wf-primary" disabled={!enabled.length} onClick={()=>setEdit({id:`ROLE-${Date.now()}`,module:enabled[0]?.name||"",roleName:"",description:"",responsibilities:[],status:"Active",effectiveFrom:new Date().toISOString().slice(0,10),effectiveTo:""})}><Plus/> Add Role</button>}</div><DataTable headers={["Sr.","Module","Role Name","Responsibility Summary","Status","Actions"]}>{config.roleDefinitions.map((r,i)=><tr key={r.id}><td>{i+1}</td><td>{r.module}</td><td>{r.roleName}</td><td>{r.responsibilities.join(", ")}</td><td>{r.status}</td><td className="table-actions"><button onClick={()=>setEdit({...r,_view:readOnly})}><Pencil/></button>{!readOnly&&<button onClick={()=>setConfig((o)=>({...o,roleDefinitions:o.roleDefinitions.filter((x)=>x.id!==r.id)}))}><Trash2/></button>}</td></tr>)}</DataTable></GoGSection>{edit&&<GoGRoleModal role={edit} modules={enabled.map((m)=>m.name)} close={()=>setEdit(null)} save={(r)=>{setConfig((o)=>({...o,roleDefinitions:o.roleDefinitions.some((x)=>x.id===r.id)?o.roleDefinitions.map((x)=>x.id===r.id?r:x):[...o.roleDefinitions,r]}));setEdit(null);}}/>}</div>; }
function GoGRoleModal({role,modules,close,save}) { const [f,setF]=useState(role), [newRole,setNewRole]=useState(""), toggle=(p)=>setF((o)=>({...o,responsibilities:o.responsibilities.includes(p)?o.responsibilities.filter((x)=>x!==p):[...o.responsibilities,p]})); const roleName=newRole.trim()||f.roleName; return <EditorModal title="Add / Edit Module Role" close={close} submit={(e)=>{e.preventDefault();if(roleName)save({...f,roleName,addedToRoleMaster:Boolean(newRole.trim())});}} action="Save Role"><div className="wf-grid"><WFSelect label="Module" value={f.module} onChange={(v)=>setF({...f,module:v})} options={modules}/><WFSelect label="Role Name from Role Master" value={f.roleName} onChange={(v)=>{setF({...f,roleName:v});setNewRole("");}} options={gogRoleOptions}/><WFInput label="Add New Role Name" value={newRole} onChange={(v)=>{setNewRole(v);if(v)setF({...f,roleName:""});}} hint="New role is added to this GoG Client Role Master when saved."/><WFInput label="Role Description" value={f.description} onChange={(v)=>setF({...f,description:v})}/><WFSelect label="Status" value={f.status} onChange={(v)=>setF({...f,status:v})} options={["Active","Inactive"]}/><WFInput label="Effective From" type="date" value={f.effectiveFrom} onChange={(v)=>setF({...f,effectiveFrom:v})}/><WFInput label="Effective To" type="date" value={f.effectiveTo} onChange={(v)=>setF({...f,effectiveTo:v})}/></div><div className="gog-permission-matrix">{gogPermissionOptions.map((p)=><label key={p}><input type="checkbox" checked={f.responsibilities.includes(p)} onChange={()=>toggle(p)}/>{p}</label>)}</div></EditorModal>; }

const emptyAdminUser=(department="")=>({id:`ADMUSR-${Date.now()}`,firstName:"",middleName:"",lastName:"",displayName:"",designation:"",employeeCode:"",email:"",mobile:"",userId:"",password:"Temp@123",effectiveFrom:new Date().toISOString().slice(0,10),effectiveTo:"",status:"Active",department,divisionId:"",subDivisionId:"",moduleAccess:[],scope:{department}});
function GoGUsersTab({request,config,setConfig,readOnly}) { const [edit,setEdit]=useState(null); return <div className="gog-admin-tab"><GoGSection title="User Creation & Access Assignment"><div className="section-title-row"><p className="gog-reference-note">Create and review each complete User—including organizational mapping and all module access—in one popup.</p>{!readOnly&&<button className="wf-primary" onClick={()=>setEdit(emptyAdminUser(config.organization.department))}><Plus/> Add User</button>}</div><DataTable headers={["Sr.","User Name","Designation","Department","Division","Sub-Division","Assigned Module(s)","Assigned Role(s)","Status","Actions"]}>{config.users.map((u,i)=><tr key={u.id}><td>{i+1}</td><td>{u.displayName}<small>{u.userId}</small></td><td>{u.designation}</td><td>{u.department}</td><td>{config.departmentStructures.find((x)=>x.id===u.divisionId)?.division||"N/A"}</td><td>{config.departmentStructures.find((x)=>x.id===u.subDivisionId)?.subDivision||"N/A"}</td><td>{u.moduleAccess?.map((a)=>a.module).join(", ")||"—"}</td><td>{u.moduleAccess?.map((a)=>a.roleName).join(", ")||"—"}</td><td>{u.status}</td><td className="table-actions"><button onClick={()=>setEdit({...u,_view:readOnly})}><Pencil/></button>{!readOnly&&<button onClick={()=>setConfig((o)=>({...o,users:o.users.filter((x)=>x.id!==u.id)}))}><Trash2/></button>}</td></tr>)}</DataTable></GoGSection>{edit&&<GoGUserModal request={request} user={edit} config={config} close={()=>setEdit(null)} save={(u)=>{setConfig((o)=>({...o,users:o.users.some((x)=>x.id===u.id)?o.users.map((x)=>x.id===u.id?u:x):[...o.users,u]}));setEdit(null);}}/>}</div>; }
function GoGUserModal({request,user,config,close,save}) { const [f,setF]=useState(user), [access,setAccess]=useState(null), set=(k,v)=>setF((o)=>({...o,[k]:v})); const divisions=config.departmentStructures.filter((u)=>u.unitType==="Division"&&u.department===f.department), subs=config.departmentStructures.filter((u)=>u.unitType==="Sub-Division"&&(!f.divisionId||u.parentUnit===f.divisionId||u.division===divisions.find((d)=>d.id===f.divisionId)?.division)); const roles=access?config.roleDefinitions.filter((r)=>r.module===access.module&&r.status==="Active"):[]; const proposed=request.submittedData.proposedUsers||[]; const reuse=(id)=>{const p=proposed.find((x)=>x.id===id);if(p)setF((o)=>({...o,firstName:p.officerName?.split(" ")[0]||"",lastName:p.officerName?.split(" ").slice(1).join(" ")||"",displayName:p.officerName,email:p.email,mobile:p.mobile,designation:request.submittedData.designations.find((d)=>d.id===p.designationId)?.name||"",userId:credentialId(config.organization.department,p.officerName,0)}));}; const saveAccess=()=>{const role=config.roleDefinitions.find((r)=>r.id===access.roleId);if(!role)return;const row={...access,roleName:role.roleName,responsibilities:role.responsibilities};setF((o)=>({...o,moduleAccess:o.moduleAccess.some((a)=>a.id===row.id)?o.moduleAccess.map((a)=>a.id===row.id?row:a):[...o.moduleAccess,row]}));setAccess(null);}; return <EditorModal title="Complete User Configuration" close={close} submit={(e)=>{e.preventDefault();save({...f,displayName:f.displayName||[f.firstName,f.middleName,f.lastName].filter(Boolean).join(" "),primaryRole:f.moduleAccess[0]?.roleName||"",permissions:[...new Set(f.moduleAccess.flatMap((a)=>a.responsibilities))],scope:{department:f.department,divisionId:f.divisionId,subDivisionId:f.subDivisionId}});}} action="Save User"><GoGSection title="1. User Basic Information"><WFSelect label="Reuse Proposed User (optional)" value="" onChange={reuse} options={proposed.map((p)=>p.id)} optionLabels={Object.fromEntries(proposed.map((p)=>[p.id,p.officerName]))}/><div className="wf-grid"><WFInput label="First Name" value={f.firstName} onChange={(v)=>set("firstName",v)} required/><WFInput label="Middle Name" value={f.middleName} onChange={(v)=>set("middleName",v)}/><WFInput label="Last Name" value={f.lastName} onChange={(v)=>set("lastName",v)}/><WFInput label="Designation" value={f.designation} onChange={(v)=>set("designation",v)}/><WFInput label="Employee / Officer Code" value={f.employeeCode} onChange={(v)=>set("employeeCode",v)}/><WFInput label="Official Email" value={f.email} onChange={(v)=>set("email",v)} required/><WFInput label="Mobile Number" value={f.mobile} onChange={(v)=>set("mobile",v)} required/><WFInput label="Login / User ID" value={f.userId} onChange={(v)=>set("userId",v)} required/><WFInput label="Effective From" type="date" value={f.effectiveFrom} onChange={(v)=>set("effectiveFrom",v)}/><WFInput label="Effective To" type="date" value={f.effectiveTo} onChange={(v)=>set("effectiveTo",v)}/><WFSelect label="User Status" value={f.status} onChange={(v)=>set("status",v)} options={["Active","Inactive"]}/></div></GoGSection><GoGSection title="2. Department / Organizational Mapping"><div className="wf-grid"><WFInput label="Department" value={f.department} onChange={(v)=>set("department",v)} required/><WFSelect label="Division" value={f.divisionId} onChange={(v)=>setF((o)=>({...o,divisionId:v,subDivisionId:""}))} options={divisions.map((u)=>u.id)} optionLabels={Object.fromEntries(divisions.map((u)=>[u.id,u.division]))}/><WFSelect label="Sub-Division" value={f.subDivisionId} onChange={(v)=>set("subDivisionId",v)} options={subs.map((u)=>u.id)} optionLabels={Object.fromEntries(subs.map((u)=>[u.id,u.subDivision]))}/></div></GoGSection><GoGSection title="3–4. Module-wise Role Assignment & Access Scope"><DataTable headers={["Module","Assigned Role","Responsibilities (read-only)","Access Scope","Action"]}>{f.moduleAccess.map((a)=><tr key={a.id}><td>{a.module}</td><td>{a.roleName}</td><td>{a.responsibilities.join(", ")}</td><td>{a.accessScope}</td><td className="table-actions"><button type="button" onClick={()=>setAccess({...a})}><Pencil/></button><button type="button" onClick={()=>setF((o)=>({...o,moduleAccess:o.moduleAccess.filter((x)=>x.id!==a.id)}))}><Trash2/></button></td></tr>)}</DataTable><button type="button" className="wf-secondary" onClick={()=>setAccess({id:`ACC-${Date.now()}`,module:"",roleId:"",accessScope:f.subDivisionId?"Sub-Division Level":f.divisionId?"Division Level":"Department Level"})}><Plus/> Add Module Access</button>{access&&<div className="gog-inline-access"><WFSelect label="Module" value={access.module} onChange={(v)=>setAccess({...access,module:v,roleId:""})} options={config.moduleDefinitions.filter((m)=>m.enabled).map((m)=>m.name)}/><WFSelect label="Role" value={access.roleId} onChange={(v)=>setAccess({...access,roleId:v})} options={roles.map((r)=>r.id)} optionLabels={Object.fromEntries(roles.map((r)=>[r.id,r.roleName]))}/><WFSelect label="Access Scope" value={access.accessScope} onChange={(v)=>setAccess({...access,accessScope:v})} options={["Department Level","Division Level","Sub-Division Level"]}/><button type="button" className="wf-primary" onClick={saveAccess}>Apply Access</button></div>}</GoGSection><GoGSection title="5. User Review"><div className="gog-user-review"><strong>{f.displayName||[f.firstName,f.middleName,f.lastName].filter(Boolean).join(" ")||"New User"}</strong><span>{f.designation||"Designation pending"} · {f.department}</span><span>{f.moduleAccess.map((a)=>`${a.module} → ${a.roleName}`).join(" | ")||"Module access pending"}</span></div></GoGSection></EditorModal>; }

function GoGVerificationTab({ request, config, setConfig, update }) { const data = request.submittedData, designationName = (id) => data.designations.find((item) => item.id === id)?.name || ""; return <div className="gog-admin-tab"><GoGSection title="Request & Authorized Requestor"><div className="gog-read-grid"><article><small>Request Number / Date</small><strong>{request.requestNumber}</strong><p>{new Date(request.submittedAt).toLocaleString()} · GoG</p></article><article><small>Authorized Requestor</small><strong>{data.requestor.name}</strong><p>{data.requestor.designation} · {data.requestor.email} · {data.requestor.mobile}</p></article><article><small>Department / Organization</small><strong>{data.department.departmentName}</strong><p>{data.department.departmentSite || "No website"} · {data.department.email}</p></article></div></GoGSection><GoGSection title="Submitted Office / Division / Circle Details"><DataTable headers={["Type","Office","Address","PIN / Location","Contact","Tax Details","Verify"]}>{data.offices.map((office,index) => <tr key={office.id}><td>{office.type === "Other" ? office.otherType : office.type}</td><td>{office.name}</td><td>{office.address}</td><td>{office.pinCode}<small>{office.city}, {office.district}, {office.state}</small></td><td>{office.mobile}<small>{office.email}<br/>{office.accountsEmail}</small></td><td>TAN: {office.tanApplicable}{office.tan && ` · ${office.tan}`}<small>GST: {office.gstApplicable}{office.gst && ` · ${office.gst}`}</small></td><td><input type="checkbox" checked={config.offices[index]?.verified || false} onChange={(event) => setConfig((old) => ({ ...old, offices: old.offices.map((item,i) => i === index ? { ...item, verified: event.target.checked } : item) }))}/></td></tr>)}</DataTable></GoGSection><GoGSection title="Submitted Designations – Reference Only"><p className="gog-reference-note">Submitted designation information is for reference only. Final user hierarchy and approval workflow will be defined by nProcure Admin.</p><div className="gog-chip-list">{data.designations.map((item) => <span key={item.id}>{item.name}</span>)}</div></GoGSection><GoGSection title="Proposed Users – Reference Only"><p className="gog-reference-note">Proposed User, Rights and Next Approver information are for reference only. Final User, Role, Rights and Approval Workflow will be configured by Admin.</p><DataTable headers={["Officer","Office","Designation","Contact","Proposed Rights","Proposed Next Approver","Remarks"]}>{data.proposedUsers.map((user) => <tr key={user.id}><td>{user.officerName}</td><td>{data.offices.find((item) => item.id === user.officeId)?.name}</td><td>{designationName(user.designationId)}</td><td>{user.email}<small>{user.mobile}</small></td><td>{user.rights}</td><td>{user.nextApprover === "Self" ? "Self" : designationName(user.nextApprover)}</td><td>{user.remarks || "—"}</td></tr>)}</DataTable></GoGSection><GoGSection title="Admin Verification"><div className="wf-grid"><WFSelect label="Verification Status" value={config.verification.status} onChange={(value) => update("verification","status",value)} options={["Pending Verification","Verified"]}/><label className="wf-field"><span>Verification Remarks</span><textarea value={config.verification.remarks} onChange={(event) => update("verification","remarks",event.target.value)}/></label></div></GoGSection></div>; }

function GoGOrganizationTab({ submitted, config, setConfig, update, readOnly }) { const changeOffice = (index,key,value) => setConfig((old) => ({ ...old, offices: old.offices.map((item,i) => i === index ? { ...item,[key]:value } : item) })); const changeUser = (index,key,value) => setConfig((old) => ({ ...old, users: old.users.map((item,i) => i === index ? { ...item,[key]:value } : item) })); return <div className="gog-admin-tab"><GoGSection title="Organization Setup"><div className="wf-grid"><WFInput label="Client / Organization Name" value={config.organization.name} readOnly/><WFInput label="Client Short Name" value={config.organization.shortName} onChange={(v) => update("organization","shortName",v)} readOnly={readOnly}/><WFInput label="Client / Tenant Code" value={config.organization.tenantCode} onChange={(v) => update("organization","tenantCode",v.toUpperCase())} readOnly={readOnly}/><WFSelect label="Organization Type" value={config.organization.organizationType} onChange={(v) => update("organization","organizationType",v)} options={["Government Department","Board / Corporation","Local Body","Other"]}/><WFInput label="Administrative Department" value={config.organization.administrativeDepartment} onChange={(v) => update("organization","administrativeDepartment",v)}/><WFInput label="Department" value={config.organization.department} readOnly/><WFInput label="Sub-Department" value={config.organization.subDepartment} onChange={(v) => update("organization","subDepartment",v)}/><WFInput label="Account Effective From" type="date" value={config.organization.effectiveFrom} onChange={(v) => update("organization","effectiveFrom",v)}/></div></GoGSection><GoGSection title="Organization Office Hierarchy"><DataTable headers={["Office","Parent Office","Office Code","Status","Verified"]}>{config.offices.map((office,index) => <tr key={office.id}><td>{office.name}<small>{office.district} · {office.pinCode}</small></td><td><select value={office.parentOffice} disabled={readOnly} onChange={(e) => changeOffice(index,"parentOffice",e.target.value)}><option value="">Root / No Parent</option>{config.offices.filter((item) => item.id !== office.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></td><td><input value={office.officeCode} readOnly={readOnly} onChange={(e) => changeOffice(index,"officeCode",e.target.value)}/></td><td><select value={office.status} disabled={readOnly} onChange={(e) => changeOffice(index,"status",e.target.value)}><option>Active</option><option>Inactive</option></select></td><td>{office.verified ? "Verified" : "Pending"}</td></tr>)}</DataTable></GoGSection><GoGSection title="User Identity & Organization Mapping"><p className="gog-reference-note">Request-side designations and rights are reference only. Roles and permissions are assigned in Tab 3.</p><div className="gog-user-setup">{config.users.map((user,index) => <article key={user.id || index}><div className="gog-user-title"><strong>{user.displayName}</strong><small>Proposed: {user.proposedRight}</small></div><div className="wf-grid"><WFInput label="Officer / Employee Code" value={user.employeeCode} onChange={(v) => changeUser(index,"employeeCode",v)}/><WFInput label="Designation" value={user.designation} onChange={(v) => changeUser(index,"designation",v)}/><WFSelect label="Office / Division / Circle" value={user.officeId} onChange={(v) => changeUser(index,"officeId",v)} options={config.offices.map((item) => item.id)} optionLabels={Object.fromEntries(config.offices.map((item) => [item.id,item.name]))}/><WFInput label="Official Email" value={user.email} onChange={(v) => changeUser(index,"email",v)}/><WFInput label="Mobile Number" value={user.mobile} onChange={(v) => changeUser(index,"mobile",v)}/><WFInput label="Login / User ID" value={user.userId} onChange={(v) => changeUser(index,"userId",v)}/><WFInput label="Effective From" type="date" value={user.effectiveFrom} onChange={(v) => changeUser(index,"effectiveFrom",v)}/><WFInput label="Effective To" type="date" value={user.effectiveTo} onChange={(v) => changeUser(index,"effectiveTo",v)}/><WFSelect label="User Status" value={user.status} onChange={(v) => changeUser(index,"status",v)} options={["Active","Inactive"]}/></div></article>)}</div><button className="wf-secondary" onClick={() => setConfig((old) => ({ ...old, users: [...old.users,{ id:`ADMUSR-${Date.now()}`,displayName:"",designation:"",employeeCode:"",department:submitted.department.departmentName,officeId:"",email:"",mobile:"",userId:"",password:"Temp@123",effectiveFrom:new Date().toISOString().slice(0,10),effectiveTo:"",status:"Active",proposedRight:"Admin Added",primaryRole:"",additionalRoles:[],permissions:[],scope:{} }] }))}><Plus/> Add User</button></GoGSection></div>; }

function GoGAuthorizationTab({ config, setConfig, readOnly }) { const changeUser = (index,key,value) => setConfig((old) => ({ ...old, users: old.users.map((item,i) => i === index ? { ...item,[key]:value } : item) })); return <div className="gog-admin-tab"><GoGSection title="Role Assignment & Rights Matrix"><div className="gog-role-list">{config.users.map((user,index) => <article key={user.id || index}><header><strong>{user.displayName || "New User"}</strong><small>Proposed Right: {user.proposedRight || "None"}</small></header><div className="wf-grid"><WFSelect label="Primary Role" value={user.primaryRole} onChange={(v) => changeUser(index,"primaryRole",v)} options={gogRoleOptions}/><WFInput label="Role Effective From" type="date" value={user.effectiveFrom} onChange={(v) => changeUser(index,"effectiveFrom",v)}/></div><div className="gog-permission-matrix">{gogPermissionOptions.map((permission) => <label key={permission}><input type="checkbox" disabled={readOnly} checked={user.permissions.includes(permission)} onChange={() => changeUser(index,"permissions",user.permissions.includes(permission) ? user.permissions.filter((item) => item !== permission) : [...user.permissions,permission])}/>{permission}</label>)}</div></article>)}</div></GoGSection><GoGSection title="Admin-Defined Approval Workflow"><p className="gog-reference-note">This workflow is authoritative. Proposed Next Approver from the request is not copied automatically.</p><DataTable headers={["Process","User / Designation","Level","Next Approver","Final","Approval Limit","Actions"]}>{config.approvalWorkflow.map((row,index) => <tr key={row.id}><td><input value={row.process} onChange={(e) => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.map((item,i) => i===index?{...item,process:e.target.value}:item) }))}/></td><td><select value={row.userId} onChange={(e) => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.map((item,i) => i===index?{...item,userId:e.target.value}:item) }))}><option value="">Select</option>{config.users.map((user) => <option key={user.id} value={user.id}>{user.displayName}</option>)}</select></td><td><input type="number" min="1" value={row.level} onChange={(e) => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.map((item,i) => i===index?{...item,level:e.target.value}:item) }))}/></td><td><select value={row.nextApprover} onChange={(e) => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.map((item,i) => i===index?{...item,nextApprover:e.target.value}:item) }))}><option value="">None</option>{config.users.map((user) => <option key={user.id} value={user.id}>{user.displayName}</option>)}</select></td><td><input type="checkbox" checked={row.finalApprover} onChange={(e) => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.map((item,i) => i===index?{...item,finalApprover:e.target.checked}:item) }))}/></td><td><input value={row.approvalLimit} onChange={(e) => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.map((item,i) => i===index?{...item,approvalLimit:e.target.value}:item) }))}/></td><td><button onClick={() => setConfig((old) => ({ ...old,approvalWorkflow:old.approvalWorkflow.filter((_,i) => i!==index) }))}><Trash2/></button></td></tr>)}</DataTable><button className="wf-secondary" onClick={() => setConfig((old) => ({ ...old,approvalWorkflow:[...old.approvalWorkflow,{id:`WF-${Date.now()}`,process:"",userId:"",level:old.approvalWorkflow.length+1,nextApprover:"",finalApprover:false,approvalLimit:"",escalationAuthority:"",delegationAllowed:false,effectiveFrom:""}] }))}><Plus/> Add Workflow Level</button></GoGSection></div>; }

function GoGModulesTab({ config, setConfig, readOnly }) { return <div className="gog-admin-tab"><GoGSection title="Module Definition"><p className="gog-reference-note">Effective access requires Client Module + User Role + User Rights + Scope + Active Status.</p><div className="gog-module-grid">{config.moduleDefinitions.map((module,index) => <article className={module.enabled ? "enabled" : ""} key={module.name}><label><input type="checkbox" disabled={readOnly} checked={module.enabled} onChange={(e) => setConfig((old) => ({ ...old,moduleDefinitions:old.moduleDefinitions.map((item,i) => i===index?{...item,enabled:e.target.checked}:item) }))}/><strong>{module.name}</strong></label><input type="date" value={module.effectiveFrom} onChange={(e) => setConfig((old) => ({ ...old,moduleDefinitions:old.moduleDefinitions.map((item,i) => i===index?{...item,effectiveFrom:e.target.value}:item) }))}/><input placeholder="Remarks" value={module.remarks} onChange={(e) => setConfig((old) => ({ ...old,moduleDefinitions:old.moduleDefinitions.map((item,i) => i===index?{...item,remarks:e.target.value}:item) }))}/></article>)}</div></GoGSection><GoGSection title="Advanced Privileges"><div className="gog-permission-matrix">{gogPrivilegeOptions.map((privilege) => <label key={privilege}><input type="checkbox" disabled={readOnly || !config.moduleDefinitions.some((item) => item.enabled)} checked={config.advancedPrivileges.includes(privilege)} onChange={() => setConfig((old) => ({ ...old,advancedPrivileges:old.advancedPrivileges.includes(privilege)?old.advancedPrivileges.filter((item) => item!==privilege):[...old.advancedPrivileges,privilege] }))}/>{privilege}</label>)}</div></GoGSection></div>; }

function GoGFinalTab({ request, config, setConfig, update, issues, readOnly, acceptQuery }) { const addIntegration = () => setConfig((old) => ({ ...old,integrations:[...old.integrations,{id:`INT-${Date.now()}`,systemName:"",systemType:"ERP",purpose:"",direction:"Inbound",apiAvailable:"To be Confirmed",frequency:"",systemOwner:"",technicalContact:"",remarks:""}] })); return <div className="gog-admin-tab"><GoGSection title="Authentication & Security"><div className="wf-grid"><WFSelect label="Primary Authentication Method" value={config.security.primaryAuthentication} onChange={(v) => update("security","primaryAuthentication",v)} options={["Password + OTP","PKI / DSC","SSO + OTP"]}/><WFInput label="Session Timeout (minutes)" value={config.security.sessionTimeout} onChange={(v) => update("security","sessionTimeout",v)}/></div><div className="gog-security-switches">{[["pkiEnabled","PKI Enabled"],["dscRequiredForLogin","DSC Required"],["otpEnabled","OTP Enabled"],["eSignEnabled","eSign Enabled"],["certificateMappingRequired","Certificate Mapping Required"],["certificateExpiryValidation","Certificate Expiry Validation"]].map(([key,label]) => <label key={key}><input type="checkbox" disabled={readOnly} checked={config.security[key]} onChange={(e) => update("security",key,e.target.checked)}/>{label}</label>)}</div><DataTable headers={["Stage","OTP","PKI / DSC","eSign"]}>{config.security.stageMatrix.map((row,index) => <tr key={row.stage}><td>{row.stage}</td>{["otp","dsc","eSign"].map((key) => <td key={key}><input type="checkbox" checked={row[key]} onChange={(e) => setConfig((old) => ({ ...old,security:{...old.security,stageMatrix:old.security.stageMatrix.map((item,i) => i===index?{...item,[key]:e.target.checked}:item)}}))}/></td>)}</tr>)}</DataTable></GoGSection><GoGSection title="Integration Configuration"><WFSelect label="Integration Required?" value={config.integrationRequired} onChange={(v) => setConfig((old) => ({ ...old,integrationRequired:v }))} options={["No","Yes"]}/>{config.integrationRequired === "Yes" && <><div className="gog-integration-list">{config.integrations.map((integration,index) => <article key={integration.id}><div className="wf-grid"><WFInput label="System Name" value={integration.systemName} onChange={(v) => setConfig((old) => ({ ...old,integrations:old.integrations.map((item,i) => i===index?{...item,systemName:v}:item) }))}/><WFSelect label="System Type" value={integration.systemType} onChange={(v) => setConfig((old) => ({ ...old,integrations:old.integrations.map((item,i) => i===index?{...item,systemType:v}:item) }))} options={["ERP","Finance","Accounts","Government Portal","Other"]}/><WFInput label="Integration Purpose" value={integration.purpose} onChange={(v) => setConfig((old) => ({ ...old,integrations:old.integrations.map((item,i) => i===index?{...item,purpose:v}:item) }))}/><WFSelect label="Direction" value={integration.direction} onChange={(v) => setConfig((old) => ({ ...old,integrations:old.integrations.map((item,i) => i===index?{...item,direction:v}:item) }))} options={["Inbound","Outbound","Bi-directional"]}/><WFSelect label="Existing API Available?" value={integration.apiAvailable} onChange={(v) => setConfig((old) => ({ ...old,integrations:old.integrations.map((item,i) => i===index?{...item,apiAvailable:v}:item) }))} options={["Yes","No","To be Confirmed"]}/><WFInput label="Technical Contact" value={integration.technicalContact} onChange={(v) => setConfig((old) => ({ ...old,integrations:old.integrations.map((item,i) => i===index?{...item,technicalContact:v}:item) }))}/></div></article>)}</div><button className="wf-secondary" onClick={addIntegration}><Plus/> Add Integration</button></>}</GoGSection><GoGSection title="Clarification History">{!request.queryHistory?.length ? <p>No clarification cycles.</p> : request.queryHistory.map((query) => <article className="gog-query-history" key={query.id}><header><strong>{query.queryNumber} · {query.subject}</strong><span>{query.status}</span></header><p>{query.details}</p>{query.replies.map((reply) => <div key={reply.id}><b>Client Reply:</b> {reply.reply}</div>)}{query.status === "REPLIED" && <button className="wf-secondary" onClick={() => acceptQuery(query.id)}>Accept Clarification & Continue</button>}</article>)}</GoGSection><GoGSection title="Final Review Summary"><div className="gog-final-summary"><span>{config.verification.status}<small>Request Verification</small></span><span>{config.offices.filter((item) => item.status === "Active").length}<small>Active Offices</small></span><span>{config.users.filter((item) => item.status === "Active").length}<small>Active Users</small></span><span>{config.moduleDefinitions.filter((item) => item.enabled).length}<small>Enabled Modules</small></span><span>{config.integrations.length}<small>Integrations</small></span></div>{issues.length ? <div className="gog-validation"><strong>Open Validation Issues</strong><ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div> : <p className="gog-ready">All final validations passed. Account is ready for activation.</p>}<div className="wf-grid"><WFInput label="Account Effective From" type="date" value={config.accountEffectiveFrom} onChange={(v) => setConfig((old) => ({ ...old,accountEffectiveFrom:v }))}/><label className="wf-field"><span>Final Admin Remarks</span><textarea value={config.finalRemarks} onChange={(e) => setConfig((old) => ({ ...old,finalRemarks:e.target.value }))}/></label></div></GoGSection></div>; }
function GoGSection({ title, children }) { const clarificationList=title === "Clarification Replies", clarificationReview=title === "7. Clarification & Validation"; return <section id={clarificationList?"gog-clarification-replies":undefined} className={`gog-admin-section ${title === "Final Consolidated Review" ? "gog-print-application" : ""} ${clarificationList?"gog-clarification-target":""}`}><div className="gog-section-heading"><h2>{title}</h2>{title === "Final Consolidated Review"&&<button type="button" className="wf-secondary gog-print-button" onClick={()=>window.print()}>Print Preview / Print</button>}{clarificationReview&&<button type="button" className="wf-primary gog-view-query-button" onClick={()=>document.getElementById("gog-clarification-replies")?.scrollIntoView({behavior:"smooth",block:"start"})}><Search/> View Query / Reply</button>}</div>{children}</section>; }
function GoGQueryModal({ request, close, sent }) { const [detail,setDetail] = useState({ subject:"",category:"General",relatedSection:"Submitted Request & Verification",details:"",additionalEmails:[],attachment:null,internalRemarks:"" }), [extra,setExtra] = useState(""), [error,setError] = useState(""); const submit = (event) => { event.preventDefault(); const result = governmentRequestService.sendQuery(request.id,{...detail,additionalEmails:extra.split(",").map((item)=>item.trim()).filter(Boolean)}); if(result.error)return setError(result.error); sent(); }; return <EditorModal title="Send Query / Clarification" close={close} submit={submit} action="Send Clarification" error={error}><div className="wf-grid"><WFInput label="Request Number" value={request.requestNumber} readOnly/><WFInput label="Organization Name" value={request.organizationName} readOnly/><WFInput label="To Email" value={request.applicantEmail} readOnly/><WFInput label="Additional Email ID(s)" value={extra} onChange={setExtra} hint="Comma-separated email addresses"/><WFInput label="Query Subject" value={detail.subject} onChange={(v)=>setDetail({...detail,subject:v})} required/><WFSelect label="Query Category" value={detail.category} onChange={(v)=>setDetail({...detail,category:v})} options={["General","Document","Organization","User","Security","Integration"]}/><WFSelect label="Related Section" value={detail.relatedSection} onChange={(v)=>setDetail({...detail,relatedSection:v})} options={gogAdminTabs}/><label className="wf-field editor-full"><span>Query / Clarification Details *</span><textarea value={detail.details} onChange={(e)=>setDetail({...detail,details:e.target.value})}/></label><label className="wf-field"><span>Attachment</span><input type="file" onChange={(e)=>setDetail({...detail,attachment:fileMeta(e.target.files[0])})}/></label><label className="wf-field"><span>Internal Admin Remarks</span><textarea value={detail.internalRemarks} onChange={(e)=>setDetail({...detail,internalRemarks:e.target.value})}/></label></div></EditorModal>; }
function GoGRejectModal({ request, close, rejected }) { const [reason,setReason]=useState(""),[remarks,setRemarks]=useState(""),[error,setError]=useState(""); const submit=(event)=>{event.preventDefault();const result=governmentRequestService.reject(request.id,reason,remarks);if(result.error)return setError(result.error);rejected();}; return <EditorModal title="Reject GoG Client Account Request" close={close} submit={submit} action="Reject Request" error={error}><WFInput label="Request Number" value={request.requestNumber} readOnly/><label className="wf-field"><span>Rejection Reason *</span><textarea value={reason} onChange={(e)=>setReason(e.target.value)}/></label><label className="wf-field"><span>Rejection Remarks</span><textarea value={remarks} onChange={(e)=>setRemarks(e.target.value)}/></label></EditorModal>; }

function GoGAdvancedTab({config,setConfig,update,readOnly}) { const [integration,setIntegration]=useState(null), auth=config.advancedAuthentication||{}; const toggle=(p)=>setConfig((o)=>({...o,advancedPrivileges:o.advancedPrivileges.includes(p)?o.advancedPrivileges.filter((x)=>x!==p):[...o.advancedPrivileges,p]})); return <div className="gog-admin-tab"><GoGSection title="Advanced Privileges / Workflow"><p className="gog-reference-note">Select a process/activity card, then define its required authentication.</p><div className="gog-activity-auth-grid">{gogPrivilegeOptions.map((p)=><article className={config.advancedPrivileges.includes(p)?"selected":""} key={p}><label><input type="checkbox" disabled={readOnly} checked={config.advancedPrivileges.includes(p)} onChange={()=>toggle(p)}/><strong>{p}</strong></label>{config.advancedPrivileges.includes(p)&&<WFSelect label="Authentication" value={auth[p]||"Password + OTP"} onChange={(v)=>setConfig((o)=>({...o,advancedAuthentication:{...(o.advancedAuthentication||{}),[p]:v}}))} options={["Password + OTP","OTP","PKI / DSC","eSign","DSC + OTP"]}/>}</article>)}</div></GoGSection><GoGSection title="Security & Integration"><div className="wf-grid"><WFSelect label="Primary Authentication" value={config.security.primaryAuthentication} onChange={(v)=>update("security","primaryAuthentication",v)} options={["Password + OTP","PKI / DSC","SSO + OTP"]}/><WFInput label="Session Timeout (minutes)" value={config.security.sessionTimeout} onChange={(v)=>update("security","sessionTimeout",v)}/></div><div className="gog-security-switches">{[["pkiEnabled","PKI Enabled"],["dscRequiredForLogin","DSC Required"],["otpEnabled","OTP Enabled"],["eSignEnabled","eSign Enabled"]].map(([k,l])=><label key={k}><input type="checkbox" disabled={readOnly} checked={config.security[k]} onChange={(e)=>update("security",k,e.target.checked)}/>{l}</label>)}</div><WFSelect label="External Integration Required?" value={config.integrationRequired} onChange={(v)=>setConfig((o)=>({...o,integrationRequired:v}))} options={["No","Yes"]}/>{config.integrationRequired==="Yes"&&<><DataTable headers={["System","Type","Purpose","Direction","Frequency","Technical Contact","Action"]}>{config.integrations.map((x)=><tr key={x.id}><td>{x.systemName}</td><td>{x.systemType}</td><td>{x.purpose}</td><td>{x.direction}</td><td>{x.frequency}</td><td>{x.technicalContact}</td><td className="table-actions"><button onClick={()=>setIntegration(x)}><Pencil/></button><button onClick={()=>setConfig((o)=>({...o,integrations:o.integrations.filter((a)=>a.id!==x.id)}))}><Trash2/></button></td></tr>)}</DataTable>{!readOnly&&<button className="wf-secondary" onClick={()=>setIntegration({id:`INT-${Date.now()}`,systemName:"",systemType:"ERP",purpose:"",direction:"Inbound",apiAvailable:"To be Confirmed",frequency:"",systemOwner:"",technicalContact:"",remarks:""})}><Plus/> Add Integration</button>}</>}</GoGSection>{integration&&<GoGIntegrationModal value={integration} close={()=>setIntegration(null)} save={(x)=>{setConfig((o)=>({...o,integrations:o.integrations.some((a)=>a.id===x.id)?o.integrations.map((a)=>a.id===x.id?x:a):[...o.integrations,x]}));setIntegration(null);}}/>}</div>; }
function GoGIntegrationModal({value,close,save}) { const [f,setF]=useState(value), set=(k,v)=>setF((o)=>({...o,[k]:v})); return <EditorModal title="External Integration Details" close={close} submit={(e)=>{e.preventDefault();save(f);}} action="Save Integration"><div className="wf-grid"><WFInput label="System Name" value={f.systemName} onChange={(v)=>set("systemName",v)} required/><WFSelect label="System Type" value={f.systemType} onChange={(v)=>set("systemType",v)} options={["ERP","Finance","Accounts","Government Portal","Other"]}/><WFInput label="Integration Purpose" value={f.purpose} onChange={(v)=>set("purpose",v)} required/><WFSelect label="Direction" value={f.direction} onChange={(v)=>set("direction",v)} options={["Inbound","Outbound","Bi-directional"]}/><WFSelect label="API Availability" value={f.apiAvailable} onChange={(v)=>set("apiAvailable",v)} options={["Yes","No","To be Confirmed"]}/><WFInput label="Frequency" value={f.frequency} onChange={(v)=>set("frequency",v)}/><WFInput label="System Owner" value={f.systemOwner} onChange={(v)=>set("systemOwner",v)}/><WFInput label="Technical Contact" value={f.technicalContact} onChange={(v)=>set("technicalContact",v)}/><label className="wf-field editor-full"><span>Remarks</span><textarea value={f.remarks} onChange={(e)=>set("remarks",e.target.value)}/></label></div></EditorModal>; }

function GoGRevisedFinalTab({request,config,setConfig,issues,acceptQuery}) { const divisions=config.departmentStructures.filter((u)=>u.unitType==="Division").length, subs=config.departmentStructures.filter((u)=>u.unitType==="Sub-Division").length, openQueries=request.queryHistory?.filter((q)=>q.status!=="CLOSED").length||0; return <div className="gog-admin-tab"><GoGSection title="Final Consolidated Review"><div className="gog-final-summary"><span>{config.organization.shortName||"Pending"}<small>Client / Department</small></span><span>{divisions} / {subs}<small>Divisions / Sub-Divisions</small></span><span>{config.roleDefinitions.length}<small>Configured Roles</small></span><span>{config.users.length}<small>Configured Users</small></span><span>{openQueries}<small>Open Queries</small></span></div><div className="gog-review-grid"><article><h3>Client Information</h3><strong>{config.organization.department}</strong><p>{config.organization.administrativeDepartment||"Vibhag not set"} · {config.organization.tenantCode}</p></article><article><h3>Role Configuration</h3>{config.moduleDefinitions.filter((m)=>m.enabled).map((m)=><p key={m.name}><strong>{m.name}</strong> · {config.roleDefinitions.filter((r)=>r.module===m.name).length} role(s)</p>)}</article><article><h3>User Configuration</h3>{config.users.map((u)=><p key={u.id}><strong>{u.displayName}</strong> · {u.moduleAccess.length} module(s)</p>)}</article><article><h3>Security & Integration</h3><p>{config.security.primaryAuthentication}</p><p>Integration: {config.integrationRequired}</p></article></div>{issues.length?<div className="gog-validation"><strong>Blocking Validation Issues</strong><ul>{issues.map((x)=><li key={x}>{x}</li>)}</ul></div>:<p className="gog-ready">All final validations passed. Client and approved Users are ready for activation.</p>}<div className="wf-grid"><WFInput label="Account Effective From" type="date" value={config.accountEffectiveFrom} onChange={(v)=>setConfig((o)=>({...o,accountEffectiveFrom:v}))}/><label className="wf-field"><span>Final Admin Remarks</span><textarea value={config.finalRemarks} onChange={(e)=>setConfig((o)=>({...o,finalRemarks:e.target.value}))}/></label></div></GoGSection><GoGSection title="Clarification History">{!request.queryHistory?.length?<p>No clarification cycles.</p>:request.queryHistory.map((q)=><article className="gog-query-history" key={q.id}><header><strong>{q.queryNumber} · {q.subject}</strong><span>{q.status}</span></header><p>{q.details}</p>{q.status==="REPLIED"&&<button className="wf-secondary" onClick={()=>acceptQuery(q.id)}>Accept Clarification & Continue</button>}</article>)}</GoGSection></div>; }

function GoGDepartmentDetailsCard({config,setConfig,readOnly}) {
  const stored=config.departmentStructures.find((unit)=>unit.unitType==="Department"), department=stored||{id:`DEPT-${config.organization.tenantCode||"GOG"}`,unitType:"Department",department:config.organization.department,division:"",subDivision:"",unitCode:config.organization.tenantCode,address:config.organization.address||"",pinCode:"",state:"Gujarat",district:"",city:"",officialEmail:config.organization.officialEmail||"",contactNumber:"",status:"Active",remarks:"",parentUnit:""}, [editing,setEditing]=useState(false);
  const save=(record)=>{setConfig((old)=>({...old,departmentStructures:old.departmentStructures.some((x)=>x.unitType==="Department")?old.departmentStructures.map((x)=>x.unitType==="Department"?{...record,unitType:"Department",department:old.organization.department,parentUnit:"",division:"",subDivision:""}:x):[{...record,unitType:"Department",department:old.organization.department,parentUnit:"",division:"",subDivision:""},...old.departmentStructures]}));setEditing(false);};
  return <GoGSection title="Account Department Details"><div className="gog-fixed-department"><div className="gog-fixed-department-icon"><Building2/></div><div className="gog-fixed-department-title"><small>FIXED ACCOUNT DEPARTMENT</small><h3>{department.department}</h3><span>{department.unitCode||config.organization.tenantCode}</span></div><div className="gog-fixed-department-grid"><ReviewKV label="Official Email" value={department.officialEmail}/><ReviewKV label="Contact Number" value={department.contactNumber}/><ReviewKV label="Address" value={department.address}/><ReviewKV label="PIN / Location" value={[department.pinCode,department.city,department.district,department.state].filter(Boolean).join(", ")}/><ReviewKV label="Status" value={department.status}/><ReviewKV label="Remarks" value={department.remarks}/></div>{!readOnly&&<button type="button" className="wf-secondary" onClick={()=>setEditing(true)}><Pencil/> Edit Department</button>}</div><p className="gog-lock-note"><LockKeyhole/> Department is created from the GoG Account Request. Admin may edit its details, but cannot add another Department or delete this Department.</p>{editing&&<GoGDependentUnitModal unit={department} department={department} divisions={[]} close={()=>setEditing(false)} save={save}/>}</GoGSection>;
}

function GoGStructureTabProLegacy(props) {
  const units=props.config.departmentStructures, departments=units.filter((u)=>u.unitType==="Department");
  return <div className="gog-admin-tab"><GoGStructureTab {...props}/><GoGSection title="Live Department Hierarchy"><p className="gog-reference-note">This hierarchy updates immediately when a Department, Division or Sub-Division is added, edited or removed.</p><div className="gog-hierarchy-tree">{departments.map((department)=>{const divisions=units.filter((u)=>u.unitType==="Division"&&(u.parentUnit===department.id||u.department===department.department));return <article className="gog-tree-department" key={department.id}><header><span><Building2/></span><div><small>DEPARTMENT</small><strong>{department.department}</strong><em>{department.unitCode}</em></div></header><div className="gog-tree-branches">{!divisions.length&&<p>No Divisions configured</p>}{divisions.map((division)=>{const subs=units.filter((u)=>u.unitType==="Sub-Division"&&(u.parentUnit===division.id||u.division===division.division));return <section key={division.id}><div className="gog-tree-division"><span>D</span><div><small>DIVISION</small><strong>{division.division}</strong><em>{division.unitCode}</em></div></div><div className="gog-tree-subs">{!subs.length&&<p>No Sub-Divisions</p>}{subs.map((sub)=><div key={sub.id}><span>SD</span><div><small>SUB-DIVISION</small><strong>{sub.subDivision}</strong><em>{sub.unitCode}</em></div></div>)}</div></section>})}</div></article>})}{!departments.length&&<div className="empty-v2"><Building2/><h2>Department hierarchy is not configured</h2><p>Add the Department first, then its Divisions and Sub-Divisions.</p></div>}</div></GoGSection></div>;
}

function GoGStructureTabPro({config,setConfig,readOnly}) {
  const [edit,setEdit]=useState(null), units=config.departmentStructures, departmentName=config.organization.department;
  const department=units.find((u)=>u.unitType==="Department");
  const divisions=units.filter((u)=>u.unitType==="Division");
  const openAdd=()=>setEdit({id:`UNIT-${Date.now()}`,unitType:department?"Division":"Department",department:departmentName,division:"",subDivision:"",unitCode:"",parentUnit:department?.id||"",address:config.organization.address||"",pinCode:"",state:"Gujarat",district:"",city:"",officialEmail:config.organization.officialEmail||"",contactNumber:"",status:"Active",remarks:""});
  const save=(record)=>{setConfig((old)=>({...old,departmentStructures:old.departmentStructures.some((x)=>x.id===record.id)?old.departmentStructures.map((x)=>x.id===record.id?record:x):[...old.departmentStructures,record]}));setEdit(null);};
  const remove=(record)=>{if(record.unitType==="Department"||units.some((u)=>u.parentUnit===record.id)||config.users.some((u)=>u.divisionId===record.id||u.subDivisionId===record.id))return;setConfig((old)=>({...old,departmentStructures:old.departmentStructures.filter((x)=>x.id!==record.id)}));};
  return <div className="gog-admin-tab"><GoGSection title="Department / Division / Sub-Division Structure"><div className="section-title-row"><p className="gog-reference-note">One Department is maintained for this account. Every Division automatically belongs to it; Sub-Division must be linked to one configured Division.</p>{!readOnly&&<button className="wf-primary" onClick={openAdd}><Plus/> {department?"Add Division / Sub-Division":"Add Department"}</button>}</div><DataTable headers={["Sr.","Level","Department","Division","Sub-Division","Unit Code","Parent Unit","Email","Status","Actions"]}>{units.map((u,i)=><tr key={u.id}><td>{i+1}</td><td>{u.unitType}</td><td>{u.department}</td><td>{u.division||"—"}</td><td>{u.subDivision||"—"}</td><td>{u.unitCode}</td><td>{units.find((x)=>x.id===u.parentUnit)?.subDivision||units.find((x)=>x.id===u.parentUnit)?.division||units.find((x)=>x.id===u.parentUnit)?.department||"Root"}</td><td>{u.officialEmail||"—"}</td><td>{u.status}</td><td className="table-actions"><button title="View / Edit" onClick={()=>setEdit({...u,_view:readOnly})}><Pencil/></button>{!readOnly&&u.unitType!=="Department"&&<button title={units.some((x)=>x.parentUnit===u.id)?"Remove child units first":"Delete"} onClick={()=>remove(u)}><Trash2/></button>}</td></tr>)}</DataTable></GoGSection><GoGSection title="Live Department Hierarchy"><div className="gog-hierarchy-tree">{department?<article className="gog-tree-department"><header><span><Building2/></span><div><small>DEPARTMENT</small><strong>{department.department}</strong><em>{department.unitCode}</em></div></header><div className="gog-tree-branches">{!divisions.length&&<p>No Divisions configured</p>}{divisions.map((division)=>{const children=units.filter((u)=>u.unitType==="Sub-Division"&&u.parentUnit===division.id);return <section key={division.id}><div className="gog-tree-division"><span>D</span><div><small>DIVISION</small><strong>{division.division}</strong><em>{division.unitCode}</em></div></div><div className="gog-tree-subs">{!children.length&&<p>No Sub-Divisions</p>}{children.map((sub)=><div key={sub.id}><span>SD</span><div><small>SUB-DIVISION</small><strong>{sub.subDivision}</strong><em>{sub.unitCode}</em></div></div>)}</div></section>})}</div></article>:<div className="empty-v2"><Building2/><h2>Department is not configured</h2><p>Add the single account Department first.</p></div>}</div></GoGSection>{edit&&<GoGDependentUnitModal unit={edit} department={department} divisions={divisions} close={()=>setEdit(null)} save={save}/>}</div>;
}

function GoGDependentUnitModal({unit,department,divisions,close,save}) {
  const [form,setForm]=useState(unit), viewing=Boolean(unit._view), set=(key,value)=>setForm((old)=>({...old,[key]:value}));
  const typeOptions=unit.unitType==="Department"?["Department"]:department?["Division",...(divisions.length?["Sub-Division"]:[])]:["Department"];
  const selectType=(type)=>setForm((old)=>({...old,unitType:type,department:department?.department||old.department,division:"",subDivision:"",parentUnit:type==="Division"?department?.id||"":""}));
  const selectDivision=(divisionId)=>{const division=divisions.find((x)=>x.id===divisionId);setForm((old)=>({...old,parentUnit:divisionId,division:division?.division||""}));};
  const submit=(event)=>{event.preventDefault();if(form.unitType==="Sub-Division"&&!form.parentUnit)return;if(form.unitType==="Division")save({...form,department:department.department,parentUnit:department.id,subDivision:""});else if(form.unitType==="Department")save({...form,division:"",subDivision:"",parentUnit:""});else save({...form,department:department.department});};
  return <EditorModal title={`${unitsLabel(unit)} Details`} close={close} submit={submit} action={viewing?"Close":"Save Structure"}><div className="wf-grid"><WFInput label="Department" value={department?.department||form.department} readOnly/><WFSelect label="Unit Type" value={form.unitType} onChange={selectType} options={typeOptions}/>{form.unitType==="Division"&&<WFInput label="Division Name" value={form.division} onChange={(v)=>set("division",v)} required readOnly={viewing}/>} {form.unitType==="Sub-Division"&&<><WFSelect label="Division" value={form.parentUnit} onChange={selectDivision} options={divisions.map((x)=>x.id)} optionLabels={Object.fromEntries(divisions.map((x)=>[x.id,x.division]))}/><WFInput label="Sub-Division Name" value={form.subDivision} onChange={(v)=>set("subDivision",v)} required readOnly={viewing}/></>}<WFInput label="Unit / Office Code" value={form.unitCode} onChange={(v)=>set("unitCode",v)} required readOnly={viewing}/><WFInput label="Address" value={form.address} onChange={(v)=>set("address",v)} readOnly={viewing}/><WFInput label="PIN Code" value={form.pinCode} onChange={(v)=>set("pinCode",v)} readOnly={viewing}/><WFInput label="State" value={form.state} onChange={(v)=>set("state",v)} readOnly={viewing}/><WFInput label="District" value={form.district} onChange={(v)=>set("district",v)} readOnly={viewing}/><WFInput label="City / Taluka" value={form.city} onChange={(v)=>set("city",v)} readOnly={viewing}/><WFInput label="Official Email" value={form.officialEmail} onChange={(v)=>set("officialEmail",v)} readOnly={viewing}/><WFInput label="Contact Number" value={form.contactNumber} onChange={(v)=>set("contactNumber",v)} readOnly={viewing}/><WFSelect label="Status" value={form.status} onChange={(v)=>set("status",v)} options={["Active","Inactive"]}/><label className="wf-field editor-full"><span>Remarks</span><textarea readOnly={viewing} value={form.remarks} onChange={(e)=>set("remarks",e.target.value)}/></label></div></EditorModal>;
}
const unitsLabel=(unit)=>unit._view?`View ${unit.unitType}`:`${unit.id?.startsWith("UNIT-")?"Add":"Edit"} ${unit.unitType}`;

function GoGAdvancedTabPro({config,setConfig,update,readOnly}) {
  const [selected,setSelected]=useState(config.advancedPrivileges[0]||""), [integration,setIntegration]=useState(null), auth=config.advancedAuthentication||{}, validIntegrations=config.integrations.filter(isMeaningfulGoGIntegration);
  const toggle=(name)=>setConfig((old)=>{const active=old.advancedPrivileges.includes(name);return {...old,advancedPrivileges:active?old.advancedPrivileges.filter((x)=>x!==name):[...old.advancedPrivileges,name]};});
  const authOptions=["Password + OTP","OTP","PKI / DSC","eSign","DSC + OTP"];
  return <div className="gog-admin-tab"><GoGSection title="Advanced Privileges / Workflow"><p className="gog-reference-note">Select the required process/activity. Authentication is configured in the professional detail panel—not inside each card.</p><div className="gog-privilege-workspace"><div className="gog-privilege-cards">{gogPrivilegeOptions.map((name)=>{const active=config.advancedPrivileges.includes(name);return <button type="button" key={name} className={`${active?"selected":""} ${selected===name?"focused":""}`} onClick={()=>setSelected(name)}><span className="gog-card-check" onClick={(e)=>{e.stopPropagation();if(!readOnly)toggle(name);}}>{active?"✓":"+"}</span><div><strong>{name}</strong><small>{active?"Enabled":"Not enabled"}</small></div><ChevronRight/></button>})}</div><aside className="gog-auth-panel">{!selected?<div className="empty-v2"><ShieldCheck/><h2>Select an activity</h2><p>Its authentication configuration will appear here.</p></div>:<><span className="gog-panel-kicker">ACTIVITY SECURITY</span><h3>{selected}</h3><label className="gog-enable-switch"><input type="checkbox" disabled={readOnly} checked={config.advancedPrivileges.includes(selected)} onChange={()=>toggle(selected)}/><span>Enable this privilege</span></label>{config.advancedPrivileges.includes(selected)&&<><p>Required authentication</p><div className="gog-auth-choices">{authOptions.map((option)=><button type="button" disabled={readOnly} className={(auth[selected]||"Password + OTP")===option?"active":""} key={option} onClick={()=>setConfig((old)=>({...old,advancedAuthentication:{...(old.advancedAuthentication||{}),[selected]:option}}))}>{option}</button>)}</div><div className="gog-auth-result"><ShieldCheck/><span><small>APPLIED AUTHENTICATION</small><strong>{auth[selected]||"Password + OTP"}</strong></span></div></>}</>}</aside></div></GoGSection><GoGSection title="Security & Integration"><div className="gog-security-block"><h3>Primary Account Security</h3><div className="wf-grid"><WFSelect label="Primary Authentication" value={config.security.primaryAuthentication} onChange={(v)=>update("security","primaryAuthentication",v)} options={["Password + OTP","PKI / DSC","SSO + OTP"]}/><WFInput label="Session Timeout (minutes)" value={config.security.sessionTimeout} onChange={(v)=>update("security","sessionTimeout",v)}/></div><div className="gog-security-switches">{[["pkiEnabled","PKI Enabled"],["dscRequiredForLogin","DSC Required"],["otpEnabled","OTP Enabled"],["eSignEnabled","eSign Enabled"]].map(([key,label])=><label key={key}><input type="checkbox" disabled={readOnly} checked={config.security[key]} onChange={(e)=>update("security",key,e.target.checked)}/>{label}</label>)}</div></div><div className="gog-integration-block"><WFSelect label="External Integration Required?" value={config.integrationRequired} onChange={(v)=>setConfig((old)=>({...old,integrationRequired:v,integrations:v==="No"?[]:old.integrations}))} options={["No","Yes"]}/>{config.integrationRequired==="Yes"&&<><div className="section-title-row"><div><span>API</span><h2>External Integration Details</h2></div>{!readOnly&&<button className="wf-primary" onClick={()=>setIntegration({id:`INT-${Date.now()}`,systemName:"",systemType:"ERP",purpose:"",direction:"Inbound",apiAvailable:"To be Confirmed",frequency:"",systemOwner:"",technicalContact:"",remarks:""})}><Plus/> Add Integration</button>}</div><DataTable headers={["System","Type","Purpose","Direction","API","Frequency","Owner / Contact","Actions"]}>{validIntegrations.map((x)=><tr key={x.id}><td>{x.systemName}</td><td>{x.systemType}</td><td>{x.purpose}</td><td>{x.direction}</td><td>{x.apiAvailable}</td><td>{x.frequency||"—"}</td><td>{x.systemOwner||"—"}<small>{x.technicalContact}</small></td><td className="table-actions"><button onClick={()=>setIntegration(x)}><Pencil/></button>{!readOnly&&<button onClick={()=>setConfig((old)=>({...old,integrations:old.integrations.filter((a)=>a.id!==x.id)}))}><Trash2/></button>}</td></tr>)}</DataTable></>}</div></GoGSection>{integration&&<GoGIntegrationModal value={integration} close={()=>setIntegration(null)} save={(record)=>{setConfig((old)=>({...old,integrations:[...old.integrations.filter((x)=>x.id!==record.id&& (x.systemName?.trim()||x.purpose?.trim())),record]}));setIntegration(null);}}/>}</div>;
}

function GoGClarificationInbox({request,acceptQuery}) { const [view,setView]=useState(null), queries=request.queryHistory||[]; return <GoGSection title="Clarification Replies"><p className="gog-reference-note">Open a reply to review the client's text and every uploaded supporting/additional document before accepting the clarification.</p><DataTable headers={["Query No.","Subject","Sent On","Reply Status","Reply Received","Documents","Actions"]}>{queries.map((query)=>{const latest=query.replies?.[query.replies.length-1], docs=latest?[...(latest.supportingDocuments||[]),...(latest.additionalDocuments||[])]:[];return <tr key={query.id}><td><strong>{query.queryNumber}</strong></td><td>{query.subject}<small>{query.category} · {query.relatedSection}</small></td><td>{new Date(query.createdAt).toLocaleString()}</td><td><span className="wf-status">{query.status}</span></td><td>{latest?new Date(latest.repliedAt).toLocaleString():"Awaiting reply"}</td><td>{docs.length} file(s)</td><td className="table-actions">{latest&&<button type="button" title="View Reply" onClick={()=>setView(query)}><Search/></button>}{query.status==="REPLIED"&&<button type="button" title="Accept Clarification" onClick={()=>acceptQuery(query.id)}><CheckCircle2/></button>}</td></tr>})}</DataTable>{!queries.length&&<p>No clarification queries have been sent.</p>}{view&&<GoGReplyViewModal query={view} close={()=>setView(null)} accept={()=>{acceptQuery(view.id);setView(null);}}/>}</GoGSection>; }
function GoGReplyViewModal({query,close,accept}) { const replies=query.replies||[]; return <div className="editor-backdrop" role="dialog" aria-modal="true"><section className="editor-modal gog-reply-modal"><header><div><small>{query.queryNumber}</small><h2>Clarification Reply Details</h2></div><button type="button" onClick={close}><X/></button></header><div className="editor-body"><div className="gog-query-reference"><div><small>QUERY SUBJECT</small><strong>{query.subject}</strong></div><div><small>CATEGORY / SECTION</small><strong>{query.category} · {query.relatedSection}</strong></div><div><small>QUERY SENT</small><strong>{new Date(query.createdAt).toLocaleString()}</strong></div><div><small>STATUS</small><strong>{query.status}</strong></div></div><article className="gog-original-query"><span>ADMIN QUERY</span><p>{query.details}</p>{query.attachment&&<GoGReplyDocument document={query.attachment} category="Admin Query Attachment"/>}</article>{replies.map((reply,index)=><article className="gog-client-reply" key={reply.id}><header><div><span>CLIENT REPLY {replies.length>1?index+1:""}</span><strong>{new Date(reply.repliedAt).toLocaleString()}</strong></div></header><p>{reply.reply}</p><GoGReplyDocuments title="Supporting Documents" documents={reply.supportingDocuments}/><GoGReplyDocuments title="Additional Documents" documents={reply.additionalDocuments}/></article>)}</div><footer><button type="button" className="wf-secondary" onClick={close}>Close</button>{query.status==="REPLIED"&&<button type="button" className="wf-primary" onClick={accept}><CheckCircle2/> Accept Clarification & Continue</button>}</footer></section></div>; }
function GoGReplyDocuments({title,documents=[]}) { return <section className="gog-reply-doc-section"><h3>{title} <span>{documents.length}</span></h3>{!documents.length?<p>No documents uploaded.</p>:<div className="gog-reply-documents">{documents.map((document,index)=><GoGReplyDocument key={`${document.name}-${index}`} document={document} category={title}/>)}</div>}</section>; }
function GoGReplyDocument({document,category}) { const size=document.size?`${(document.size/1024).toFixed(1)} KB`:"Size unavailable"; return <div className="gog-reply-document"><FileText/><div><strong>{document.name||"Document"}</strong><small>{category} · {document.type||"File"} · {size}</small></div>{document.previewUrl?<a className="wf-secondary" href={document.previewUrl} target="_blank" rel="noreferrer">View Document</a>:<span className="gog-file-unavailable" title="This legacy prototype record stored file metadata only.">Metadata Only</span>}</div>; }

const ReviewKV=({label,value})=><div><small>{label}</small><strong>{value||"—"}</strong></div>;
function GoGFullReviewTab({request,config,setConfig,issues,acceptQuery}) {
  const submitted=request.submittedData, validIntegrations=config.integrations.filter(isMeaningfulGoGIntegration);
  return <div className="gog-admin-tab"><section className="gog-full-application"><header className="gog-application-head"><div><span>nProcure 2.0 · GoG</span><h1>Client Account Creation Application</h1><p>Consolidated Request and Admin Configuration</p></div><div><small>REQUEST NUMBER</small><strong>{request.requestNumber}</strong><p>{new Date(request.submittedAt).toLocaleString()}</p></div></header><div className="gog-print-toolbar"><p>This preview contains the submitted request and all configured details from Tabs 1–5.</p><button type="button" className="wf-primary" onClick={()=>window.print()}>Print Preview / Print</button></div><GoGSection title="1. Submitted Application Request"><div className="gog-review-kv"><ReviewKV label="Request Status" value={request.status.replaceAll("_"," ")}/><ReviewKV label="Authorized Requestor" value={submitted.requestor.name}/><ReviewKV label="Designation" value={submitted.requestor.designation}/><ReviewKV label="Registered Email" value={submitted.requestor.email}/><ReviewKV label="Mobile Number" value={submitted.requestor.mobile}/><ReviewKV label="Requested Department" value={submitted.department.departmentName}/></div><h3>Submitted Offices</h3><DataTable headers={["Type","Office","Address","PIN / Location","Email","Contact"]}>{submitted.offices.map((x)=><tr key={x.id}><td>{x.type}</td><td>{x.name}</td><td>{x.address}</td><td>{x.pinCode}<small>{x.city}, {x.district}, {x.state}</small></td><td>{x.email}</td><td>{x.mobile}</td></tr>)}</DataTable><h3>Proposed Users</h3><DataTable headers={["Officer","Designation","Email","Mobile","Proposed Rights"]}>{submitted.proposedUsers.map((x)=><tr key={x.id}><td>{x.officerName}</td><td>{submitted.designations.find((d)=>d.id===x.designationId)?.name}</td><td>{x.email}</td><td>{x.mobile}</td><td>{x.rights}</td></tr>)}</DataTable></GoGSection><GoGSection title="2. Client Information"><div className="gog-review-kv"><ReviewKV label="Government Organization / Vibhag" value={config.organization.administrativeDepartment}/><ReviewKV label="Client / Department" value={config.organization.department}/><ReviewKV label="Client Short Name" value={config.organization.shortName}/><ReviewKV label="Client Code" value={config.organization.tenantCode}/><ReviewKV label="Official Email" value={config.organization.officialEmail}/><ReviewKV label="Website" value={config.organization.website}/><ReviewKV label="Address" value={config.organization.address}/><ReviewKV label="Effective From" value={config.organization.effectiveFrom}/></div></GoGSection><GoGSection title="3. Department Structure"><DataTable headers={["Level","Department","Division","Sub-Division","Unit Code","Parent","Email","Status"]}>{config.departmentStructures.map((x)=><tr key={x.id}><td>{x.unitType}</td><td>{x.department}</td><td>{x.division||"—"}</td><td>{x.subDivision||"—"}</td><td>{x.unitCode}</td><td>{config.departmentStructures.find((u)=>u.id===x.parentUnit)?.division||config.departmentStructures.find((u)=>u.id===x.parentUnit)?.department||"Root"}</td><td>{x.officialEmail}</td><td>{x.status}</td></tr>)}</DataTable></GoGSection><GoGSection title="4. Module-wise Roles & Responsibilities"><DataTable headers={["Module","Role","Description","Responsibilities","Effective Period","Status"]}>{config.roleDefinitions.map((x)=><tr key={x.id}><td>{x.module}</td><td>{x.roleName}</td><td>{x.description}</td><td>{x.responsibilities.join(", ")}</td><td>{x.effectiveFrom} – {x.effectiveTo||"Open"}</td><td>{x.status}</td></tr>)}</DataTable></GoGSection><GoGSection title="5. Users & Access Assignment"><DataTable headers={["User","Designation","Department Mapping","Login ID","Contact","Module / Role / Scope"]}>{config.users.map((u)=><tr key={u.id}><td>{u.displayName}</td><td>{u.designation}</td><td>{u.department}<small>{config.departmentStructures.find((x)=>x.id===u.divisionId)?.division||"Department Level"} · {config.departmentStructures.find((x)=>x.id===u.subDivisionId)?.subDivision||"N/A"}</small></td><td>{u.userId}</td><td>{u.email}<small>{u.mobile}</small></td><td>{u.moduleAccess.map((a)=><div key={a.id}><strong>{a.module} → {a.roleName}</strong><small>{a.responsibilities.join(", ")} · {a.accessScope}</small></div>)}</td></tr>)}</DataTable></GoGSection><GoGSection title="6. Advanced Privileges, Security & Integration"><DataTable headers={["Advanced Activity","Authentication"]}>{config.advancedPrivileges.map((x)=><tr key={x}><td>{x}</td><td>{config.advancedAuthentication?.[x]||"Password + OTP"}</td></tr>)}</DataTable><div className="gog-review-kv"><ReviewKV label="Primary Authentication" value={config.security.primaryAuthentication}/><ReviewKV label="Session Timeout" value={`${config.security.sessionTimeout} minutes`}/><ReviewKV label="External Integration Required" value={config.integrationRequired}/></div>{config.integrationRequired==="Yes"&&<DataTable headers={["System","Type","Purpose","Direction","API","Frequency","Owner","Technical Contact"]}>{validIntegrations.map((x)=><tr key={x.id}><td>{x.systemName}</td><td>{x.systemType}</td><td>{x.purpose}</td><td>{x.direction}</td><td>{x.apiAvailable}</td><td>{x.frequency}</td><td>{x.systemOwner}</td><td>{x.technicalContact}</td></tr>)}</DataTable>}</GoGSection><GoGSection title="7. Clarification & Validation"><div className="gog-review-kv"><ReviewKV label="Clarification Cycles" value={String(request.queryHistory?.length||0)}/><ReviewKV label="Open Queries" value={String(request.queryHistory?.filter((q)=>q.status!=="CLOSED").length||0)}/><ReviewKV label="Blocking Issues" value={String(issues.length)}/></div>{issues.length?<div className="gog-validation"><ul>{issues.map((x)=><li key={x}>{x}</li>)}</ul></div>:<p className="gog-ready">All final validations passed.</p>}<div className="wf-grid"><WFInput label="Account Effective From" type="date" value={config.accountEffectiveFrom} onChange={(v)=>setConfig((old)=>({...old,accountEffectiveFrom:v}))}/><label className="wf-field"><span>Final Admin Remarks</span><textarea value={config.finalRemarks} onChange={(e)=>setConfig((old)=>({...old,finalRemarks:e.target.value}))}/></label></div>{request.queryHistory?.filter((q)=>q.status==="REPLIED").map((q)=><button key={q.id} className="wf-secondary" onClick={()=>acceptQuery(q.id)}>Accept Clarification {q.queryNumber}</button>)}</GoGSection></section></div>;
}

function AdminReviewV2({ request, back, done }) {
  const [action, setAction] = useState("APPROVE"),
    [note, setNote] = useState(""),
    [subject, setSubject] = useState("Additional information required"),
    [correction, setCorrection] = useState(
      "Upload or correct the requested information",
    ),
    [approvedModules, setApprovedModules] = useState(
      request.requestedModules || [],
    ),
    [role, setRole] = useState("Organization Admin"),
    [tenantCode, setTenantCode] = useState(
      request.organizationName.replace(/\W/g, "").slice(0, 8).toUpperCase(),
    ),
    [dsc, setDsc] = useState(request.clientType === "Government");
  const decide = () => {
    if (action === "QUERY")
      approvalService.query(request.id, {
        subject,
        description: note,
        requiredCorrection: correction,
      });
    else if (action === "REJECT") approvalService.reject(request.id, note);
    else
      approvalService.approve(request.id, {
        tenantCode,
        approvedModules,
        role,
        permissions: Object.fromEntries(
          approvedModules.map((m) => [m, ["VIEW", "CREATE", "APPROVE"]]),
        ),
        authenticationPolicy: {
          dscRequiredForLogin: request.clientType === "Government" || dsc,
          mfa: true,
          sso: false,
          loginPolicy:
            request.submittedData.authenticationPolicyRequest?.loginPolicy ||
            {},
          processRules:
            request.submittedData.authenticationPolicyRequest?.processRules ||
            [],
        },
        integrationAssessmentRequired:
          request.submittedData.integrationRequired === "Yes",
        note,
      });
    done();
  };
  return (
    <section>
      <button className="wf-secondary" onClick={back}>
        <ChevronLeft /> Requests
      </button>
      <div className="admin-review-grid">
        <div className="flow-card">
          <span className="wf-status">{request.status}</span>
          <h1>{request.organizationName}</h1>
          <ReviewData
            data={request.submittedData}
            user={{
              userId: request.userId,
              organizationName: request.organizationName,
            }}
          />
          <h3>Workflow history</h3>
          {request.workflowHistory.map((h) => (
            <p key={h.id}>
              {new Date(h.at).toLocaleString()} · <strong>{h.action}</strong> ·{" "}
              {h.by} {h.note}
            </p>
          ))}
        </div>
        <aside className="decision-v2">
          <h2>Admin Decision</h2>
          <div className="choice-tabs">
            {["APPROVE", "QUERY", "REJECT"].map((x) => (
              <button
                className={action === x ? "selected" : ""}
                onClick={() => setAction(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
          {action === "APPROVE" && (
            <>
              <WFInput
                label="Tenant Code"
                value={tenantCode}
                onChange={setTenantCode}
              />
              <WFSelect
                label="Role"
                value={role}
                onChange={setRole}
                options={[
                  "Organization Admin",
                  "Procurement Admin",
                  "Tender Creator",
                  "Tender Approver",
                ]}
              />
              <CardSelect
                title="Approved Modules"
                values={approvedModules}
                options={modules}
                onChange={setApprovedModules}
              />
              <label className="wf-check">
                <input
                  type="checkbox"
                  checked={dsc}
                  onChange={(e) => setDsc(e.target.checked)}
                />{" "}
                DSC required for operational login
              </label>
            </>
          )}
          {action === "QUERY" && (
            <>
              <WFInput
                label="Query Subject"
                value={subject}
                onChange={setSubject}
              />
              <WFInput
                label="Required Correction"
                value={correction}
                onChange={setCorrection}
              />
            </>
          )}
          <label>
            Decision notes
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <button
            className="wf-primary"
            disabled={action !== "APPROVE" && !note}
            onClick={decide}
          >
            Confirm {action}
          </button>
        </aside>
      </div>
    </section>
  );
}

function WFInput({
  label,
  value = "",
  onChange,
  type = "text",
  required,
  readOnly,
  hint,
}) {
  const isMobile = /mobile|contact number/i.test(label);
  return (
    <label className="wf-field">
      <span>
        {label}
        {required && " *"}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(isMobile ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value)}
        required={required}
        readOnly={readOnly}
        maxLength={isMobile ? 10 : undefined}
        minLength={isMobile ? 10 : undefined}
        inputMode={isMobile ? "numeric" : undefined}
        pattern={isMobile ? "[0-9]{10}" : undefined}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}
function WFSelect({ label, value = "", onChange, options, optionLabels = {} }) {
  return (
    <label className="wf-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.filter(Boolean).map((x) => (
          <option key={x} value={x}>{optionLabels[x] || x}</option>
        ))}
      </select>
    </label>
  );
}
function FormSection({ title, children }) {
  return (
    <section className="form-section-v2">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
function CardSelect({ title, values, options, onChange }) {
  const toggle = (x) =>
    onChange(
      values.includes(x) ? values.filter((v) => v !== x) : [...values, x],
    );
  return (
    <FormSection title={title}>
      <div className="card-select-v2">
        {options.map((x) => (
          <button
            className={values.includes(x) ? "selected" : ""}
            key={x}
            onClick={() => toggle(x)}
          >
            <CheckCircle2 />
            {x}
          </button>
        ))}
      </div>
    </FormSection>
  );
}
function Repeatable({ title, items = [{}], setItems, fields }) {
  const update = (index, name, value) =>
    setItems(items.map((x, i) => (i === index ? { ...x, [name]: value } : x)));
  return (
    <FormSection title={title}>
      {items.map((item, index) => (
        <div className="repeat-card" key={index}>
          <strong>
            {title.replace(/s$/, "")} {index + 1}
          </strong>
          <div className="wf-grid">
            {fields.map((f) => (
              <WFInput
                key={f}
                label={f}
                value={item[f] || ""}
                onChange={(v) => update(index, f, v)}
              />
            ))}
          </div>
          {items.length > 1 && (
            <button
              className="wf-danger"
              onClick={() => setItems(items.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button className="wf-secondary" onClick={() => setItems([...items, {}])}>
        + Add Another
      </button>
    </FormSection>
  );
}
function DynamicFields({ title, fields, data, update, user }) {
  const mapped = {
    "Authorized Person": user.displayName,
    "Registered Mobile": user.mobile,
    "Registered Email": user.email,
    "Company Full Name": data.companyName,
  };
  return (
    <FormSection title={title}>
      <div className="wf-grid">
        {fields.map((f) => (
          <WFInput
            key={f}
            label={f}
            value={mapped[f] ?? data[f] ?? ""}
            readOnly={
              mapped[f] !== undefined &&
              [
                "Authorized Person",
                "Registered Mobile",
                "Registered Email",
              ].includes(f)
            }
            onChange={(v) => update(f, v)}
          />
        ))}
      </div>
    </FormSection>
  );
}
function DocumentUpload({ documents, onChange, types }) {
  const add = (type, file) => {
    const meta = fileMeta(file);
    if (meta)
      onChange([
        ...documents.filter((x) => x.documentType !== type),
        { ...meta, documentType: type },
      ]);
  };
  return (
    <FormSection title="Document Metadata">
      <p className="wf-note">
        Only file metadata is persisted; file contents are not stored in
        localStorage.
      </p>
      {types.map((type) => (
        <label className="upload-v2" key={type}>
          <strong>{type}</strong>
          <input type="file" onChange={(e) => add(type, e.target.files[0])} />
          <span>
            {documents.find((x) => x.documentType === type)?.name ||
              "Choose file"}
          </span>
        </label>
      ))}
    </FormSection>
  );
}
function ReviewData({ data, user, onDeclaration }) {
  const show = (value) =>
    Array.isArray(value)
      ? `${value.length} record(s)`
      : typeof value === "object"
        ? "Saved"
        : String(value || "—");
  return (
    <FormSection title="Review & Submit">
      <div className="review-v2">
        <article>
          <h3>Organization</h3>
          <p>
            {data.organizationName || data.companyName || user.organizationName}
          </p>
        </article>
        <article>
          <h3>User</h3>
          <p>{user.userId}</p>
        </article>
        <article>
          <h3>Modules</h3>
          <p>{data.modules?.join(", ") || "Bidder portal modules"}</p>
        </article>
        {data.advancedPrivileges && (
          <article>
            <h3>Advanced Procurement Configuration</h3>
            <p>
              {Object.entries(data.advancedPrivileges)
                .map(
                  ([key, value]) =>
                    `${key.replace(/([A-Z])/g, " $1")}: ${value}`,
                )
                .join(" · ")}
            </p>
          </article>
        )}
        {data.bankConfiguration && (
          <article>
            <h3>Client Bank / Payment Configuration</h3>
            <p>
              {data.bankConfiguration.accountHolderName || "—"} ·{" "}
              {data.bankConfiguration.accountType || "—"} ·{" "}
              {data.bankConfiguration.ifsc || "—"} · Account ending{" "}
              {data.bankConfiguration.accountNumber?.slice(-4) || "—"}
            </p>
          </article>
        )}
        {(data.integrations || []).map((integration, index) => (
          <article key={integration.id || index}>
            <h3>
              Integration {index + 1}:{" "}
              {integration.system === "Other"
                ? integration.otherSystem
                : integration.system}
            </h3>
            <p>
              Purpose: {integration.purpose?.join(", ") || "—"} · Direction:{" "}
              {integration.direction || "—"} · Method:{" "}
              {integration.methods?.join(", ") || "—"} · Frequency:{" "}
              {integration.frequency || "—"} · Technical Contact:{" "}
              {[
                integration.technicalContactName,
                integration.technicalContactEmail,
                integration.technicalContactMobile,
              ]
                .filter(Boolean)
                .join(" / ") || "—"}{" "}
              · Remarks: {integration.remarks || "—"}
            </p>
          </article>
        ))}
        {data.authenticationPolicyRequest?.loginPolicy && (
          <article>
            <h3>Login Authentication Policy</h3>
            <p>
              Primary:{" "}
              {data.authenticationPolicyRequest.loginPolicy.primaryMethod ||
                "—"}{" "}
              · Additional:{" "}
              {data.authenticationPolicyRequest.loginPolicy.additionalMethods?.join(
                ", ",
              ) || "—"}{" "}
              · DSC Login:{" "}
              {data.authenticationPolicyRequest.loginPolicy.dscRequiredForLogin
                ? "Yes"
                : "No"}{" "}
              · MFA:{" "}
              {data.authenticationPolicyRequest.loginPolicy.mfaRequired
                ? "Yes"
                : "No"}
            </p>
          </article>
        )}
        {(data.authenticationPolicyRequest?.processRules || []).map(
          (rule, index) => (
            <article key={rule.id || index}>
              <h3>Process Authentication Rule {index + 1}</h3>
              <p>
                Module: {rule.module || "—"} · Stage:{" "}
                {rule.processStage === "Other"
                  ? rule.otherProcessStage
                  : rule.processStage || "—"}{" "}
                · Confirmation: {rule.confirmationRequired || "—"} · Method:{" "}
                {rule.methods?.join(", ") || "—"} · {rule.requirement || "—"} ·
                Re-authentication: {rule.reauthenticationRequired || "—"} ·
                Remarks: {rule.remarks || "—"}
              </p>
            </article>
          ),
        )}
        {Object.entries(data)
          .filter(
            ([key]) =>
              ![
                "advancedPrivileges",
                "bankConfiguration",
                "integrations",
                "authenticationPolicyRequest",
              ].includes(key),
          )
          .slice(0, 12)
          .map(([key, value]) => (
            <article key={key}>
              <h3>{key.replace(/([A-Z])/g, " $1")}</h3>
              <p>{show(value)}</p>
            </article>
          ))}
      </div>
      {onDeclaration && (
        <label className="wf-check">
          <input
            type="checkbox"
            checked={!!data.declaration}
            onChange={(e) => onDeclaration(e.target.checked)}
          />{" "}
          I declare that the submitted information is correct and accept the
          Terms & Conditions.
        </label>
      )}
    </FormSection>
  );
}
function PackageCards({ value, onChange }) {
  const packages = portalRepository.snapshot().packages;
  return (
    <FormSection title="Select Subscription Package">
      <div className="package-grid-v2">
        {packages.map((p) => (
          <button
            className={value === p.id ? "selected" : ""}
            key={p.id}
            onClick={() => onChange(p.id)}
          >
            <Package />
            <h2>
              {p.years} Year{p.years > 1 ? "s" : ""}
            </h2>
            <strong>₹{(p.amount + p.tax).toLocaleString("en-IN")}</strong>
            <small>
              ₹{p.amount.toLocaleString("en-IN")} + ₹{p.tax} tax
            </small>
          </button>
        ))}
      </div>
    </FormSection>
  );
}
function PaymentPanel({ packageId, onPay }) {
  const pkg = portalRepository
    .snapshot()
    .packages.find((x) => x.id === packageId);
  return (
    <FormSection title="Demo Payment">
      <div className="payment-v2">
        <CreditCard />
        <h2>₹{(pkg.amount + pkg.tax).toLocaleString("en-IN")}</h2>
        <p>{pkg.name} · Includes mock tax</p>
        <p>No real payment gateway or card details are used.</p>
        <button className="wf-primary" onClick={() => onPay("SUCCESS")}>
          Simulate Payment Success
        </button>
        <button className="wf-secondary" onClick={() => onPay("PENDING")}>
          Save as Payment Pending
        </button>
      </div>
    </FormSection>
  );
}
