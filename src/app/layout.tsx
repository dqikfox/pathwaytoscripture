import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { BookOpen, Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Pathway to Scripture",
  description: "A professional platform for deep study and reflection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FDFBF7] text-[#2F3337] flex flex-col min-h-screen antialiased`}>
        {/* Ultra-minimalist Header */}
        <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E5E2DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex justify-between h-24 items-center">

              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="text-[#C5A059] transition-transform duration-300 group-hover:scale-105">
                    <BookOpen strokeWidth={1.5} size={28} />
                  </div>
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#2F3337]">
                    Pathway<span className="text-[#C5A059] italic">to</span>Scripture
                  </span>
                </Link>
              </div>

              <nav className="hidden md:flex space-x-12">
                <Link href="/" className="text-sm uppercase tracking-widest text-[#2F3337]/70 hover:text-[#C5A059] transition-colors duration-200">Home</Link>
                <Link href="/contact" className="text-sm uppercase tracking-widest text-[#2F3337]/70 hover:text-[#C5A059] transition-colors duration-200">Contact</Link>
                <Link href="/login" className="text-sm uppercase tracking-widest text-[#2F3337]/70 hover:text-[#C5A059] transition-colors duration-200">Admin</Link>
              </nav>

              <div className="md:hidden flex items-center">
                <button className="text-[#2F3337] hover:text-[#C5A059] transition-colors">
                  <Menu strokeWidth={1.5} size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full">
          {children}
        </main>

        {/* Minimalist Footer */}
        <footer className="bg-[#FDFBF7] border-t border-[#E5E2DC] mt-auto">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">

            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                 <div className="text-[#C5A059]">
                    <BookOpen strokeWidth={1.5} size={24} />
                  </div>
                <span className="font-serif text-xl font-bold text-[#2F3337]">
                  Pathway<span className="text-[#C5A059] italic">to</span>Scripture
                </span>
              </Link>
              <p className="text-[#2F3337]/70 max-w-sm leading-loose">
                A dedicated space for learning, reflecting, and connecting over timeless wisdom.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-[#2F3337] font-semibold mb-6 text-lg">Resources</h3>
              <ul className="space-y-4">
                <li><Link href="/" className="text-sm text-[#2F3337]/70 hover:text-[#C5A059] transition-colors">Home</Link></li>
                <li><Link href="/terms" className="text-sm text-[#2F3337]/70 hover:text-[#C5A059] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-[#2F3337] font-semibold mb-6 text-lg">Connect</h3>
              <ul className="space-y-4">
                <li><Link href="/contact" className="text-sm text-[#2F3337]/70 hover:text-[#C5A059] transition-colors">Contact Us</Link></li>
                <li><Link href="/login" className="text-sm text-[#2F3337]/70 hover:text-[#C5A059] transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E5E2DC] py-8 text-center">
            <p className="text-xs uppercase tracking-widest text-[#2F3337]/50">
              © {new Date().getFullYear()} Pathway to Scripture. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
