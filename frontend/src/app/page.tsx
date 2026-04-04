import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Mail, Monitor, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#FFD200] selection:text-[#132A4B] dark:selection:text-[#132A4B] bg-background text-foreground transition-colors duration-300">
      {/* Hero Section - Yellow Immersive Layout */}
      <section className="relative overflow-hidden bg-[#FFCC00] dark:bg-[#E5B800] min-h-[85vh] px-4 md:px-8 flex items-center transition-colors py-20">
        <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-12 items-center gap-8 md:gap-12 relative z-10">
          
          {/* Left Column - Large Text */}
          <div className="md:col-span-4 lg:col-span-3 text-left">
            <span className="block text-[#132A4B]/60 uppercase tracking-[0.2em] text-[11px] font-black mb-4">Milkyway Edition</span>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-[#132A4B] mb-2 uppercase">
              Milkyway <br/>
              <span className="text-[#132A4B]/40 italic">Systems</span>
            </h1>
            <p className="text-[#132A4B]/60 text-xs uppercase tracking-[0.2em] font-bold mt-6">Secure Revenue Channels</p>
          </div>

          {/* Center Column - Static Llama Artwork (Smaller Size) */}
          <div className="md:col-span-4 lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[380px] md:max-w-[420px] lg:max-w-[480px]">
              <Image
                src="/hero-llama.png"
                alt="Llama Artwork"
                width={800}
                height={800}
                priority
                className="w-full h-auto object-contain mix-blend-multiply opacity-90 transition-transform duration-700 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Right Column - Details/CTA */}
          <div className="md:col-span-4 lg:col-span-3 text-left md:text-right space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-[#132A4B] tracking-tight uppercase">Llama Series. 01</h3>
              <p className="text-[#132A4B]/70 text-sm leading-relaxed max-w-[280px] md:ml-auto font-bold italic">
                Our Llama framework supports a robust multi-dimensional network of global sales professionals and enterprise software.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 items-start md:items-end">
              <Link href="/become-seller">
                <button className="bg-[#132A4B] text-white hover:bg-black transition-all px-8 py-3.5 rounded-xl font-black text-sm flex items-center gap-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-none uppercase tracking-[0.15em]">
                  Partner Now
                </button>
              </Link>
              
              <div className="flex items-center gap-2 text-[#132A4B]/40 font-black cursor-pointer hover:text-[#132A4B] transition-colors uppercase text-[10px] tracking-[0.1em]">
                <span className="text-lg">↓</span>
                <span>Scroll to explore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black opacity-[0.03] rounded-full blur-[80px] pointer-events-none"></div>
      </section>

      {/* MILKYWAY Intro - White */}
      <section className="bg-background pt-24 pb-16 px-4 md:px-8 transition-colors">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-foreground text-3xl md:text-5xl font-black mb-8 tracking-tight">
            MILKYWAY is not your typical<br/>software sales system
          </h2>
          <p className="text-foreground/80 text-lg md:text-xl font-normal mb-12 max-w-[800px] mx-auto leading-relaxed">
            We&apos;re bringing the traditional business scalability experience to your smartphone. The platform is created for those who yearn for meaningful revenue generation in the era of instant messaging. We hope to connect people around the world at a better pace - one module at a time.
            <br/><br/>
            Meet a new client, seal your deal &amp; collect a commission - start connecting with the world on MILKYWAY!
          </p>

          <div className="flex flex-col xl:flex-row justify-center items-center gap-20 xl:gap-24 mt-16 max-w-[1200px] mx-auto">
            {/* Desktop UI */}
            <div className="w-full xl:w-[70%] h-[450px] bg-card border-2 border-foreground rounded-[1rem] p-0 shadow-2xl relative overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-500 z-10 w-full max-w-[750px] mx-auto">
              <div className="h-10 border-b-2 border-foreground bg-muted flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-foreground bg-[#FFCC00]"></div>
                <div className="w-3 h-3 rounded-full border-2 border-foreground bg-foreground/20"></div>
                <div className="w-3 h-3 rounded-full border-2 border-foreground bg-foreground/20"></div>
                <div className="ml-4 h-5 w-1/2 bg-background border-2 border-foreground rounded-full"></div>
              </div>
              
              <div className="flex-1 bg-background p-4 md:p-6 flex gap-6 text-left">
                 <div className="w-48 border-2 border-foreground border-dashed rounded-xl p-4 hidden sm:flex flex-col gap-4">
                    <div className="h-8 bg-foreground w-full rounded-md mb-4"/>
                    <div className="h-4 bg-muted-foreground/30 w-3/4 rounded-sm"/>
                    <div className="h-4 bg-muted-foreground/30 w-full rounded-sm"/>
                    <div className="h-4 bg-muted-foreground/30 w-5/6 rounded-sm"/>
                 </div>
                 <div className="flex-1 flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div className="font-black text-foreground text-xl md:text-2xl flex items-center gap-2">
                        <Monitor strokeWidth={3} /> Dashboard
                      </div>
                      <div className="px-4 py-2 bg-[#FFCC00] border-2 border-foreground font-black text-[#132A4B] rounded-lg shadow-[2px_2px_0px_var(--color-foreground)]">
                        + Deal
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-muted border-2 border-foreground rounded-xl p-4 shadow-[2px_2px_0px_var(--color-foreground)]">
                         <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Active Deals</div>
                         <div className="font-black text-2xl text-foreground">24</div>
                       </div>
                       <div className="bg-muted border-2 border-foreground rounded-xl p-4 shadow-[2px_2px_0px_var(--color-foreground)]">
                         <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Earnings</div>
                         <div className="font-black text-2xl text-foreground">$12,450</div>
                       </div>
                    </div>

                    <div className="bg-[#FFCC00] border-2 border-foreground rounded-xl p-4 shadow-[2px_2px_0px_var(--color-foreground)]">
                      <div className="text-xs font-bold uppercase tracking-wider mb-2 text-[#132A4B]">Latest Sale</div>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-foreground">Enterprise Suite</span>
                        <span className="font-black text-[#132A4B]">+$2,500</span>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Mobile Phone */}
            <div className="w-[200px] h-[420px] bg-card border-2 border-foreground rounded-[2.5rem] p-3 shadow-2xl relative overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-500 z-20 flex-shrink-0 mx-auto">
              <div className="absolute top-0 inset-x-0 h-7 bg-card flex justify-center z-10">
                <div className="w-20 h-5 bg-foreground rounded-b-xl border-t-0"></div>
              </div>
              
              <div className="flex-1 bg-background border-2 border-foreground rounded-3xl p-4 relative border-dashed overflow-hidden flex flex-col pt-8 text-left">
                <div className="font-black text-foreground text-xl mb-6 text-center leading-tight">Sync<br/>Anywhere</div>
                
                <div className="space-y-4 flex-1">
                  <div className="bg-[#FFCC00] border-2 border-foreground rounded-xl p-3 shadow-[2px_2px_0px_var(--color-foreground)] transform -rotate-2">
                     <span className="font-black text-[#132A4B] text-sm">Sale closed! </span>
                  </div>
                  <div className="bg-muted border-2 border-foreground rounded-xl p-3 shadow-[2px_2px_0px_var(--color-foreground)] transform rotate-1">
                     <div className="h-2 bg-foreground/40 w-full mb-2"></div>
                     <div className="h-2 bg-foreground/40 w-2/3"></div>
                  </div>
                  <div className="bg-muted border-2 border-foreground rounded-xl p-3 shadow-[2px_2px_0px_var(--color-foreground)]">
                     <div className="h-2 bg-foreground/40 w-full mb-2"></div>
                     <div className="h-2 bg-foreground/40 w-2/3"></div>
                  </div>
                </div>

                <div className="mt-auto flex justify-center pb-2">
                    <div className="w-10 h-10 border-2 border-foreground rounded-full flex items-center justify-center bg-foreground text-background">
                       <Smartphone className="w-5 h-5" />
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MATCH. SELL. COLLECT - Black */}
      <section className="bg-black py-20 px-4 text-center transition-colors">
        <p className="font-black tracking-widest text-3xl md:text-5xl px-4 uppercase text-white">MATCH. SELL. COLLECT COMMISSIONS.</p>
      </section>

      {/* How It Works - Infographic Flowchart */}
      <section className="bg-white py-28 px-4 md:px-8 transition-colors">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[#132A4B] text-4xl md:text-5xl font-black mb-4 text-center tracking-tight">
            How Milkyway Works
          </h2>
          <p className="text-[#132A4B]/70 text-center mb-16 max-w-[600px] mx-auto text-lg">
            A continuous cycle of earning - click each step for details!
          </p>
          
          {/* Infographic Flowchart - Desktop */}
          <div className="hidden md:block relative">
            {/* Main horizontal flow */}
            <div className="flex items-center justify-center gap-2">
              {/* Step 1 - Choose Product */}
              <div className="flex flex-col items-center group cursor-pointer relative">
                <div className="bg-[#FFCC00] rounded-full w-28 h-28 flex items-center justify-center border-4 border-[#132A4B] shadow-lg group-hover:scale-110 transition-transform">
                  <Monitor className="w-12 h-12 text-[#132A4B]" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-[#132A4B] font-bold text-xl">1. Choose</h3>
                  <p className="text-[#132A4B]/70 text-sm mt-1">Select from our software catalog</p>
                </div>
                
                {/* Popup */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-[#132A4B] text-white p-4 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-2xl">
                  <h4 className="font-bold text-[#FFCC00] mb-2">Choose a Product</h4>
                  <p className="text-sm">Browse our catalog of premium software solutions. Select the systems you want to pitch based on your target market.</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• CRM Systems</li>
                    <li>• ERP Solutions</li>
                    <li>• Marketing Tools</li>
                    <li>• Analytics Platforms</li>
                  </ul>
                </div>
              </div>
              
              {/* Arrow 1 */}
              <div className="flex-shrink-0 -mt-16">
                <svg className="w-10 h-10 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Step 2 - Find Client */}
              <div className="flex flex-col items-center group cursor-pointer relative">
                <div className="bg-[#FFCC00] rounded-full w-28 h-28 flex items-center justify-center border-4 border-[#132A4B] shadow-lg group-hover:scale-110 transition-transform">
                  <Smartphone className="w-12 h-12 text-[#132A4B]" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-[#132A4B] font-bold text-xl">2. Pitch</h3>
                  <p className="text-[#132A4B]/70 text-sm mt-1">Find clients using our demos</p>
                </div>
                
                {/* Popup */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-[#132A4B] text-white p-4 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-2xl">
                  <h4 className="font-bold text-[#FFCC00] mb-2">Find a Client</h4>
                  <p className="text-sm">Reach out to potential customers using our professional demos and sales tools.</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Use provided demos</li>
                    <li>• Present pitch decks</li>
                    <li>• Handle objections</li>
                    <li>• Schedule follow-ups</li>
                  </ul>
                </div>
              </div>
              
              {/* Arrow 2 */}
              <div className="flex-shrink-0 -mt-16">
                <svg className="w-10 h-10 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              {/* Step 3 - Close & Earn */}
              <div className="flex flex-col items-center group cursor-pointer relative">
                <div className="bg-[#FFCC00] rounded-full w-28 h-28 flex items-center justify-center border-4 border-[#132A4B] shadow-lg group-hover:scale-110 transition-transform">
                  <Mail className="w-12 h-12 text-[#132A4B]" />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-[#132A4B] font-bold text-xl">3. Earn</h3>
                  <p className="text-[#132A4B]/70 text-sm mt-1">Close deals & get commission</p>
                </div>
                
                {/* Popup */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 bg-[#132A4B] text-white p-4 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-2xl">
                  <h4 className="font-bold text-[#FFCC00] mb-2">Close & Earn</h4>
                  <p className="text-sm">When a client purchases, you earn commission on every sale!</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Up to 30% commission</li>
                    <li>• Weekly payouts</li>
                    <li>• Performance bonuses</li>
                    <li>• Revenue tracking dashboard</li>
                  </ul>
                </div>
              </div>
              
              {/* Arrow 3 - back to start (cycle) */}
              <div className="flex-shrink-0 -mt-16 flex items-center">
                <svg className="w-10 h-10 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M21 12a9 9 0 11-6.219-8.56M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            {/* Cycle Label */}
            <div className="flex justify-center mt-12">
              <div className="bg-[#FFCC00] text-[#132A4B] px-8 py-3 rounded-full flex items-center gap-3 font-bold shadow-lg">
                <span>Repeat the cycle</span>
                <span>→</span>
                <span>Choose</span>
                <span>→</span>
                <span>Pitch</span>
                <span>→</span>
                <span>Earn</span>
              </div>
            </div>
          </div>
          
          {/* Mobile: Vertical Infographic */}
          <div className="md:hidden">
            <div className="flex flex-col items-center gap-8">
              {/* Step 1 */}
              <div className="flex items-center gap-5 w-full max-w-sm group cursor-pointer relative">
                <div className="bg-[#FFCC00] rounded-full w-20 h-20 flex items-center justify-center border-3 border-[#132A4B] flex-shrink-0">
                  <Monitor className="w-9 h-9 text-[#132A4B]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#132A4B] font-bold text-lg">1. Choose</h3>
                  <p className="text-[#132A4B]/70 text-sm">Select software to pitch</p>
                </div>
                
                {/* Mobile popup */}
                <div className="absolute top-full mt-2 left-0 w-full bg-[#132A4B] text-white p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <p className="text-xs">Browse CRM, ERP, Marketing & Analytics tools. Pick what fits your audience.</p>
                </div>
              </div>
              
              {/* Arrow */}
              <svg className="w-8 h-8 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Step 2 */}
              <div className="flex items-center gap-5 w-full max-w-sm group cursor-pointer relative">
                <div className="bg-[#FFCC00] rounded-full w-20 h-20 flex items-center justify-center border-3 border-[#132A4B] flex-shrink-0">
                  <Smartphone className="w-9 h-9 text-[#132A4B]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#132A4B] font-bold text-lg">2. Pitch</h3>
                  <p className="text-[#132A4B]/70 text-sm">Find and pitch to clients</p>
                </div>
                
                <div className="absolute top-full mt-2 left-0 w-full bg-[#132A4B] text-white p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <p className="text-xs">Use demos and pitch decks. Talk to businesses, present solutions, handle questions.</p>
                </div>
              </div>
              
              {/* Arrow */}
              <svg className="w-8 h-8 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Step 3 */}
              <div className="flex items-center gap-5 w-full max-w-sm group cursor-pointer relative">
                <div className="bg-[#FFCC00] rounded-full w-20 h-20 flex items-center justify-center border-3 border-[#132A4B] flex-shrink-0">
                  <Mail className="w-9 h-9 text-[#132A4B]" />
                </div>
                <div className="text-left">
                  <h3 className="text-[#132A4B] font-bold text-lg">3. Earn</h3>
                  <p className="text-[#132A4B]/70 text-sm">Close & get paid commission</p>
                </div>
                
                <div className="absolute top-full mt-2 left-0 w-full bg-[#132A4B] text-white p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                  <p className="text-xs">Earn up to 30% commission. Track sales, receive weekly payouts & bonuses!</p>
                </div>
              </div>
              
              {/* Cycle Indicator */}
              <div className="bg-[#FFCC00] text-[#132A4B] px-6 py-2 rounded-full flex items-center gap-2 font-bold text-sm mt-4">
                <span>Repeat → Choose → Pitch → Earn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section - Dark */}
      <section className="bg-[#132A4B] py-24 px-4 md:px-8 transition-colors">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-white text-3xl md:text-4xl font-black mb-4 text-center tracking-tight">
            Who Can Join
          </h2>
          <p className="text-white/60 text-center mb-16 max-w-[600px] mx-auto">
            Perfect for anyone with a network
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Students", desc: "looking to earn" },
              { title: "Freelancers", desc: "extra income" },
              { title: "Sales professionals", desc: "grow your portfolio" },
              { title: "Anyone", desc: "with a network" },
            ].map((item, i) => (
              <div key={i} className="border-2 border-white/20 rounded-xl p-6 text-center hover:border-white/40 hover:bg-white/5 transition-all">
                <h3 className="text-white text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Black */}
      <section className="bg-black py-24 px-4 md:px-8 transition-colors">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-white text-3xl md:text-4xl font-black mb-12 text-center tracking-tight">
            FAQ
          </h2>
          
          <div className="space-y-4">
            {[
              { q: "Do I need technical skills?", a: "No! You don't need any technical background. We provide all the tools and training you need." },
              { q: "How do I get paid?", a: "Payments are processed monthly via bank transfer or PayPal once you submit a closed deal." },
              { q: "How do I find clients?", a: "Use our platform tools, demos, and marketing materials to pitch to your existing network." },
              { q: "Is there a joining fee?", a: "No, joining the Milkyway partner program is completely free." },
            ].map((item, i) => (
              <details key={i} className="group bg-white/10 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-white font-medium pr-4">{item.q}</span>
                  <span className="text-[#FFCC00] text-2xl font-light transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-white/60 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
