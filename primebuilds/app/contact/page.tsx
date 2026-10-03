"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Send
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    borough: "Chelsea & Kensington",
    service: "Full House Refurbishment",
    budget: "£100,000 - £250,000",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-10">
      {/* Header */}
      <section className="site-container">
        <div className="max-w-2xl">
          <span className="arch-tag mb-2">
            <MapPin size={12} className="text-blue-700" />
            London Office
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-blue-950 mb-3 tracking-tight">
            Book a London Site Audit
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Arrange a complimentary on-site architectural feasibility consultation with our London surveying team.
          </p>
        </div>
      </section>

      {/* Form & Office Information */}
      <section className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking Form (7 cols) */}
          <div className="lg:col-span-7">
            <div 
              className="neu-box p-6 md:p-8 border border-slate-200"
              style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
            >
              {submitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 text-blue-800 flex items-center justify-center mx-auto" style={{ borderRadius: "6px" }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-blue-950 mb-1">
                    Audit Request Received
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Thank you, <strong className="text-blue-950">{formData.name}</strong>. Our senior surveyor will contact you within 24 hours.
                  </p>
                  <div className="p-3 bg-slate-50 border border-slate-200 max-w-xs mx-auto text-xs font-mono text-blue-950" style={{ borderRadius: "4px" }}>
                    <span>Ref: PB-LON-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary text-xs uppercase tracking-wider font-semibold"
                    style={{ borderRadius: "4px" }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="James Alexander"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2.5 text-xs text-slate-800 neu-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+44 7911 123456"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2.5 text-xs text-slate-800 neu-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="james@london.co.uk"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2.5 text-xs text-slate-800 neu-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                        London Borough *
                      </label>
                      <select
                        name="borough"
                        value={formData.borough}
                        onChange={handleChange}
                        className="w-full p-2.5 text-xs text-slate-800 neu-field bg-white"
                      >
                        <option value="Chelsea & Kensington">Kensington & Chelsea</option>
                        <option value="Westminster & Mayfair">Westminster & Mayfair</option>
                        <option value="Camden & Regents Park">Camden & Regents Park</option>
                        <option value="Hampstead & Highgate">Hampstead & Highgate</option>
                        <option value="Islington & Clerkenwell">Islington & Clerkenwell</option>
                        <option value="Richmond & Barnes">Richmond & Barnes</option>
                        <option value="Wandsworth & Battersea">Wandsworth & Battersea</option>
                        <option value="Other London Borough">Other London Borough</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                        Service *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full p-2.5 text-xs text-slate-800 neu-field bg-white"
                      >
                        <option value="Full House Refurbishment">Full House Refurbishment</option>
                        <option value="Loft & Attic Conversion">Loft & Attic Conversion</option>
                        <option value="Architectural Extension">Architectural Extension</option>
                        <option value="Bespoke Kitchen Renovation">Bespoke Kitchen Renovation</option>
                        <option value="Luxury Bathrooms & Wetrooms">Luxury Bathrooms & Wetrooms</option>
                        <option value="Commercial Fit-Out">Commercial Office / Retail Fit-Out</option>
                        <option value="Structural Maintenance">Structural Repairs & Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                        Target Budget Band
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full p-2.5 text-xs text-slate-800 neu-field bg-white"
                      >
                        <option value="£30,000 - £75,000">£30,000 – £75,000</option>
                        <option value="£75,000 - £150,000">£75,000 – £150,000</option>
                        <option value="£150,000 - £300,000">£150,000 – £300,000</option>
                        <option value="£300,000 - £600,000">£300,000 – £600,000</option>
                        <option value="£600,000+">£600,000+ (Ultra-Prime)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-mono uppercase">
                      Project Notes
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Brief description of property type, planning status, or key structural requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-2.5 text-xs text-slate-800 neu-field"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary text-xs uppercase tracking-wider font-semibold py-3 flex items-center justify-center gap-2 cursor-pointer"
                    style={{ borderRadius: "4px" }}
                  >
                    <Send size={13} />
                    <span>Confirm Free London Site Consultation</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* London Office Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div 
              className="neu-box p-6 border border-slate-200 space-y-4"
              style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
            >
              <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider pb-2 border-b border-slate-100 font-mono">
                London Headquarters
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block font-mono">Address:</span>
                    <strong className="text-sm text-blue-950 block">London, United Kingdom</strong>
                    <span className="text-[11px] text-slate-500">Registered Office in London. Covering all 32 Boroughs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block font-mono">Telephone:</span>
                    <a href="tel:+442079460892" className="text-sm font-bold text-blue-700 hover:underline block">
                      +44 20 7946 0892
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block font-mono">Tenders:</span>
                    <a href="mailto:enquiries@primebuilds-london.co.uk" className="text-xs font-semibold text-blue-700 hover:underline block">
                      enquiries@primebuilds-london.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] block font-mono">Hours:</span>
                    <span className="font-semibold text-slate-800 block">Mon – Fri: 07:00 – 19:00</span>
                    <span className="text-[11px] text-slate-500">Emergency support available 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
