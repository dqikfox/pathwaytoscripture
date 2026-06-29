"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7]">
      <div className="max-w-md w-full">

        <div className="text-center mb-12">
           <div className="flex justify-center text-[#C5A059] mb-6">
              <BookOpen strokeWidth={1.5} size={32} />
           </div>
          <h2 className="text-3xl font-serif font-bold text-[#2F3337] tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-3 text-[#2F3337]/70">Sign in to manage pathway content</p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-[#E5E2DC] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <form className="space-y-8" onSubmit={handleSubmit}>

            {error && (
              <div className="p-4 border border-red-200 bg-red-50 flex items-start">
                  <AlertCircle strokeWidth={1.5} className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-sm text-red-800 leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-[#2F3337] mb-2 uppercase tracking-widest text-xs">Email address</label>
                <input id="email-address" name="email" type="email" required
                  className="py-3 px-4 block w-full bg-[#FDFBF7] border border-[#E5E2DC] text-[#2F3337] focus:ring-0 focus:border-[#C5A059] transition-colors outline-none"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#2F3337] mb-2 uppercase tracking-widest text-xs">Password</label>
                <input id="password" name="password" type="password" required
                  className="py-3 px-4 block w-full bg-[#FDFBF7] border border-[#E5E2DC] text-[#2F3337] focus:ring-0 focus:border-[#C5A059] transition-colors outline-none"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit"
                className="group w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold tracking-widest uppercase text-white bg-[#C5A059] hover:bg-[#b08d4b] focus:outline-none transition-all duration-300">
                Sign in
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
