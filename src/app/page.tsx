import Link from "next/link";
import { BookOpen, Users, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section - Minimalist & Editorial */}
      <section className="relative py-24 lg:py-40 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#2F3337]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl relative z-10">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-xs font-bold mb-6 block">The Journey Begins</span>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#2F3337] mb-8 leading-[1.1]">
            Illuminate Your Path <br className="hidden md:block"/>
            <span className="italic font-normal text-[#C5A059]">With Scripture</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-[#2F3337]/70 leading-relaxed mb-12">
            A premium platform dedicated to deep study, reflection, and community. Discover timeless wisdom wrapped in a completely distraction-free experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/contact" className="group px-10 py-5 bg-[#2F3337] text-[#FDFBF7] font-medium tracking-wide flex items-center justify-center gap-3 hover:bg-[#1A1D20] transition-all duration-300">
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/terms" className="px-10 py-5 bg-transparent border border-[#E5E2DC] text-[#2F3337] font-medium tracking-wide hover:border-[#C5A059] hover:text-[#C5A059] transition-all duration-300">
              Read Our Terms
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-[#E5E2DC] max-w-7xl mx-auto w-full" />

      {/* Features / Pathway Timeline Section */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2F3337] mb-6">The Pathway Experience</h2>
            <p className="text-lg text-[#2F3337]/70 leading-relaxed">
              Designed meticulously for reading comprehension and user engagement. Step into a world of focus.
            </p>
          </div>

          <div className="relative">
            {/* The structural thin connecting line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E2DC] transform -translate-x-1/2"></div>

            <div className="space-y-24">

              {/* Timeline Item 1 */}
              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-5/12 text-center md:text-right mb-8 md:mb-0 md:pr-16">
                  <h3 className="text-3xl font-bold text-[#2F3337] mb-4">Deep Insights</h3>
                  <p className="text-[#2F3337]/70 leading-relaxed text-lg">
                    Access historical context, translations, and expert commentary to enrich your understanding without the clutter.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E5E2DC] z-10 text-[#C5A059]">
                  <BookOpen strokeWidth={1.5} size={20} />
                </div>
                <div className="md:w-5/12 md:pl-16">
                  <div className="bg-white border border-[#E5E2DC] p-8 aspect-video flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                     <div className="w-full max-w-[200px] h-2 bg-[#E5E2DC]/50 rounded-full overflow-hidden">
                       <div className="h-full bg-[#C5A059] w-1/3"></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative flex flex-col md:flex-row-reverse items-center justify-between">
                <div className="md:w-5/12 text-center md:text-left mb-8 md:mb-0 md:pl-16">
                  <h3 className="text-3xl font-bold text-[#2F3337] mb-4">Community Connections</h3>
                  <p className="text-[#2F3337]/70 leading-relaxed text-lg">
                    Join forums, start study groups, and connect with fellow seekers around the world in a quiet, curated space.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E5E2DC] z-10 text-[#C5A059]">
                  <Users strokeWidth={1.5} size={20} />
                </div>
                <div className="md:w-5/12 md:pr-16">
                   <div className="bg-white border border-[#E5E2DC] p-8 aspect-video flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#E5E2DC] bg-[#FDFBF7]"></div>
                        <div className="w-10 h-10 rounded-full border border-[#E5E2DC] bg-[#FDFBF7] -ml-6"></div>
                        <div className="w-10 h-10 rounded-full border border-[#C5A059] bg-[#C5A059]/10 -ml-6 z-10"></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-5/12 text-center md:text-right mb-8 md:mb-0 md:pr-16">
                  <h3 className="text-3xl font-bold text-[#2F3337] mb-4">Secure & Private</h3>
                  <p className="text-[#2F3337]/70 leading-relaxed text-lg">
                    Your personal notes and reflections are encrypted and kept strictly confidential. Focus on what matters.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#FDFBF7] border border-[#E5E2DC] z-10 text-[#C5A059]">
                  <Shield strokeWidth={1.5} size={20} />
                </div>
                <div className="md:w-5/12 md:pl-16">
                   <div className="bg-white border border-[#E5E2DC] p-8 aspect-video flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                       <Shield strokeWidth={1} size={48} className="text-[#E5E2DC]" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <hr className="border-[#E5E2DC] max-w-7xl mx-auto w-full" />

      {/* Editorial CTA Section */}
      <section className="py-24 lg:py-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-[#2F3337] mb-8 leading-[1.2]">
            Ready to dive deeper into the text?
          </h2>
          <p className="mt-4 text-xl text-[#2F3337]/70 leading-relaxed mb-12">
            Create your account or reach out to our team to experience scripture study completely reimagined.
          </p>
          <Link href="/contact" className="inline-block px-12 py-5 bg-[#C5A059] text-white font-medium tracking-widest uppercase text-sm hover:bg-[#b08d4b] transition-colors duration-300">
            Contact Us Today
          </Link>
        </div>
      </section>

    </div>
  );
}
