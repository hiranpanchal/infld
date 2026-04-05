"use client";

import { useEffect, useState } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Settings {
  heading: string;
  subheading: string;
  notify_email: string;
}

const inputClass =
  "w-full bg-[#0a0a0a] border-2 border-infld-grey-mid text-infld-white px-3 py-2 text-sm focus:border-infld-yellow focus:outline-none transition-colors";
const labelStyle = { fontFamily: "var(--font-typewriter)" };

export default function AdminContactPage() {
  const [settings, setSettings] = useState<Settings>({ heading: "", subheading: "", notify_email: "" });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content?pageKey=contact")
      .then((r) => r.json())
      .then((data: { blockKey: string; content: string }[]) => {
        const s: Settings = { heading: "", subheading: "", notify_email: "" };
        data.forEach((b) => {
          if (b.blockKey === "heading") s.heading = b.content;
          else if (b.blockKey === "subheading") s.subheading = b.content;
          else if (b.blockKey === "notify_email") s.notify_email = b.content;
        });
        setSettings(s);
        setLoadingSettings(false);
      });

    fetch("/api/admin/contact-messages")
      .then((r) => r.json())
      .then((data: ContactMessage[]) => {
        setMessages(data);
        setLoadingMessages(false);
      });
  }, []);

  const saveSetting = async (blockKey: keyof Settings) => {
    setSaving(blockKey);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageKey: "contact", blockKey, content: settings[blockKey] }),
    });
    setSaving(null);
    setSaved(blockKey);
    setTimeout(() => setSaved(null), 2000);
  };

  const markRead = async (id: string) => {
    await fetch(`/api/admin/contact-messages/${id}`, { method: "PATCH" });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl tracking-wider text-infld-white mb-2"
            style={{ fontFamily: "var(--font-display)" }}>
          CONTACT PAGE
        </h1>
        <p className="text-infld-grey-mid text-xs" style={labelStyle}>
          Configure the contact page appearance and view submitted messages.
        </p>
      </div>

      {/* Settings */}
      <section>
        <h2 className="text-lg tracking-wider text-infld-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}>
          PAGE SETTINGS
        </h2>
        {loadingSettings ? (
          <p className="text-infld-grey-mid text-xs" style={labelStyle}>Loading...</p>
        ) : (
          <div className="space-y-4">
            {(
              [
                { key: "heading" as const, label: "Page Heading", placeholder: "GET IN TOUCH" },
                { key: "subheading" as const, label: "Subheading", placeholder: "Questions? Collabs? Noise? We're here." },
                { key: "notify_email" as const, label: "Notification Email (optional)", placeholder: "hello@infld.com" },
              ] as { key: keyof Settings; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key} className="border-2 border-infld-grey-mid p-4 bg-[#0d0d0d]">
                <label className="block text-[10px] tracking-[0.25em] text-infld-grey-light mb-3 uppercase"
                       style={labelStyle}>
                  {label}
                </label>
                <input
                  type="text"
                  value={settings[key]}
                  placeholder={placeholder}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  className={inputClass}
                  style={labelStyle}
                />
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => saveSetting(key)}
                    disabled={saving === key}
                    className="bg-infld-yellow text-infld-black text-[10px] tracking-[0.15em] px-4 py-1.5 border-2 border-infld-black hover:shadow-[2px_2px_0_#FFE600] transition-all duration-75 disabled:opacity-50"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {saving === key ? "SAVING..." : "SAVE"}
                  </button>
                  {saved === key && (
                    <span className="text-green-400 text-[10px] tracking-wider" style={labelStyle}>✓ SAVED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Messages inbox */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg tracking-wider text-infld-white"
              style={{ fontFamily: "var(--font-display)" }}>
            MESSAGES
          </h2>
          {unread > 0 && (
            <span className="bg-infld-yellow text-infld-black text-[10px] px-2 py-0.5 tracking-wider"
                  style={labelStyle}>
              {unread} NEW
            </span>
          )}
        </div>
        {loadingMessages ? (
          <p className="text-infld-grey-mid text-xs" style={labelStyle}>Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-infld-grey-mid text-sm" style={labelStyle}>No messages yet.</p>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id}
                className={`border-2 ${msg.read ? "border-infld-grey-mid" : "border-infld-yellow"} bg-[#0d0d0d]`}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  onClick={() => { setExpandedId(expandedId === msg.id ? null : msg.id); if (!msg.read) markRead(msg.id); }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-infld-yellow shrink-0" />
                    )}
                    <span className="text-infld-white text-xs truncate" style={labelStyle}>
                      {msg.name}
                    </span>
                    {msg.subject && (
                      <span className="text-infld-grey-light text-xs truncate hidden sm:block" style={labelStyle}>
                        — {msg.subject}
                      </span>
                    )}
                  </div>
                  <span className="text-infld-grey-mid text-[10px] shrink-0 ml-3" style={labelStyle}>
                    {new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </button>
                {expandedId === msg.id && (
                  <div className="px-4 pb-4 border-t border-infld-grey-mid/40 pt-3">
                    <p className="text-infld-grey-light text-[10px] tracking-wider mb-2" style={labelStyle}>
                      FROM: {msg.email}
                    </p>
                    <p className="text-infld-white text-sm leading-relaxed whitespace-pre-wrap" style={labelStyle}>
                      {msg.message}
                    </p>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "Your message")}`}
                      className="inline-block mt-3 text-infld-yellow text-[10px] tracking-wider hover:underline"
                      style={labelStyle}
                    >
                      REPLY VIA EMAIL →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
