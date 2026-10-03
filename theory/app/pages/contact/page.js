"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Check, MessageSquare, Send } from "lucide-react";
import { submitContactInquiry } from "@/lib/supabase";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitContactInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting inquiry:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fffdf8] min-h-screen py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-[#e5e3dc] mb-12">
          <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] uppercase text-blue-600 block">
            Customer Care // The Cozy Theory
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#121212] break-all sm:break-normal">
            THECOZYTHEORY.STORE@GMAIL.COM
          </h1>
          <p className="text-xs md:text-sm font-mono text-neutral-600 max-w-xl">
            Have questions about an artisanal piece, home styling advice, custom gifting orders, or order status? Reach out directly to our customer care team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                The Cozy Theory Brand Office
              </div>
              <div className="flex items-start gap-3 text-sm text-neutral-800 leading-relaxed font-normal">
                <MapPin className="w-5 h-5 text-neutral-600 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-black font-semibold">The Cozy Theory</strong><br />
                  Building No.: 3/435<br />
                  Road/Street: KARIKODE<br />
                  Locality/Sub Locality: MULANTHURUTHY<br />
                  City/Town/Village: Kanayannur<br />
                  District: Ernakulam<br />
                  State: Kerala<br />
                  PIN Code: 682314
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Direct Contact
              </div>
              <div className="space-y-3 text-sm text-neutral-800 font-mono">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                  <a
                    href="mailto:thecozytheory.store@gmail.com"
                    className="hover:underline text-[#001540] font-medium break-all"
                  >
                    thecozytheory.store@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                  <a
                    href="tel:+917558085343"
                    className="hover:underline font-medium text-black"
                  >
                    +91-7558085343
                  </a>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Chat Action */}
            <div className="p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#128C7E] uppercase">
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Support</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Need immediate help with product sizing or an active order? Chat with our team directly.
              </p>
              <a
                href="https://wa.me/917558085343?text=Hi%20The%20Cozy%20Theory%20team%2C%20I%20have%20an%20inquiry%20regarding%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white hover:bg-[#1fb355] text-xs font-mono font-bold uppercase rounded transition-colors"
              >
                <span>Chat on WhatsApp →</span>
              </a>
            </div>

            <div className="p-6 bg-[#f7f5ef] border border-[#e5e3dc] space-y-2">
              <span className="text-xs font-mono font-bold uppercase">Response Guarantee:</span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our support team replies to all inquiries within 24 business hours (Monday through Friday, 10:00 AM – 6:00 PM IST).
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#f7f5ef] border border-[#e5e3dc] p-6 sm:p-10">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#121212]">
                  Message Transmitted
                </h3>
                <p className="text-xs font-mono text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for connecting with The Cozy Theory. We have received your inquiry in our admin desk and our support crew will respond shortly.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 text-xs font-mono">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
                    }}
                    className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white uppercase font-bold transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                  <a
                    href="https://wa.me/917558085343?text=Hi%20The%20Cozy%20Theory%20team%2C%20I%20just%20submitted%20an%20inquiry%20on%20your%20website."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] text-white hover:bg-[#1fb355] uppercase font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
                      placeholder="E.g. Shreya Verma"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
                      placeholder="+91-7558085343"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                      Subject / Order Reference
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
                      placeholder="Order inquiry, Home styling, Bulk gifting"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-600 block mb-1.5 font-semibold">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-[#e5e3dc] p-3 text-xs font-mono focus:outline-none focus:border-black"
                    placeholder="Tell us about your home space or questions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#001540] text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-[#002266] transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? "Sending..." : "Send Inquiry →"}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
