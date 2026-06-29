"use client";

import { useState } from "react";
import { Phone, Mail, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-12">
        <div className="bg-white border border-[#E5E2DC] overflow-hidden flex flex-col lg:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.02)]">

          {/* Contact Info Side */}
          <div className="bg-[#2F3337] lg:w-2/5 p-12 lg:p-16 text-[#FDFBF7] flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-white mb-6">Get in touch</h1>
              <p className="text-[#FDFBF7]/70 text-lg leading-relaxed max-w-sm mb-16">
                We&apos;d love to hear from you. Fill out the form and our team will get back to you within 24 hours.
              </p>

              <dl className="space-y-8">
                <div className="flex items-start">
                  <dt className="mt-1">
                    <span className="sr-only">Phone number</span>
                    <Phone strokeWidth={1.5} className="h-5 w-5 text-[#C5A059]" />
                  </dt>
                  <dd className="ml-4 text-base text-[#FDFBF7]/90">+1 (555) 123-4567</dd>
                </div>
                <div className="flex items-start">
                  <dt className="mt-1">
                    <span className="sr-only">Email</span>
                    <Mail strokeWidth={1.5} className="h-5 w-5 text-[#C5A059]" />
                  </dt>
                  <dd className="ml-4 text-base text-[#FDFBF7]/90">support@pathwaytoscripture.com</dd>
                </div>
              </dl>
            </div>

            <div className="mt-16 flex space-x-6">
              <a href="#" className="text-[#FDFBF7]/50 hover:text-[#C5A059] transition-colors">
                <span className="sr-only">Instagram</span>
                <Mail strokeWidth={1.5} className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-12 lg:p-16">
            <h2 className="text-2xl font-serif font-bold text-[#2F3337] mb-8">Send us a message</h2>

            {status === "success" && (
              <div className="mb-8 p-4 border border-green-200 bg-green-50 flex items-start">
                <CheckCircle2 strokeWidth={1.5} className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="ml-3 text-sm text-green-800 leading-relaxed">
                  Message sent successfully! We will get back to you soon.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="mb-8 p-4 border border-red-200 bg-red-50 flex items-start">
                 <AlertCircle strokeWidth={1.5} className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                 <p className="ml-3 text-sm text-red-800 leading-relaxed">
                  There was an error sending your message. Please try again.
                 </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-[#2F3337] mb-2 uppercase tracking-widest text-xs">Full Name</label>
                <div className="mt-1">
                  <input type="text" name="name" id="name" required
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="py-3 px-4 block w-full bg-[#FDFBF7] border border-[#E5E2DC] text-[#2F3337] focus:ring-0 focus:border-[#C5A059] transition-colors outline-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-[#2F3337] mb-2 uppercase tracking-widest text-xs">Email Address</label>
                <div className="mt-1">
                  <input type="email" name="email" id="email" required
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="py-3 px-4 block w-full bg-[#FDFBF7] border border-[#E5E2DC] text-[#2F3337] focus:ring-0 focus:border-[#C5A059] transition-colors outline-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-[#2F3337] mb-2 uppercase tracking-widest text-xs">Subject</label>
                <div className="mt-1">
                  <input type="text" name="subject" id="subject" required
                    value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="py-3 px-4 block w-full bg-[#FDFBF7] border border-[#E5E2DC] text-[#2F3337] focus:ring-0 focus:border-[#C5A059] transition-colors outline-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#2F3337] mb-2 uppercase tracking-widest text-xs">Message</label>
                <div className="mt-1">
                  <textarea id="message" name="message" rows={5} required
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="py-3 px-4 block w-full bg-[#FDFBF7] border border-[#E5E2DC] text-[#2F3337] focus:ring-0 focus:border-[#C5A059] transition-colors outline-none resize-y"></textarea>
                </div>
              </div>

              <div className="sm:col-span-2 mt-4">
                <button type="submit" disabled={status === "submitting"}
                  className="group w-full inline-flex justify-center items-center py-4 px-6 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-[#C5A059] hover:bg-[#b08d4b] focus:outline-none disabled:opacity-50 transition-all duration-300">
                  {status === "submitting" ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
