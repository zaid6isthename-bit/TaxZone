import React from 'react';

export function StitchNavBar({ active, setPhoneScreen }: { active: string, setPhoneScreen: (s: string) => void }) {
  const items = [
    { id: "main-home", icon: "home", label: "Home" },
    { id: "documents", icon: "description", label: "Documents" },
    { id: "filing-detail", icon: "assignment", label: "Filings" },
    { id: "alerts", icon: "notifications", label: "Alerts" },
    { id: "profile", icon: "person", label: "Profile" }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface shadow-lg border-t border-outline-variant/30" style={{ maxWidth: 330 }}>
      {items.map(item => {
        const isActive = active === item.id || (active.startsWith('main-') && item.id === 'main-home' && active !== 'main-docs') || (active === 'main-docs' && item.id === 'documents');
        return (
          <div key={item.id} onClick={() => setPhoneScreen(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-transform duration-200 scale-95 active:scale-90 cursor-pointer ${isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

export function StitchWelcomeScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="bg-surface text-on-surface flex flex-col items-center overflow-x-hidden w-full h-full relative">
      <header className="w-full h-16 flex items-center justify-between px-6 z-10 relative shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-black text-primary tracking-tighter">TaxZone</span>
        </div>
        <button className="text-[12px] text-on-surface-variant hover:text-primary transition-colors">
          Support
        </button>
      </header>
      
      <main className="relative flex-grow w-full flex flex-col items-center justify-start px-6 pt-2 pb-12 gap-8 overflow-y-auto no-scrollbar">
        {/* Visual Identity */}
        <div className="w-full flex flex-col items-center justify-center relative mt-4">
          <div className="absolute -z-10 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative w-full aspect-square max-w-[220px]">
            <div className="w-full h-full rounded-full overflow-hidden border border-outline-variant/30 shadow-xl bg-white flex items-center justify-center text-6xl bg-gradient-to-br from-[#4F6EF7] to-[#22D3EE] text-white">
               💼
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 p-2 rounded-xl shadow-lg flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
              <div>
                <p className="text-[9px] text-on-surface-variant leading-none">Status</p>
                <p className="text-[11px] text-on-surface font-semibold">Approved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content & CTA */}
        <div className="w-full flex flex-col gap-6">
          <div className="space-y-3 text-center">
            <span className="inline-block px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-[10px] font-medium tracking-wider uppercase">
              Enterprise Ready
            </span>
            <h1 className="text-[24px] font-bold text-primary leading-tight font-display">
              Simplified Tax Filing for Businesses
            </h1>
            <p className="text-[13px] text-on-surface-variant">
              Track your filings, upload documents, and communicate with your CA in one place.
            </p>
          </div>
          
          <div className="flex flex-col gap-3 mt-2">
            <button onClick={onLogin} className="w-full h-12 bg-primary text-white rounded-xl text-[15px] font-semibold flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
              Create Account
            </button>
            <button onClick={onLogin} className="w-full h-12 bg-white border border-outline-variant text-primary rounded-xl text-[15px] font-semibold flex items-center justify-center hover:bg-surface-container-low transition-all active:scale-[0.98]">
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export function StitchClientHome({ 
  onViewDocuments, onViewFiling, onToggleNotifs, unreadCount 
}: { 
  onViewDocuments: ()=>void, onViewFiling: (id:string)=>void, onToggleNotifs: ()=>void, unreadCount: number 
}) {
  return (
    <div className="bg-background text-on-background flex flex-col w-full h-full relative overflow-hidden">
      <header className="shrink-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant text-xl">
            👤
          </div>
          <div>
            <h1 className="text-[16px] font-black text-on-surface leading-tight">Welcome, Sarah</h1>
            <p className="text-[11px] font-medium text-on-surface-variant">TaxZone Premium</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleNotifs} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors active:opacity-80">
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />}
          </button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto no-scrollbar px-4 pt-4 pb-24 space-y-6">
        <section>
          <div className="bg-primary-container p-5 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-on-tertiary-fixed-variant opacity-10 rounded-full -mr-10 -mt-10"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-medium bg-error text-on-error px-2 py-0.5 rounded-full uppercase tracking-wider">Urgent</span>
                <h2 className="text-[18px] font-bold text-white pt-2">Pending Actions</h2>
                <p className="text-on-primary-container text-[13px]">2 documents requested by your specialist</p>
              </div>
              <span className="material-symbols-outlined text-white text-2xl">warning</span>
            </div>
            <button onClick={onViewDocuments} className="mt-4 w-full bg-white text-primary font-bold py-2.5 rounded-xl text-[14px] flex items-center justify-center gap-2 active:scale-95 transition-transform">
              View Documents
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-[16px] font-bold text-on-surface">Active Filings</h3>
            <span className="text-[12px] font-medium text-on-tertiary-fixed-variant cursor-pointer">View All</span>
          </div>
          <div className="flex flex-col gap-3">
            <div onClick={() => onViewFiling("f1")} className="bg-white p-4 rounded-xl border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">Q3 2023</p>
                  <h4 className="text-[15px] font-bold text-on-surface">GST Filing</h4>
                </div>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-medium">In Progress</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-on-surface-variant">Validation Status</span>
                  <span className="text-primary font-bold">75%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-on-tertiary-fixed-variant transition-all duration-700" style={{width: "75%"}}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function StitchDocuments({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="bg-background text-on-background flex flex-col w-full h-full relative overflow-hidden">
      <header className="shrink-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] font-black text-on-surface leading-tight">Documents</h1>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={onUpload} className="material-symbols-outlined text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors">add</button>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto no-scrollbar px-4 py-4 pb-24 space-y-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-on-primary-container transition-all" placeholder="Search documents..." type="text"/>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button className="px-3 py-1 rounded-full bg-primary text-on-primary text-[11px] font-medium whitespace-nowrap">All</button>
          <button className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant text-[11px] font-medium whitespace-nowrap">Pending</button>
          <button className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant text-[11px] font-medium whitespace-nowrap">Approved</button>
        </div>

        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-outline-variant">
            {[
              { name: "Invoice_A1.pdf", date: "Oct 24", status: "Pending", color: "bg-amber-100 text-amber-800", icon: "description" },
              { name: "PanCard.jpg", date: "Oct 22", status: "Approved", color: "bg-emerald-100 text-emerald-800", icon: "image" },
              { name: "Tax_Summary_2022.pdf", date: "Oct 20", status: "Rejected", color: "bg-red-100 text-red-800", icon: "article" }
            ].map((doc, i) => (
              <div key={i} className="p-3 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-[18px]">{doc.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold text-on-surface">{doc.name}</h3>
                    <p className="text-[10px] text-on-surface-variant">Uploaded: {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-[4px] ${doc.color} text-[9px] uppercase tracking-wider font-bold`}>{doc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <button onClick={onUpload} className="absolute right-4 bottom-20 w-12 h-12 bg-primary text-on-primary rounded-xl shadow-lg flex items-center justify-center z-40 transition-transform active:scale-90">
        <span className="material-symbols-outlined">upload_file</span>
      </button>
    </div>
  );
}

export function StitchFilingDetail({ 
  onBack, onDownloadDraft, onSupportChat 
}: { 
  onBack: ()=>void, onDownloadDraft: ()=>void, onSupportChat: ()=>void 
}) {
  return (
    <div className="bg-background text-on-background flex flex-col w-full h-full relative overflow-hidden">
      <header className="shrink-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="material-symbols-outlined text-on-surface-variant p-1 rounded-full hover:bg-surface-container-low transition-colors">arrow_back</button>
          <h1 className="text-[16px] font-black text-on-surface leading-tight">GST Filing</h1>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto no-scrollbar px-4 py-5 pb-24 space-y-5">
        <section className="flex flex-col gap-3 mb-2">
          <div>
            <h2 className="text-[20px] font-bold text-primary">GST Filing - Q3 2023</h2>
            <p className="text-[12px] font-medium text-on-surface-variant">TXN-992034812 • Corporate Entity</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onDownloadDraft} className="flex-1 bg-surface-container-lowest border border-outline-variant text-on-surface px-3 py-2 rounded-xl text-[12px] font-medium hover:bg-surface-container-low transition-all">Download Draft</button>
            <button onClick={onSupportChat} className="flex-1 bg-primary text-on-primary px-3 py-2 rounded-xl text-[12px] font-medium shadow-md hover:opacity-90 transition-all">Support Chat</button>
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
          <div className="relative flex justify-between items-center w-full">
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-outline-variant -translate-y-1/2 z-0"></div>
            <div className="absolute top-1/2 left-0 w-1/3 h-[3px] bg-on-tertiary-fixed-variant -translate-y-1/2 z-0 transition-all duration-700 ease-in-out"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-on-tertiary-fixed-variant text-white flex items-center justify-center mb-1 shadow-sm">
                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </div>
              <span className="text-[9px] font-medium text-on-surface">Data</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-on-tertiary-fixed-variant text-white flex items-center justify-center mb-1 shadow-md ring-2 ring-secondary-container">
                <span className="material-symbols-outlined text-[14px] animate-pulse">sync</span>
              </div>
              <span className="text-[9px] font-bold text-on-surface">Processing</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[14px]">rate_review</span>
              </div>
              <span className="text-[9px] font-medium text-on-surface-variant">Review</span>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-[14px]">fact_check</span>
              </div>
              <span className="text-[9px] font-medium text-on-surface-variant">Filed</span>
            </div>
          </div>
        </section>

        <div className="bg-error-container/20 border border-error/20 p-4 rounded-xl flex items-start gap-3">
          <div className="bg-error-container p-1.5 rounded-lg text-error">
            <span className="material-symbols-outlined text-[18px]">warning</span>
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-bold text-on-error-container">Action Needed</h3>
            <p className="text-[12px] text-on-surface-variant mt-1 mb-3">Specialist requires bank statements for July - September.</p>
            <button className="bg-primary text-on-primary px-3 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1 w-full hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[14px]">upload_file</span> Upload
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
            <h3 className="text-[14px] font-bold text-on-surface">Data Snapshot</h3>
            <span className="text-[9px] font-bold px-2 py-1 bg-secondary-container text-on-secondary-container rounded uppercase">Draft V2</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-outline-variant">
            <div className="p-3">
              <span className="text-[10px] font-medium text-on-surface-variant block mb-1">Taxable Amount</span>
              <span className="text-[14px] font-bold text-on-surface">₹12,40,500</span>
            </div>
            <div className="p-3">
              <span className="text-[10px] font-medium text-on-surface-variant block mb-1">IGST</span>
              <span className="text-[14px] font-bold text-on-surface">₹2,23,290</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
