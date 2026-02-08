"use client";

import { useMemo, useState } from "react";

import type { Email } from "../types";

type Props = {
  emails: Email[];
};

const tabs = ["All Mails", "Unread", "Archive"];

export default function EmailClient({ emails }: Props) {
  const [activeTab, setActiveTab] = useState("All Mails");
  const [selectedId, setSelectedId] = useState(emails[0]?.id ?? 0);

  const filteredEmails = useMemo(() => {
    if (activeTab === "Unread") {
      return emails.filter((email) => !email.is_read && !email.is_archived);
    }
    if (activeTab === "Archive") {
      return emails.filter((email) => email.is_archived);
    }
    return emails.filter((email) => !email.is_archived);
  }, [activeTab, emails]);

  const selectedEmail =
    filteredEmails.find((email) => email.id === selectedId) ?? filteredEmails[0];

  return (
    <div className="flex min-h-[720px] flex-1 gap-4">
      <section className="flex w-[360px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 text-sm font-medium text-slate-500">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSelectedId(filteredEmails[0]?.id ?? 0);
              }}
              className={`rounded-full px-3 py-1 text-xs transition ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {filteredEmails.map((email) => (
            <button
              key={email.id}
              type="button"
              onClick={() => setSelectedId(email.id)}
              className={`group flex w-full items-start gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50 ${
                selectedEmail?.id === email.id ? "bg-slate-50" : ""
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                {email.sender_name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {email.sender_name}
                    </p>
                    <p className="text-xs text-slate-400">{email.subject}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>
                      {new Date(email.received_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {!email.is_read && (
                      <span className="h-2 w-2 rounded-full bg-sky-500" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{email.preview}</p>
                <div className="hidden items-center gap-2 text-slate-400 group-hover:flex">
                  {["Archive", "Forward", "More"].map((action) => (
                    <span
                      key={action}
                      className="rounded-full border border-slate-200 px-2 py-1 text-[10px]"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-1 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {selectedEmail ? (
          <>
            <header className="flex flex-col gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                    {selectedEmail.sender_name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedEmail.sender_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedEmail.sender_email}
                    </p>
                    <p className="text-xs text-slate-400">
                      To {selectedEmail.recipient_name} ·{" "}
                      {new Date(selectedEmail.received_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {["Read", "Archive", "Forward", "More"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-slate-200 px-3 py-1"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {selectedEmail.subject}
              </h2>
            </header>
            <div className="flex-1 space-y-4 text-sm leading-6 text-slate-600">
              {selectedEmail.body.split("\n").map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
            {selectedEmail.attachment && (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800">
                    {selectedEmail.attachment.file_name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedEmail.attachment.file_type} ·{" "}
                    {selectedEmail.attachment.file_size}
                  </p>
                </div>
                <a
                  className="text-xs font-semibold text-slate-900"
                  href={selectedEmail.attachment.download_url ?? "#"}
                >
                  Download
                </a>
              </div>
            )}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-white">
                    To
                  </span>
                  <span>{selectedEmail.sender_email}</span>
                </div>
                <span className="rounded-full border border-slate-200 px-2 py-1">
                  ⌘K
                </span>
              </div>
              <div className="min-h-[120px] rounded-xl bg-white p-3 text-sm text-slate-500 shadow-sm">
                Write your message here...
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {["📎", "😊", "📄", "⋯"].map((icon) => (
                    <span
                      key={icon}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white"
                    >
                      {icon}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">
                    Schedule
                  </button>
                  <button className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white">
                    Send Now
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            No emails to display.
          </div>
        )}
      </section>
    </div>
  );
}