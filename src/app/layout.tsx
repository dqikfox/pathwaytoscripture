import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pathway to Scripture",
  description: "A professional platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex flex-col min-h-screen`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-indigo-600">
                  Pathway to Scripture
                </Link>
              </div>
              <nav className="flex space-x-4">
                <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link href="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Contact Us</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Pathway to Scripture. All rights reserved.</p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
                <Link href="/admin" className="hover:text-gray-900">Admin</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
