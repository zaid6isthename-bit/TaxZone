const dashboardCards = [
  { label: 'Pending Documents', value: '128' },
  { label: 'Filings Due This Week', value: '42' },
  { label: 'Under Review', value: '73' },
  { label: 'Overdue Actions', value: '19' },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-950">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">TaxZone</p>
          <h1 className="mt-2 text-3xl font-semibold">Compliance Command Center</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {dashboardCards.map((card) => (
            <article key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-600">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold">Priority Work Queue</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {['GST returns awaiting bank statements', 'PAN mismatch needs review', 'Client uploaded rejected invoice again'].map((item) => (
              <div key={item} className="flex items-center justify-between p-5">
                <span>{item}</span>
                <button className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white">Open</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

