import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}>
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-indigo-700 transition-colors">
                    PS
                  </div>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">
                    Pathway to Scripture
                  </span>
                </Link>
              </div>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                <Link href="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Contact Us</Link>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Admin Login</Link>
              </nav>
              <div className="md:hidden flex items-center">
                <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full">
          {children}
        </main>

        <footer className="bg-gray-900 text-gray-300 mt-auto">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  PS
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Pathway to Scripture
                </span>
              </Link>
              <p className="text-gray-400 max-w-xs">
                A dedicated space for learning, reflecting, and connecting over timeless wisdom.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Connect</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Pathway to Scripture. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
