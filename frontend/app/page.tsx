import EmailClient from "./components/EmailClient";
import type { Email } from "./types";


const fallbackEmails: Email[] = [
  {
    id: 1,
    sender_name: "Zara Keegan",
    sender_email: "zara.keegan@redwood.io",
    recipient_name: "Richard Brown",
    recipient_email: "richard.brown@proscape.com",
    subject: "🎉 Campaign Kickoff Brief",
    body:
      "Hi Richard,\n\nSharing the kickoff brief for the new email campaign. We are targeting a 14-day launch timeline with daily performance snapshots.\n\nLet me know if you want to add a QA pass before we go live.\n\nThanks,\nZara",
    preview:
      "Sharing the kickoff brief for the new email campaign. We are targeting a 14-day launch timeline...",
    received_at: "2024-08-20T09:30:00",
    is_read: false,
    is_archived: false,
    attachment: {
      file_name: "Kickoff-Brief.pdf",
      file_size: "4.2 MB",
      file_type: "PDF",
      download_url: "https://files.example.com/kickoff-brief.pdf",
    },
  },
  {
    id: 2,
    sender_name: "Martin Griffin",
    sender_email: "martin.griffin@orbital.io",
    recipient_name: "Richard Brown",
    recipient_email: "richard.brown@proscape.com",
    subject: "Q3 Metrics Snapshot 📈",
    body:
      "Richard,\n\nAttached are the Q3 metrics highlights. Key wins: 12% MoM growth, 3.2x CAC payback.\n\nWe should align on a follow-up plan this week.\n\nBest,\nMartin",
    preview:
      "Attached are the Q3 metrics highlights. Key wins: 12% MoM growth, 3.2x CAC payback...",
    received_at: "2024-08-19T16:12:00",
    is_read: true,
    is_archived: false,
    attachment: {
      file_name: "Q3-Metrics.xlsx",
      file_size: "1.1 MB",
      file_type: "XLSX",
      download_url: "https://files.example.com/q3-metrics.xlsx",
    },
  },
  {
    id: 3,
    sender_name: "Team Updates",
    sender_email: "updates@proscape.com",
    recipient_name: "Richard Brown",
    recipient_email: "richard.brown@proscape.com",
    subject: "Weekly Digest: Product & Growth",
    body:
      "Hi Richard,\n\nHere is your weekly digest summarizing product updates, marketing wins, and customer highlights.\n\nCheers,\nThe Proscape Team",
    preview:
      "Here is your weekly digest summarizing product updates, marketing wins, and customer highlights...",
    received_at: "2024-08-18T08:00:00",
    is_read: true,
    is_archived: false,
    attachment: null,
  },
];

async function getEmails(): Promise<Email[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
    const response = await fetch(`${baseUrl}/emails`, { cache: "no-store" });
    if (!response.ok) {
      return fallbackEmails;
    }
    const data = await response.json();
    return data.emails ?? fallbackEmails;
  } catch {
    return fallbackEmails;
  }
}

export default async function Home() {
  const emails = await getEmails();
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-72 flex-col justify-between border-r border-slate-200 bg-white p-6">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
                ★
              </span>
              <span>Proscape</span>
            </div>
            <nav className="space-y-6 text-sm">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Main
                </p>
                {[
                  "Dashboard",
                  "Notifications",
                  "Tasks",
                  "Calendar",
                  "Widgets",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-50"
                  >
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Marketing
                </p>
                {[
                  "Product",
                  "Emails",
                  "Integration",
                  "Contacts",
                ].map((item) => (
                  <div
                    key={item}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                      item === "Emails"
                        ? "bg-orange-50 text-orange-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item}</span>
                    {item === "Emails" && (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-600">
                        12
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Favorite
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    Opportunity Stages
                  </div>
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Key Metrics
                  </div>
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    Product Plan
                  </div>
                </div>
              </div>
            </nav>
          </div>
          <div className="space-y-4 text-sm text-slate-500">
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50">
                Settings
              </button>
              <button className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-slate-50">
                Help & Center
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  RB
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Richard Brown
                  </p>
                  <p className="text-xs text-slate-400">6.2GB of 10GB</p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                <div className="h-2 w-2/3 rounded-full bg-orange-500" />
              </div>
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col gap-6 p-8">
          <header className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500">
                ☰
              </button>
              <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                <span>Search</span>
                <span className="rounded-full border border-slate-200 px-2 py-1 text-[10px]">
                  ⌘K
                </span>
              </div>
              <h1 className="text-lg font-semibold text-slate-900">Emails</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500">
                Search Email
              </div>
              <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                + New Message
              </button>
            </div>
          </header>
          <EmailClient emails={emails} />
        </main>
      </div>
    </div>
  );
}