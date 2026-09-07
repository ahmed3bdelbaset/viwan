"use client"
import { useState, useEffect } from "react"

const SERVICES = [
  "Architecture Design",
  "Interior Design",
  "Urban Planning",
  "Landscape Design",
  "Project Management",
  "Consultation",
]

export function ContactSection() {
  const [config, setConfig] = useState<any>(null)
  const [form, setForm]     = useState({ name:"", email:"", phone:"", service:"", budget:"", message:"" })
  const [state, setState]   = useState<"idle"|"sending"|"sent"|"error">("idle")

  useEffect(() => {
    fetch("/api/public/site-config")
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setConfig(d))
      .catch(() => {})
  }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState("sending")
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setState(res.ok ? "sent" : "error")
    } catch { setState("error") }
  }

  const mapSrc = config?.mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.559!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTQnMDguNiJF!5e0!3m2!1sen!2seg!4v1234567890"

  const inputClass = "w-full bg-white/[0.03] border border-white/10 text-white/80 text-sm px-4 py-3 placeholder:text-white/20 focus:outline-none focus:border-[var(--gold)]/60 transition-colors duration-200"

  return (
    <section id="contact" className="viwan-section bg-[var(--black)]">
      <div className="viwan-container">

        {/* ── HEADING ─────────────────────────────────── */}
        <div className="mb-14">
          <p className="text-[var(--gold)] text-[10px] tracking-[0.4em] uppercase mb-3 reveal">Get In Touch</p>
          <h2 className="text-fluid-3xl font-light text-white reveal stagger-1" style={{fontFamily:"var(--font-heading)"}}>
            Let&apos;s Build<br/><em className="not-italic text-[var(--gold)]">Something Great</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

          {/* ── LEFT: FORM ──────────────────────────── (3 cols) */}
          <div className="lg:col-span-3 reveal">
            {state === "sent" ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[var(--gold)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white text-xl font-light" style={{fontFamily:"var(--font-heading)"}}>Message Received</h3>
                <p className="text-white/40 text-sm max-w-[300px]">We&apos;ll review your inquiry and be in touch within 24 hours.</p>
                <button onClick={() => { setState("idle"); setForm({ name:"", email:"", phone:"", service:"", budget:"", message:"" }) }}
                  className="mt-4 text-[var(--gold)] text-[11px] tracking-widest uppercase hover:text-white transition-colors">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-white/30 tracking-[0.3em] uppercase mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={set("name")} required placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[9px] text-white/30 tracking-[0.3em] uppercase mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={set("email")} required placeholder="your@email.com" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] text-white/30 tracking-[0.3em] uppercase mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+20 100 000 0000" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[9px] text-white/30 tracking-[0.3em] uppercase mb-1.5">Service</label>
                    <select value={form.service} onChange={set("service")} className={inputClass + " appearance-none bg-[#111]" }>
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] text-white/30 tracking-[0.3em] uppercase mb-1.5">Project Budget</label>
                  <select value={form.budget} onChange={set("budget")} className={inputClass + " appearance-none bg-[#111]"}>
                    <option value="">Select budget range</option>
                    <option>Under $50K</option>
                    <option>$50K – $200K</option>
                    <option>$200K – $500K</option>
                    <option>$500K – $1M</option>
                    <option>$1M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-white/30 tracking-[0.3em] uppercase mb-1.5">Project Brief *</label>
                  <textarea value={form.message} onChange={set("message")} required placeholder="Tell us about your vision..." rows={5} className={inputClass + " resize-none"} />
                </div>
                <button type="submit" disabled={state==="sending"}
                  className="w-full bg-[var(--gold)] text-black text-[11px] tracking-[0.25em] uppercase py-4 font-semibold hover:bg-white transition-colors duration-300 disabled:opacity-50">
                  {state==="sending" ? "Sending..." : "Send Inquiry"}
                </button>
                {state==="error" && (
                  <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </div>

          {/* ── RIGHT: MAP + CONTACT INFO ─────────── (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-8 reveal stagger-2">

            {/* Map */}
            <div className="relative overflow-hidden" style={{height:"280px"}}>
              <iframe
                src={mapSrc}
                width="100%" height="100%"
                style={{border:0, filter:"grayscale(1) invert(0.9) contrast(0.85) brightness(0.8)"}}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="VIWAN Office Location"
              />
              {/* Gold overlay border */}
              <div className="absolute inset-0 pointer-events-none border border-white/10" />
              {/* Location pin label */}
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-2">
                <p className="text-white text-xs font-medium">VIWAN Studio</p>
                <p className="text-[var(--gold)] text-[10px]">{config?.address || "Cairo, Egypt"}</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-5">
              {[
                { label: "Phone",   value: config?.phone || "+20 100 000 0000", href: `tel:${config?.phone||""}`   },
                { label: "Email",   value: config?.email || "info@viwan.com",   href: `mailto:${config?.email||""}` },
                { label: "Address", value: config?.address || "Cairo, Egypt",   href: undefined },
                { label: "Hours",   value: "Sun – Thu, 9AM – 6PM",            href: undefined },
              ].map(({ label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="text-[var(--gold)] text-[9px] tracking-[0.3em] uppercase w-14 flex-shrink-0 pt-0.5">{label}</span>
                  {href ? (
                    <a href={href} className="text-white/60 text-sm hover:text-white transition-colors">{value}</a>
                  ) : (
                    <span className="text-white/60 text-sm">{value}</span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
