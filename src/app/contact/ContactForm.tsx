"use client";

import { useState } from "react";
import { StarFilled, Lightning } from "@/components/doodles";

interface Props {
  heading: string;
  subheading: string;
}

export function ContactForm({ heading, subheading }: Props) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-transparent border-b-2 border-infld-grey-mid text-infld-white px-0 py-3 text-sm focus:border-infld-yellow focus:outline-none transition-colors placeholder:text-infld-grey-mid";
  const labelClass = "block text-[10px] tracking-[0.2em] text-infld-grey-light mb-1 uppercase";

  return (
    <>
      {/* Hero */}
      <section className="section-textured px-4 pt-20 pb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <StarFilled size={16} className="text-infld-yellow" />
          <Lightning size={16} className="text-infld-yellow" />
          <StarFilled size={16} className="text-infld-yellow" />
        </div>
        <h1
          className="text-infld-white mb-4"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 12vw, 7rem)", lineHeight: 0.9 }}
        >
          {heading}
        </h1>
        <p
          className="text-infld-grey-light max-w-sm mx-auto"
          style={{ fontFamily: "var(--font-typewriter)", lineHeight: 1.8 }}
        >
          {subheading}
        </p>
      </section>

      {/* Form */}
      <section className="px-4 py-16">
        <div className="max-w-lg mx-auto">
          {status === "sent" ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <StarFilled size={24} className="text-infld-yellow" />
                <Lightning size={24} className="text-infld-yellow" />
                <StarFilled size={24} className="text-infld-yellow" />
              </div>
              <h2
                className="text-infld-white mb-4"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,8vw,3.5rem)" }}
              >
                MESSAGE SENT
              </h2>
              <p
                className="text-infld-grey-light mb-8"
                style={{ fontFamily: "var(--font-typewriter)", lineHeight: 1.8 }}
              >
                We got it. We&apos;ll be in touch.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-infld-yellow text-[10px] tracking-[0.2em] hover:underline"
                style={{ fontFamily: "var(--font-typewriter)" }}
              >
                SEND ANOTHER →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass} style={{ fontFamily: "var(--font-typewriter)" }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className={inputClass}
                    style={{ fontFamily: "var(--font-typewriter)" }}
                  />
                </div>
                <div>
                  <label className={labelClass} style={{ fontFamily: "var(--font-typewriter)" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={inputClass}
                    style={{ fontFamily: "var(--font-typewriter)" }}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: "var(--font-typewriter)" }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="What's it about?"
                  className={inputClass}
                  style={{ fontFamily: "var(--font-typewriter)" }}
                />
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: "var(--font-typewriter)" }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Say what you need to say."
                  className={`${inputClass} resize-none border-b-2 border-l-0 border-r-0 border-t-0`}
                  style={{ fontFamily: "var(--font-typewriter)" }}
                />
              </div>

              {status === "error" && (
                <p
                  className="text-red-400 text-xs"
                  style={{ fontFamily: "var(--font-typewriter)" }}
                >
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-infld-yellow text-infld-black font-display text-lg tracking-widest py-4 border-3 border-infld-black shadow-[4px_4px_0_#0A0A0A] hover:shadow-[6px_6px_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-75 disabled:opacity-60"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {status === "sending" ? "SENDING..." : "SEND IT"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
