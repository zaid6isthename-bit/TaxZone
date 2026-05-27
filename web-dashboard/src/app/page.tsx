"use client";
import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#4F6EF7", primaryDark: "#2D4DD6", accent: "#22D3EE",
  success: "#10B981", warning: "#F59E0B", danger: "#EF4444",
  surface: "#111827", surface2: "#1f2937", surface3: "#374151",
  text: "#F9FAFB", textMuted: "#9CA3AF", textDim: "#6B7280",
};

const STAGES = ["Initiated", "Documents", "Review", "Filed"];

type Doc = { id: string; name: string; status: string };
type Filing = { id: string; name: string; type: string; status: string; stage: number; amount: string; deadline: string; docs: Doc[] };
type Client = { id: string; name: string; pan: string; email: string; phone: string; avatar: string; filings: Filing[]; pendingDocs: number; tags: string[] };

const INIT_CLIENTS: Client[] = [
  { id:"C001", name:"Arjun Mehta", pan:"ABCDE1234F", email:"arjun@example.com", phone:"+91 98765 43210", avatar:"AM", tags:["GST","ITR"], pendingDocs:2,
    filings:[
      { id:"F001", name:"ITR Filing FY 2024-25", type:"Income Tax", status:"In Progress", stage:2, amount:"₹1,24,500", deadline:"31 Jul 2025",
        docs:[{id:"D1",name:"Form 16",status:"Uploaded"},{id:"D2",name:"Bank Statement",status:"Pending"},{id:"D3",name:"Investment Proof",status:"Approved"}] },
      { id:"F002", name:"GST Return Q1 2025", type:"GST", status:"Pending Review", stage:1, amount:"₹45,200", deadline:"20 Apr 2025",
        docs:[{id:"D4",name:"Sales Invoice",status:"Uploaded"},{id:"D5",name:"Purchase Invoice",status:"Approved"}] }
    ]},
  { id:"C002", name:"Priya Sharma", pan:"FGHIJ5678K", email:"priya@example.com", phone:"+91 87654 32109", avatar:"PS", tags:["ITR","TDS"], pendingDocs:1,
    filings:[
      { id:"F003", name:"ITR Filing FY 2024-25", type:"Income Tax", status:"Under Review", stage:3, amount:"₹87,300", deadline:"31 Jul 2025",
        docs:[{id:"D6",name:"Form 16",status:"Approved"},{id:"D7",name:"Capital Gains Statement",status:"Pending"}] }
    ]},
  { id:"C003", name:"Rohit Ventures", pan:"LMNOP9012Q", email:"rohit@ventures.com", phone:"+91 76543 21098", avatar:"RV", tags:["GST","Company"], pendingDocs:3,
    filings:[
      { id:"F004", name:"GSTR-9 Annual Return", type:"GST Annual", status:"Draft", stage:1, amount:"₹2,34,100", deadline:"31 Dec 2025",
        docs:[{id:"D8",name:"Annual Report",status:"Pending"},{id:"D9",name:"Audit Report",status:"Pending"},{id:"D10",name:"Trial Balance",status:"Uploaded"}] }
    ]},
  { id:"C004", name:"Sunita Patel", pan:"QRSTU3456V", email:"sunita@example.com", phone:"+91 65432 10987", avatar:"SP", tags:["ITR"], pendingDocs:0,
    filings:[
      { id:"F005", name:"ITR Filing FY 2024-25", type:"Income Tax", status:"Completed", stage:4, amount:"₹56,800", deadline:"31 Jul 2025",
        docs:[{id:"D11",name:"Form 16",status:"Approved"},{id:"D12",name:"Bank Statement",status:"Approved"}] }
    ]},
];

const INIT_NOTIFS = [
  { id:"N1", title:"Document Approved", body:"Your Form 16 has been verified.", time:"2m ago", icon:"✅", read:false },
  { id:"N2", title:"Action Required", body:"Please upload your Bank Statement.", time:"1h ago", icon:"⚠️", read:false },
  { id:"N3", title:"Filing Update", body:"ITR Filing is now Under Review.", time:"3h ago", icon:"📋", read:true },
  { id:"N4", title:"Deadline Reminder", body:"GST Return Q1 due in 5 days.", time:"1d ago", icon:"🔔", read:true },
  { id:"N5", title:"Payment Confirmed", body:"Advance tax payment of ₹12,500 confirmed.", time:"2d ago", icon:"💳", read:true },
];

const INIT_CHAT = [
  { id:"m0", from:"specialist", text:"Hello! I'm Priya, your tax specialist. How can I help you today?", time:"10:30 AM" },
  { id:"m1", from:"specialist", text:"I've reviewed your ITR documents. Could you please upload your bank statement?", time:"10:31 AM" },
];

const EMPLOYEES = [
  { id:"E1", name:"Priya Nair", role:"Tax Specialist", clients:8, resolved:24, avatar:"PN" },
  { id:"E2", name:"Kiran Bose", role:"Sr. Accountant", clients:12, resolved:38, avatar:"KB" },
  { id:"E3", name:"Aditi Rao", role:"Tax Specialist", clients:6, resolved:19, avatar:"AR" },
  { id:"E4", name:"Suresh Kumar", role:"GST Consultant", clients:9, resolved:31, avatar:"SK" },
];

function StatusPill({ status }: { status: string }) {
  const colors: Record<string,string> = {
    Approved:"#10B981", Uploaded:"#4F6EF7", Pending:"#F59E0B", Rejected:"#EF4444",
    Completed:"#10B981", "In Progress":"#4F6EF7", "Under Review":"#22D3EE",
    Draft:"#9CA3AF", "Pending Review":"#F59E0B",
  };
  const col = colors[status] || "#6B7280";
  return <span style={{ background:col+"22", color:col, borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:600 }}>{status}</span>;
}

export default function TaxZone() {
  const [phoneScreen, setPhoneScreen] = useState("splash");
  const [activeClientId] = useState("C001");
  const [activeFilingId, setActiveFilingId] = useState("F001");
  const [showNotifOverlay, setShowNotifOverlay] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [chatMessages, setChatMessages] = useState(INIT_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const [otpVal, setOtpVal] = useState(["","","",""]);
  const [loginPhone, setLoginPhone] = useState("");
  const [uploadedDoc, setUploadedDoc] = useState<string|null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [webMode, setWebMode] = useState<"employee"|"admin">("employee");
  const [webTab, setWebTab] = useState("dashboard");
  const [clients, setClients] = useState(INIT_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string|null>(null);
  const [webAlerts, setWebAlerts] = useState([
    { id:"A1", type:"upload", msg:"Arjun Mehta uploaded Bank Statement", time:"Just now", read:false },
    { id:"A2", type:"deadline", msg:"GST Return Q1 deadline in 5 days for 3 clients", time:"2h ago", read:false },
    { id:"A3", type:"action", msg:"Priya Sharma document needs review", time:"4h ago", read:true },
  ]);
  const [showWebAlerts, setShowWebAlerts] = useState(false);
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<string|null>(null);

  useEffect(() => {
    if (phoneScreen === "splash") {
      const t = setTimeout(() => setPhoneScreen("welcome"), 2500);
      return () => clearTimeout(t);
    }
  }, [phoneScreen]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  useEffect(() => {
    if (uploadedDoc) {
      const c = clients.find(x => x.id === activeClientId);
      setWebAlerts(prev => [{ id:"A"+Date.now(), type:"upload", msg:`${c?.name} uploaded ${uploadedDoc}`, time:"Just now", read:false }, ...prev]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedDoc]);

  const activeClient = clients.find(c => c.id === activeClientId)!;
  const activeFiling = activeClient?.filings.find(f => f.id === activeFilingId);
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const unreadNotifs = notifs.filter(n => !n.read).length;
  const unreadWebAlerts = webAlerts.filter(a => !a.read).length;

  function sendChat() {
    if (!chatInput.trim()) return;
    const msg = { id:"m"+Date.now(), from:"user", text:chatInput, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) };
    setChatMessages(p => [...p, msg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages(p => [...p, { id:"mr"+Date.now(), from:"specialist", text:"Got it! I'll look into that right away and update you shortly.", time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) }]);
    }, 1000);
  }

  function downloadDraft() {
    if (!activeFiling) return;
    const txt = [
      "TAXZONE DRAFT FILING", "=".repeat(40),
      `Client: ${activeClient.name}`, `PAN: ${activeClient.pan}`,
      `Filing: ${activeFiling.name}`, `Type: ${activeFiling.type}`,
      `Amount: ${activeFiling.amount}`, `Deadline: ${activeFiling.deadline}`,
      `Status: ${activeFiling.status}`, `Stage: ${STAGES[activeFiling.stage-1]}`, "",
      "DOCUMENTS:", ...activeFiling.docs.map(d => `  - ${d.name}: ${d.status}`), "",
      "[DRAFT - NOT FOR OFFICIAL SUBMISSION]", `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");
    const blob = new Blob([txt], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `TaxZone_Draft_${activeClient.name.replace(" ","_")}.txt`;
    a.click(); URL.revokeObjectURL(url);
  }

  function approveDoc(cId:string, fId:string, dId:string) {
    setClients(p => p.map(c => c.id!==cId ? c : { ...c, filings:c.filings.map(f => f.id!==fId ? f : { ...f, docs:f.docs.map(d => d.id!==dId ? d : {...d,status:"Approved"}) }) }));
  }
  function rejectDoc(cId:string, fId:string, dId:string) {
    setClients(p => p.map(c => c.id!==cId ? c : { ...c, filings:c.filings.map(f => f.id!==fId ? f : { ...f, docs:f.docs.map(d => d.id!==dId ? d : {...d,status:"Rejected"}) }) }));
  }

  const card: React.CSSProperties = { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:16 };
  const btn = (bg:string, col="#fff"): React.CSSProperties => ({ background:bg, color:col, border:"none", borderRadius:10, padding:"9px 14px", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 });

  function PhoneHeader({ title, onBack }: { title:string; onBack?:()=>void }) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
        {onBack && <button onClick={onBack} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, width:32, height:32, color:"#fff", cursor:"pointer", fontSize:16 }}>←</button>}
        <span style={{ fontWeight:700, fontSize:16 }}>{title}</span>
      </div>
    );
  }

  function PhoneNav({ active }:{ active:string }) {
    const items = [{id:"main-home",icon:"🏠",label:"Home"},{id:"main-docs",icon:"📄",label:"Docs"},{id:"main-filings",icon:"📋",label:"Filings"},{id:"alerts",icon:"🔔",label:"Alerts"},{id:"profile",icon:"👤",label:"Profile"}];
    return (
      <div style={{ display:"flex", borderTop:"1px solid rgba(255,255,255,0.08)", background:"#0d1420", flexShrink:0 }}>
        {items.map(item => (
          <button key={item.id} onClick={() => setPhoneScreen(item.id)}
            style={{ flex:1, padding:"8px 4px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ fontSize:9, color:active===item.id ? C.primary : C.textDim, fontWeight:active===item.id?700:400 }}>{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display:"flex", width:"100vw", height:"100vh", background:"linear-gradient(135deg,#0a0f1e 0%,#0d1a35 60%,#0a1628 100%)", overflow:"hidden" }}>

      {/* ══ LEFT: Phone Emulator ══ */}
      <div style={{ width:370, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", padding:20, borderRight:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width:330, height:"calc(100vh - 40px)", maxHeight:720, background:"#111827", borderRadius:40, boxShadow:"0 0 0 2px #374151, 0 0 60px rgba(79,110,247,0.25)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {/* Status bar */}
          <div style={{ height:28, background:"#0d1420", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", fontSize:11, color:C.textMuted, flexShrink:0 }}>
            <span>9:41</span>
            <div style={{ width:60, height:10, background:"#1f2937", borderRadius:10 }} />
            <span>WiFi ▐▐</span>
          </div>

          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", position:"relative" }}>

            {/* SPLASH */}
            {phoneScreen==="splash" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#1a1f3e,#0d1a35)", gap:16 }}>
                <div style={{ width:80, height:80, borderRadius:24, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, boxShadow:"0 0 40px rgba(79,110,247,0.5)" }}>💼</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28, fontWeight:800 }}>TaxZone</div>
                  <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>Your Tax, Simplified</div>
                </div>
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:i===0?20:6, height:6, borderRadius:3, background:i===0?C.primary:"rgba(255,255,255,0.2)" }} />)}
                </div>
              </div>
            )}

            {/* WELCOME */}
            {phoneScreen==="welcome" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#1a1f3e,#0d1a35)", padding:24, gap:20 }}>
                <div style={{ width:100, height:100, borderRadius:30, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, boxShadow:"0 0 60px rgba(79,110,247,0.4)" }}>💼</div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:30, fontWeight:800 }}>TaxZone</div>
                  <div style={{ fontSize:13, color:C.textMuted, marginTop:8, lineHeight:1.6 }}>File taxes smarter. Get expert help. Stay compliant.</div>
                </div>
                <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
                  <button onClick={() => setPhoneScreen("login")} style={{ ...btn("linear-gradient(135deg,#4F6EF7,#2D4DD6)"), justifyContent:"center", padding:"14px", borderRadius:14, fontSize:15, width:"100%" }}>Get Started</button>
                  <button onClick={() => setPhoneScreen("login")} style={{ ...btn("transparent"), justifyContent:"center", padding:"14px", borderRadius:14, fontSize:15, width:"100%", border:"1px solid rgba(255,255,255,0.15)" }}>Login</button>
                </div>
              </div>
            )}

            {/* LOGIN */}
            {phoneScreen==="login" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#111827", padding:24, gap:20 }}>
                <div style={{ marginTop:16 }}>
                  <div style={{ fontSize:24, fontWeight:800 }}>Welcome back 👋</div>
                  <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>Enter your phone number to continue</div>
                </div>
                <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:C.textMuted }}>🇮🇳 +91</span>
                  <input value={loginPhone} onChange={e => setLoginPhone(e.target.value)} placeholder="Phone number" style={{ flex:1, background:"none", color:"#fff", fontSize:15 }} />
                </div>
                <button onClick={() => { setOtpVal(["1","2","3","4"]); setPhoneScreen("otp"); }} style={{ ...btn("linear-gradient(135deg,#4F6EF7,#2D4DD6)"), justifyContent:"center", padding:"14px", borderRadius:14, fontSize:15 }}>Send OTP</button>
                <div style={{ textAlign:"center", fontSize:12, color:C.textMuted, marginTop:"auto" }}>By continuing you agree to our Terms &amp; Privacy</div>
              </div>
            )}

            {/* OTP */}
            {phoneScreen==="otp" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#111827", padding:24, gap:20 }}>
                <button onClick={() => setPhoneScreen("login")} style={{ background:"none", border:"none", color:C.textMuted, fontSize:14, cursor:"pointer", textAlign:"left" }}>← Back</button>
                <div>
                  <div style={{ fontSize:24, fontWeight:800 }}>Verify OTP</div>
                  <div style={{ fontSize:13, color:C.textMuted, marginTop:4 }}>Code sent to +91 {loginPhone || "98765 43210"}</div>
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  {otpVal.map((v,i) => (
                    <input key={i} maxLength={1} value={v} onChange={e => { const n=[...otpVal]; n[i]=e.target.value; setOtpVal(n); }}
                      style={{ width:52, height:56, textAlign:"center", fontSize:22, fontWeight:700, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:12, color:"#fff" }} />
                  ))}
                </div>
                <button onClick={() => setPhoneScreen("main-home")} style={{ ...btn("linear-gradient(135deg,#4F6EF7,#2D4DD6)"), justifyContent:"center", padding:"14px", borderRadius:14, fontSize:15 }}>Verify &amp; Login</button>
              </div>
            )}

            {/* MAIN HOME */}
            {phoneScreen==="main-home" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                {/* Header */}
                <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
                  <div>
                    <div style={{ fontSize:11, color:C.textMuted }}>Good morning,</div>
                    <div style={{ fontSize:16, fontWeight:700 }}>Arjun Mehta 👋</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => { setShowNotifOverlay(true); setShowProfileOverlay(false); }}
                      style={{ position:"relative", background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16 }}>
                      🔔
                      {unreadNotifs>0 && <span style={{ position:"absolute", top:4, right:4, width:8, height:8, background:C.danger, borderRadius:"50%", display:"block" }} />}
                    </button>
                    <button onClick={() => { setShowProfileOverlay(true); setShowNotifOverlay(false); }}
                      style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:"#fff" }}>AM</button>
                  </div>
                </div>
                {/* Scrollable */}
                <div style={{ flex:1, overflowY:"auto", padding:"0 16px 16px" }}>
                  <div style={{ background:"linear-gradient(135deg,#4F6EF7,#2D4DD6)", borderRadius:16, padding:16, marginBottom:16 }}>
                    <div style={{ fontSize:12, opacity:0.8 }}>Pending Actions</div>
                    <div style={{ fontSize:28, fontWeight:800, marginTop:4 }}>2</div>
                    <div style={{ fontSize:12, opacity:0.8 }}>Documents awaiting upload</div>
                    <button onClick={() => setPhoneScreen("main-docs")} style={{ marginTop:10, background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8, padding:"6px 12px", color:"#fff", fontSize:12, cursor:"pointer" }}>View Documents →</button>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:10, letterSpacing:1, textTransform:"uppercase" }}>Active Filings</div>
                  {activeClient.filings.map(f => (
                    <div key={f.id} onClick={() => { setActiveFilingId(f.id); setPhoneScreen("filing-detail"); }} style={{ ...card, marginBottom:10, cursor:"pointer" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <div style={{ fontSize:13, fontWeight:600, flex:1, paddingRight:8 }}>{f.name}</div>
                        <StatusPill status={f.status} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:C.textMuted }}>
                        <span>{f.type}</span><span>Due: {f.deadline}</span>
                      </div>
                      <div style={{ display:"flex", gap:3, marginTop:8 }}>
                        {STAGES.map((_,i) => <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<f.stage?C.primary:"rgba(255,255,255,0.1)" }} />)}
                      </div>
                    </div>
                  ))}
                  <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, margin:"14px 0 10px", letterSpacing:1, textTransform:"uppercase" }}>Your Specialist</div>
                  <div style={{ ...card, display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:14, background:"linear-gradient(135deg,#10B981,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, flexShrink:0 }}>PN</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:600 }}>Priya Nair</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>Senior Tax Specialist</div>
                    </div>
                    <button onClick={() => setPhoneScreen("support-chat")} style={{ background:C.primary+"22", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:18 }}>💬</button>
                  </div>
                </div>
                {/* Notif overlay */}
                {showNotifOverlay && (
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", zIndex:20 }} onClick={() => setShowNotifOverlay(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ background:"#1f2937", borderRadius:"0 0 20px 20px" }}>
                      <div style={{ padding:"14px 16px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                        <span style={{ fontWeight:700 }}>Notifications</span>
                        <button onClick={() => setNotifs(p => p.map(n => ({...n,read:true})))} style={{ background:"none", border:"none", color:C.primary, fontSize:12, cursor:"pointer" }}>Mark all read</button>
                      </div>
                      {notifs.slice(0,4).map(n => (
                        <div key={n.id} style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:n.read?"transparent":"rgba(79,110,247,0.08)", display:"flex", gap:10 }}>
                          <span style={{ fontSize:18 }}>{n.icon}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:600 }}>{n.title}</div>
                            <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{n.body}</div>
                          </div>
                          <span style={{ fontSize:10, color:C.textDim }}>{n.time}</span>
                        </div>
                      ))}
                      <button onClick={() => setShowNotifOverlay(false)} style={{ width:"100%", padding:12, background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:13 }}>Close</button>
                    </div>
                  </div>
                )}
                {/* Profile overlay */}
                {showProfileOverlay && (
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", zIndex:20, display:"flex", flexDirection:"column", justifyContent:"flex-end" }} onClick={() => setShowProfileOverlay(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ background:"#1f2937", borderRadius:"20px 20px 0 0", padding:20 }}>
                      <div style={{ textAlign:"center", marginBottom:16 }}>
                        <div style={{ width:64, height:64, borderRadius:20, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:700, margin:"0 auto 10px" }}>AM</div>
                        <div style={{ fontSize:16, fontWeight:700 }}>Arjun Mehta</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>arjun@example.com</div>
                      </div>
                      {[
                        { icon:"📋", label:"My Filings", action:() => { setShowProfileOverlay(false); setPhoneScreen("main-filings"); } },
                        { icon:"🔔", label:"Notifications", action:() => { setShowProfileOverlay(false); setPhoneScreen("alerts"); } },
                        { icon:"👤", label:"View Profile", action:() => { setShowProfileOverlay(false); setPhoneScreen("profile"); } },
                        { icon:"💬", label:"Support Chat", action:() => { setShowProfileOverlay(false); setPhoneScreen("support-chat"); } },
                        { icon:"🚪", label:"Log Out", action:() => { setShowProfileOverlay(false); setPhoneScreen("welcome"); } },
                      ].map((item,i) => (
                        <button key={i} onClick={item.action} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderRadius:10, padding:"12px 14px", color:item.label==="Log Out"?C.danger:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:12, marginBottom:6, fontSize:14 }}>
                          <span>{item.icon}</span><span>{item.label}</span><span style={{ marginLeft:"auto", color:C.textDim }}>›</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <PhoneNav active="main-home" />
              </div>
            )}

            {/* DOCUMENTS */}
            {phoneScreen==="main-docs" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                <PhoneHeader title="Documents" onBack={() => setPhoneScreen("main-home")} />
                <div style={{ flex:1, overflowY:"auto", padding:16 }}>
                  <div style={{ display:"flex", gap:8, marginBottom:14, overflowX:"auto" }}>
                    {["All","Pending","Uploaded","Approved"].map(c => (
                      <button key={c} style={{ background:c==="All"?C.primary:"rgba(255,255,255,0.08)", border:"none", borderRadius:20, padding:"5px 12px", color:"#fff", fontSize:12, cursor:"pointer", flexShrink:0 }}>{c}</button>
                    ))}
                  </div>
                  {activeClient.filings.flatMap(f => f.docs.map(d => ({ ...d, filingName:f.name, filingId:f.id }))).map(doc => (
                    <div key={doc.id} style={{ ...card, marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <div style={{ fontSize:14, fontWeight:600 }}>{doc.name}</div>
                        <StatusPill status={doc.status} />
                      </div>
                      <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>{doc.filingName}</div>
                      {doc.status==="Pending" && (
                        <button onClick={() => setUploadedDoc(doc.name)} style={{ ...btn(C.primary), fontSize:12, padding:"7px 12px" }}>📤 Upload</button>
                      )}
                      {uploadedDoc===doc.name && <div style={{ marginTop:6, fontSize:11, color:C.success }}>✅ Uploaded successfully!</div>}
                    </div>
                  ))}
                </div>
                <PhoneNav active="main-docs" />
              </div>
            )}

            {/* FILINGS */}
            {phoneScreen==="main-filings" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                <PhoneHeader title="My Filings" onBack={() => setPhoneScreen("main-home")} />
                <div style={{ flex:1, overflowY:"auto", padding:16 }}>
                  {activeClient.filings.map(f => (
                    <div key={f.id} onClick={() => { setActiveFilingId(f.id); setPhoneScreen("filing-detail"); }} style={{ ...card, marginBottom:12, cursor:"pointer" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <div style={{ fontSize:14, fontWeight:600, flex:1, paddingRight:8 }}>{f.name}</div>
                        <StatusPill status={f.status} />
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.textMuted, marginBottom:10 }}>
                        <span>{f.type}</span><span>{f.amount}</span>
                      </div>
                      <div style={{ display:"flex", gap:3 }}>
                        {STAGES.map((s,i) => (
                          <div key={i} style={{ flex:1 }}>
                            <div style={{ height:3, borderRadius:2, background:i<f.stage?C.primary:"rgba(255,255,255,0.1)", marginBottom:3 }} />
                            <div style={{ fontSize:8, color:i<f.stage?C.primary:C.textDim, textAlign:"center" }}>{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <PhoneNav active="main-filings" />
              </div>
            )}

            {/* FILING DETAIL */}
            {phoneScreen==="filing-detail" && activeFiling && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
                  <button onClick={() => setPhoneScreen("main-filings")} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, width:32, height:32, color:"#fff", cursor:"pointer", fontSize:16 }}>←</button>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700 }}>{activeFiling.name}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{activeFiling.type}</div>
                  </div>
                  <StatusPill status={activeFiling.status} />
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:16 }}>
                  {/* Stage tracker */}
                  <div style={{ ...card, marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>Progress</div>
                    <div style={{ display:"flex" }}>
                      {STAGES.map((s,i) => (
                        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                          <div style={{ width:"100%", display:"flex", alignItems:"center" }}>
                            {i>0 && <div style={{ flex:1, height:2, background:i<activeFiling.stage?C.primary:"rgba(255,255,255,0.1)" }} />}
                            <div style={{ width:24, height:24, borderRadius:"50%", background:i<activeFiling.stage?C.primary:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{i<activeFiling.stage?"✓":i+1}</div>
                            {i<STAGES.length-1 && <div style={{ flex:1, height:2, background:i+1<activeFiling.stage?C.primary:"rgba(255,255,255,0.1)" }} />}
                          </div>
                          <div style={{ fontSize:9, color:i<activeFiling.stage?C.primary:C.textDim, marginTop:4, textAlign:"center" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Details grid */}
                  <div style={{ ...card, marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Filing Details</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      {[{l:"Amount",v:activeFiling.amount},{l:"Deadline",v:activeFiling.deadline},{l:"PAN",v:activeClient.pan},{l:"Docs",v:`${activeFiling.docs.filter(d=>d.status==="Approved").length}/${activeFiling.docs.length} OK`}].map(item => (
                        <div key={item.l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:10 }}>
                          <div style={{ fontSize:10, color:C.textMuted }}>{item.l}</div>
                          <div style={{ fontSize:13, fontWeight:700, marginTop:2 }}>{item.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Documents */}
                  <div style={{ ...card, marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Documents</div>
                    {activeFiling.docs.map(doc => (
                      <div key={doc.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}><span>📄</span><span style={{ fontSize:13 }}>{doc.name}</span></div>
                        <StatusPill status={doc.status} />
                      </div>
                    ))}
                  </div>
                  {/* Action buttons */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                    <button onClick={downloadDraft} style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:14, padding:"14px 10px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:24 }}>⬇️</span>
                      <span style={{ fontSize:11, fontWeight:700, color:C.success }}>Download Draft</span>
                    </button>
                    <button onClick={() => setPhoneScreen("support-chat")} style={{ background:"rgba(79,110,247,0.12)", border:"1px solid rgba(79,110,247,0.25)", borderRadius:14, padding:"14px 10px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:24 }}>💬</span>
                      <span style={{ fontSize:11, fontWeight:700, color:C.primary }}>Support Chat</span>
                    </button>
                  </div>
                  {/* Timeline */}
                  <div style={{ ...card }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Timeline</div>
                    {[
                      { icon:"🚀", text:"Filing initiated", date:"1 Apr 2025", done:true },
                      { icon:"📤", text:"Documents requested", date:"5 Apr 2025", done:true },
                      { icon:"🔍", text:"Review in progress", date:"20 Apr 2025", done:activeFiling.stage>=3 },
                      { icon:"🏁", text:"Filed with department", date:"31 Jul 2025", done:activeFiling.stage>=4 },
                    ].map((t,i) => (
                      <div key={i} style={{ display:"flex", gap:10, padding:"8px 0", opacity:t.done?1:0.4 }}>
                        <span style={{ fontSize:16 }}>{t.icon}</span>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600 }}>{t.text}</div>
                          <div style={{ fontSize:10, color:C.textMuted }}>{t.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUPPORT CHAT */}
            {phoneScreen==="support-chat" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                <div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
                  <button onClick={() => setPhoneScreen("main-home")} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, width:32, height:32, color:"#fff", cursor:"pointer", fontSize:16 }}>←</button>
                  <div style={{ width:36, height:36, borderRadius:12, background:"linear-gradient(135deg,#10B981,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>PN</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700 }}>Priya Nair</div>
                    <div style={{ fontSize:10, color:C.success }}>● Online</div>
                  </div>
                  <span style={{ fontSize:18, cursor:"pointer" }}>📞</span>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ display:"flex", flexDirection:msg.from==="user"?"row-reverse":"row", alignItems:"flex-end", gap:8 }}>
                      {msg.from==="specialist" && (
                        <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#10B981,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>PN</div>
                      )}
                      <div style={{ maxWidth:"72%", background:msg.from==="user"?"linear-gradient(135deg,#4F6EF7,#2D4DD6)":"rgba(255,255,255,0.08)", borderRadius:msg.from==="user"?"14px 14px 4px 14px":"4px 14px 14px 14px", padding:"9px 12px" }}>
                        <div style={{ fontSize:13, lineHeight:1.4 }}>{msg.text}</div>
                        <div style={{ fontSize:9, color:"rgba(255,255,255,0.5)", marginTop:3, textAlign:"right" }}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", gap:8, flexShrink:0 }}>
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendChat()}
                    placeholder="Type a message…"
                    style={{ flex:1, background:"rgba(255,255,255,0.07)", borderRadius:20, padding:"10px 14px", color:"#fff", fontSize:13, border:"1px solid rgba(255,255,255,0.1)" }} />
                  <button onClick={sendChat} style={{ width:40, height:40, borderRadius:12, background:C.primary, border:"none", cursor:"pointer", fontSize:18 }}>➤</button>
                </div>
              </div>
            )}

            {/* ALERTS SCREEN */}
            {phoneScreen==="alerts" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                <div style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
                  <span style={{ fontSize:16, fontWeight:700 }}>Alerts &amp; Updates</span>
                  <button onClick={() => setNotifs(p => p.map(n => ({...n,read:true})))} style={{ background:"none", border:"none", color:C.primary, fontSize:12, cursor:"pointer" }}>Clear all</button>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:16 }}>
                  {notifs.map(n => (
                    <div key={n.id} onClick={() => setNotifs(p => p.map(x => x.id===n.id?{...x,read:true}:x))}
                      style={{ ...card, marginBottom:10, background:n.read?"rgba(255,255,255,0.03)":"rgba(79,110,247,0.1)", borderColor:n.read?"rgba(255,255,255,0.06)":"rgba(79,110,247,0.2)", cursor:"pointer", display:"flex", gap:12 }}>
                      <span style={{ fontSize:22 }}>{n.icon}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between" }}>
                          <span style={{ fontSize:13, fontWeight:700 }}>{n.title}</span>
                          <span style={{ fontSize:10, color:C.textDim }}>{n.time}</span>
                        </div>
                        <div style={{ fontSize:12, color:C.textMuted, marginTop:3 }}>{n.body}</div>
                      </div>
                      {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:C.primary, flexShrink:0, marginTop:4 }} />}
                    </div>
                  ))}
                </div>
                <PhoneNav active="alerts" />
              </div>
            )}

            {/* PROFILE SCREEN */}
            {phoneScreen==="profile" && (
              <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", background:"#111827" }}>
                <div style={{ background:"linear-gradient(160deg,#1a2a4a,#0d1a35)", padding:"24px 20px 20px", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                  <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700 }}>AM</div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800 }}>Arjun Mehta</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>PAN: ABCDE1234F</div>
                  </div>
                  <div style={{ display:"flex", gap:20, marginTop:4 }}>
                    {[{l:"Filings",v:"2"},{l:"Docs",v:"5"},{l:"Saved",v:"₹24K"}].map(s => (
                      <div key={s.l} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:18, fontWeight:800, color:C.primary }}>{s.v}</div>
                        <div style={{ fontSize:10, color:C.textMuted }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flex:1, overflowY:"auto", padding:16 }}>
                  <div style={{ ...card, marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:10, letterSpacing:1, textTransform:"uppercase" }}>Personal Info</div>
                    {[{l:"Email",v:"arjun@example.com"},{l:"Phone",v:"+91 98765 43210"},{l:"PAN",v:"ABCDE1234F"},{l:"Aadhaar",v:"XXXX XXXX 4321"}].map(f => (
                      <div key={f.l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize:12, color:C.textMuted }}>{f.l}</span>
                        <span style={{ fontSize:13, fontWeight:600 }}>{f.v}</span>
                      </div>
                    ))}
                  </div>
                  {[
                    { icon:"🔔", label:"Notifications", action:() => setPhoneScreen("alerts") },
                    { icon:"💬", label:"Support Chat", action:() => setPhoneScreen("support-chat") },
                    { icon:"🔒", label:"Security & Privacy", action:() => {} },
                    { icon:"⭐", label:"Rate the App", action:() => {} },
                    { icon:"🚪", label:"Log Out", action:() => setPhoneScreen("welcome") },
                  ].map((item,i) => (
                    <button key={i} onClick={item.action} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"none", borderRadius:10, padding:"12px 14px", color:item.label==="Log Out"?C.danger:"#fff", cursor:"pointer", display:"flex", alignItems:"center", gap:12, marginBottom:6, fontSize:14 }}>
                      <span>{item.icon}</span><span>{item.label}</span><span style={{ marginLeft:"auto", color:C.textDim }}>›</span>
                    </button>
                  ))}
                </div>
                <PhoneNav active="profile" />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══ RIGHT: Web Console ══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Top bar */}
        <div style={{ height:60, borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", padding:"0 24px", gap:16, flexShrink:0, background:"rgba(255,255,255,0.02)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginRight:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>💼</div>
            <span style={{ fontSize:16, fontWeight:800 }}>TaxZone</span>
            <span style={{ fontSize:11, background:"rgba(79,110,247,0.2)", color:C.primary, padding:"2px 8px", borderRadius:20, fontWeight:600 }}>Console</span>
          </div>
          <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:10, padding:3, gap:2 }}>
            {(["employee","admin"] as const).map(m => (
              <button key={m} onClick={() => { setWebMode(m); setWebTab("dashboard"); }}
                style={{ background:webMode===m?C.primary:"transparent", border:"none", borderRadius:8, padding:"5px 14px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {m==="employee"?"👨‍💼 Employee":"🏢 Org Admin"}
              </button>
            ))}
          </div>
          <div style={{ flex:1 }} />
          {/* Web alerts */}
          <div style={{ position:"relative" }}>
            <button onClick={() => setShowWebAlerts(!showWebAlerts)} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:10, width:38, height:38, cursor:"pointer", fontSize:18, position:"relative" }}>
              🔔
              {unreadWebAlerts>0 && <span style={{ position:"absolute", top:6, right:6, width:8, height:8, background:C.danger, borderRadius:"50%", display:"block" }} />}
            </button>
            {showWebAlerts && (
              <div style={{ position:"absolute", top:46, right:0, width:320, background:"#1f2937", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, zIndex:100, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" }}>
                <div style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontWeight:700 }}>Alerts</span>
                  <button onClick={() => setWebAlerts(p => p.map(a => ({...a,read:true})))} style={{ background:"none", border:"none", color:C.primary, fontSize:12, cursor:"pointer" }}>Mark all read</button>
                </div>
                {webAlerts.map(a => (
                  <div key={a.id} style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)", background:a.read?"transparent":"rgba(79,110,247,0.08)", display:"flex", gap:10 }}>
                    <span style={{ fontSize:18 }}>{a.type==="upload"?"📤":a.type==="deadline"?"⏰":"⚠️"}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13 }}>{a.msg}</div>
                      <div style={{ fontSize:10, color:C.textDim, marginTop:2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowWebAlerts(false)} style={{ width:"100%", padding:10, background:"none", border:"none", color:C.textMuted, fontSize:12, cursor:"pointer" }}>Close</button>
              </div>
            )}
          </div>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>TZ</div>
        </div>

        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* Sidebar */}
          <div style={{ width:200, borderRight:"1px solid rgba(255,255,255,0.07)", padding:"16px 12px", display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
            {(webMode==="employee"
              ? [{id:"dashboard",icon:"📊",label:"Dashboard"},{id:"clients",icon:"👥",label:"Clients"},{id:"documents",icon:"📄",label:"Documents"},{id:"filings",icon:"📋",label:"Filings"}]
              : [{id:"dashboard",icon:"📊",label:"Analytics"},{id:"employees",icon:"👨‍💼",label:"Employees"},{id:"import",icon:"📥",label:"Bulk Import"},{id:"settings",icon:"⚙️",label:"Settings"}]
            ).map(item => (
              <button key={item.id} onClick={() => setWebTab(item.id)}
                style={{ background:webTab===item.id?"rgba(79,110,247,0.2)":"transparent", border:webTab===item.id?"1px solid rgba(79,110,247,0.3)":"1px solid transparent", borderRadius:10, padding:"10px 12px", color:webTab===item.id?C.primary:C.textMuted, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:10, fontWeight:webTab===item.id?600:400, textAlign:"left" }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflowY:"auto", padding:24 }}>

            {/* EMPLOYEE DASHBOARD */}
            {webMode==="employee" && webTab==="dashboard" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>Dashboard</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                  {[{label:"Total Clients",value:"4",icon:"👥",color:C.primary},{label:"Active Filings",value:"5",icon:"📋",color:C.accent},{label:"Pending Docs",value:"6",icon:"📄",color:C.warning},{label:"Completed",value:"1",icon:"✅",color:C.success}].map(s => (
                    <div key={s.label} style={{ ...card, display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:s.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <div style={{ ...card }}>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Recent Clients</div>
                    {clients.slice(0,3).map(c => (
                      <div key={c.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{c.avatar}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:600 }}>{c.name}</div>
                          <div style={{ fontSize:11, color:C.textMuted }}>{c.filings.length} filing{c.filings.length!==1?"s":""}</div>
                        </div>
                        {c.pendingDocs>0 && <span style={{ background:C.warning+"22", color:C.warning, borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{c.pendingDocs} pending</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ ...card }}>
                    <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Live Alerts</div>
                    {webAlerts.slice(0,3).map(a => (
                      <div key={a.id} style={{ display:"flex", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize:18 }}>{a.type==="upload"?"📤":a.type==="deadline"?"⏰":"⚠️"}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12 }}>{a.msg}</div>
                          <div style={{ fontSize:10, color:C.textDim, marginTop:2 }}>{a.time}</div>
                        </div>
                        {!a.read && <div style={{ width:7, height:7, borderRadius:"50%", background:C.primary, flexShrink:0, marginTop:4 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CLIENTS */}
            {webMode==="employee" && webTab==="clients" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>Clients</div>
                <div style={{ display:"grid", gridTemplateColumns:selectedClient?"1fr 1fr":"1fr", gap:16 }}>
                  <div>
                    {clients.map(c => (
                      <div key={c.id} onClick={() => setSelectedClientId(selectedClientId===c.id?null:c.id)}
                        style={{ ...card, marginBottom:12, cursor:"pointer", borderColor:selectedClientId===c.id?"rgba(79,110,247,0.4)":"rgba(255,255,255,0.08)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ width:44, height:44, borderRadius:13, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700 }}>{c.avatar}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:15, fontWeight:700 }}>{c.name}</div>
                            <div style={{ fontSize:12, color:C.textMuted }}>{c.pan} · {c.email}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            {c.pendingDocs>0 && <span style={{ background:C.warning+"22", color:C.warning, borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:600, display:"block", marginBottom:4 }}>{c.pendingDocs} pending</span>}
                            <div style={{ display:"flex", gap:4, justifyContent:"flex-end" }}>
                              {c.tags.map(t => <span key={t} style={{ background:C.primary+"22", color:C.primary, borderRadius:20, padding:"1px 6px", fontSize:10 }}>{t}</span>)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedClient && (
                    <div style={{ ...card }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, paddingBottom:16, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700 }}>{selectedClient.avatar}</div>
                        <div>
                          <div style={{ fontSize:17, fontWeight:800 }}>{selectedClient.name}</div>
                          <div style={{ fontSize:12, color:C.textMuted }}>{selectedClient.email} · {selectedClient.phone}</div>
                        </div>
                      </div>
                      {selectedClient.filings.map(f => (
                        <div key={f.id} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:12, marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                            <span style={{ fontSize:13, fontWeight:600 }}>{f.name}</span>
                            <StatusPill status={f.status} />
                          </div>
                          {f.docs.map(d => (
                            <div key={d.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                              <span style={{ fontSize:12 }}>📄 {d.name}</span>
                              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                <StatusPill status={d.status} />
                                {d.status==="Uploaded" && (
                                  <>
                                    <button onClick={() => approveDoc(selectedClient.id,f.id,d.id)} style={{ ...btn(C.success), padding:"3px 8px", fontSize:11 }}>✓ Approve</button>
                                    <button onClick={() => rejectDoc(selectedClient.id,f.id,d.id)} style={{ ...btn(C.danger), padding:"3px 8px", fontSize:11 }}>✗ Reject</button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {webMode==="employee" && webTab==="documents" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>Documents</div>
                <div style={{ ...card }}>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1.5fr", gap:12, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.1)", fontSize:11, fontWeight:700, color:C.textMuted, textTransform:"uppercase" }}>
                    <span>Document</span><span>Client</span><span>Type</span><span>Status</span><span>Actions</span>
                  </div>
                  {clients.flatMap(c => c.filings.flatMap(f => f.docs.map(d => ({ ...d, clientName:c.name, clientId:c.id, filingId:f.id, filingType:f.type })))).map(doc => (
                    <div key={doc.id} style={{ display:"grid", gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1.5fr", gap:12, padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center" }}>
                      <span style={{ fontSize:13 }}>📄 {doc.name}</span>
                      <span style={{ fontSize:13, color:C.textMuted }}>{doc.clientName}</span>
                      <span style={{ fontSize:11, color:C.textDim }}>{doc.filingType}</span>
                      <StatusPill status={doc.status} />
                      <div style={{ display:"flex", gap:6 }}>
                        {doc.status==="Uploaded" && (
                          <>
                            <button onClick={() => approveDoc(doc.clientId,doc.filingId,doc.id)} style={{ ...btn(C.success), padding:"4px 8px", fontSize:11 }}>Approve</button>
                            <button onClick={() => rejectDoc(doc.clientId,doc.filingId,doc.id)} style={{ ...btn(C.danger), padding:"4px 8px", fontSize:11 }}>Reject</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FILINGS */}
            {webMode==="employee" && webTab==="filings" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>All Filings</div>
                {clients.flatMap(c => c.filings.map(f => ({ ...f, clientName:c.name, clientAvatar:c.avatar }))).map(f => (
                  <div key={f.id} style={{ ...card, marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, flexShrink:0 }}>{f.clientAvatar}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700 }}>{f.name}</div>
                        <div style={{ fontSize:12, color:C.textMuted }}>{f.clientName} · {f.type} · Due: {f.deadline}</div>
                      </div>
                      <StatusPill status={f.status} />
                      <span style={{ fontSize:15, fontWeight:700, color:C.primary, minWidth:70, textAlign:"right" }}>{f.amount}</span>
                    </div>
                    <div style={{ display:"flex", gap:3, marginTop:12 }}>
                      {STAGES.map((s,i) => (
                        <div key={i} style={{ flex:1 }}>
                          <div style={{ height:4, borderRadius:2, background:i<f.stage?C.primary:"rgba(255,255,255,0.1)" }} />
                          <div style={{ fontSize:9, color:i<f.stage?C.primary:C.textDim, marginTop:3 }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADMIN ANALYTICS */}
            {webMode==="admin" && webTab==="dashboard" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>Analytics Overview</div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                  {[{label:"Total Revenue",value:"₹4.8L",icon:"💰",color:C.success},{label:"Active Clients",value:"4",icon:"👥",color:C.primary},{label:"Team Members",value:"4",icon:"👨‍💼",color:C.accent},{label:"Compliance Rate",value:"94%",icon:"✅",color:"#A78BFA"}].map(s => (
                    <div key={s.label} style={{ ...card, display:"flex", alignItems:"center", gap:14 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:s.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
                        <div style={{ fontSize:11, color:C.textMuted }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ ...card }}>
                  <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Filing Type Breakdown</div>
                  {[{label:"Income Tax (ITR)",count:3,pct:60,color:C.primary},{label:"GST Returns",count:2,pct:40,color:C.accent},{label:"TDS Filings",count:1,pct:20,color:"#A78BFA"}].map(b => (
                    <div key={b.label} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                        <span>{b.label}</span><span style={{ color:C.textMuted }}>{b.count} filings</span>
                      </div>
                      <div style={{ height:8, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ width:b.pct+"%", height:"100%", background:b.color, borderRadius:4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EMPLOYEES */}
            {webMode==="admin" && webTab==="employees" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>Team Members</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {EMPLOYEES.map(e => (
                    <div key={e.id} style={{ ...card }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                        <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#4F6EF7,#22D3EE)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700 }}>{e.avatar}</div>
                        <div>
                          <div style={{ fontSize:15, fontWeight:700 }}>{e.name}</div>
                          <div style={{ fontSize:12, color:C.textMuted }}>{e.role}</div>
                        </div>
                        <span style={{ marginLeft:"auto", background:C.success+"22", color:C.success, borderRadius:20, padding:"3px 10px", fontSize:11 }}>Active</span>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:10 }}>
                          <div style={{ fontSize:20, fontWeight:800, color:C.primary }}>{e.clients}</div>
                          <div style={{ fontSize:11, color:C.textMuted }}>Clients</div>
                        </div>
                        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:10 }}>
                          <div style={{ fontSize:20, fontWeight:800, color:C.success }}>{e.resolved}</div>
                          <div style={{ fontSize:11, color:C.textMuted }}>Resolved</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BULK IMPORT */}
            {webMode==="admin" && webTab==="import" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Bulk Client Import</div>
                <div style={{ fontSize:14, color:C.textMuted, marginBottom:20 }}>Paste CSV data (Name, PAN, Email, Phone)</div>
                <div style={{ ...card, marginBottom:16 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:C.textMuted, marginBottom:8 }}>FORMAT EXAMPLE</div>
                  <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:12, fontFamily:"monospace", fontSize:12, color:C.accent, lineHeight:1.8 }}>
                    Name,PAN,Email,Phone<br />
                    Raj Kumar,ABCDE1234F,raj@example.com,9876543210
                  </div>
                </div>
                <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Paste CSV data here…"
                  style={{ width:"100%", minHeight:160, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:16, color:"#fff", fontSize:13, resize:"vertical", fontFamily:"monospace" }} />
                <div style={{ display:"flex", gap:12, marginTop:12 }}>
                  <button onClick={() => { const lines=importText.trim().split("\n").filter(Boolean); setImportResult(lines.length===0?"No data to import.":`✅ ${lines.length} records validated. ${Math.floor(lines.length*0.8)} imported, ${Math.ceil(lines.length*0.2)} flagged.`); }} style={{ ...btn("linear-gradient(135deg,#4F6EF7,#2D4DD6)"), padding:"12px 24px", borderRadius:12, fontSize:14 }}>🚀 Validate &amp; Import</button>
                  <button onClick={() => { setImportText(""); setImportResult(null); }} style={{ ...btn("rgba(255,255,255,0.08)"), padding:"12px 24px", borderRadius:12, fontSize:14 }}>🗑 Clear</button>
                </div>
                {importResult && <div style={{ marginTop:16, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:12, padding:16, fontSize:14, color:C.success }}>{importResult}</div>}
              </div>
            )}

            {/* ADMIN SETTINGS */}
            {webMode==="admin" && webTab==="settings" && (
              <div>
                <div style={{ fontSize:22, fontWeight:800, marginBottom:20 }}>Organization Settings</div>
                {[
                  { section:"Organization", fields:[{l:"Name",v:"TaxZone Pvt Ltd"},{l:"GSTIN",v:"27AABCU9603R1ZX"},{l:"PAN",v:"AABCU9603R"},{l:"Email",v:"admin@taxzone.in"}] },
                  { section:"Preferences", fields:[{l:"Timezone",v:"IST (UTC+5:30)"},{l:"Fiscal Year",v:"April–March"},{l:"Currency",v:"INR (₹)"},{l:"Language",v:"English"}] },
                ].map(group => (
                  <div key={group.section} style={{ ...card, marginBottom:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, marginBottom:12, textTransform:"uppercase", letterSpacing:1 }}>{group.section}</div>
                    {group.fields.map(f => (
                      <div key={f.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize:13, color:C.textMuted }}>{f.l}</span>
                        <span style={{ fontSize:13, fontWeight:600 }}>{f.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
