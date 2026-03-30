import Link from "next/link";
import { ArrowDown, Mail, Monitor, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#FFD200] selection:text-[#132A4B] dark:selection:text-[#132A4B] bg-background text-foreground transition-colors duration-300">
      {/* Hero Section - Yellow */}
      <section className="bg-[#FFCC00] dark:bg-[#E5B800] min-h-[90vh] px-4 md:px-8 relative overflow-hidden transition-colors flex items-center">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Text */}
          <div className="z-10 mt-10">
            <h1 className="text-[3.5rem] md:text-[5.5rem] font-black text-[#132A4B] leading-[0.95] mb-6 tracking-tight">
              <span className="block text-[0.3em] font-bold mb-2 tracking-widest uppercase">Welcome to</span>
              MILKYWAY
            </h1>
            <p className="text-xl md:text-2xl text-[#132A4B] mb-10 font-bold max-w-lg leading-snug">
              Build a scalable software revenue stream.<br/>
              Partner with us to distribute premium enterprise solutions. Seal deals, manage clients, and collect commissions globally.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-20">
              <Link href="/become-seller" className="bg-[#132A4B] text-white hover:bg-black transition-colors px-8 py-4 rounded-xl font-black text-lg flex items-center gap-3 shadow-[4px_4px_0px_#000000] active:translate-y-1 active:shadow-none uppercase tracking-wide">
                <Mail className="w-6 h-6" strokeWidth={3} />
                Partner Program
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 text-[#132A4B] font-bold cursor-pointer hover:opacity-70 transition-opacity">
              <ArrowDown className="w-6 h-6" strokeWidth={3} />
              <span className="text-lg">Scroll down to learn more</span>
            </div>
          </div>

          {/* Right - Llama with Halo */}
          <div className="flex justify-center relative z-10 hidden md:flex h-[650px] items-center">
            <div className="relative">
              {/* Rotating Halo */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-6">
                <svg viewBox="0 0 100 25" className="w-full animate-spin" style={{ animationDuration: '4s' }}>
                  <ellipse cx="50" cy="12" rx="45" ry="10" fill="none" stroke="#132A4B" strokeWidth="2.5"/>
                </svg>
              </div>
              
              {/* Clean Llama Silhouette */}
              <svg viewBox="0 0 200 280" className="w-full max-w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Body - oval */}
                <ellipse cx="100" cy="180" rx="55" ry="40" fill="white" stroke="#132A4B" strokeWidth="3"/>
                {/* Neck - curved tube */}
                <path d="M130 155 Q 145 110, 135 70 Q 130 50, 145 40" fill="white" stroke="#132A4B" strokeWidth="3"/>
                {/* Head - rounded */}
                <ellipse cx="150" cy="45" rx="22" ry="18" fill="white" stroke="#132A4B" strokeWidth="3"/>
                {/* Ears */}
                <path d="M135 30 Q 130 5, 145 20" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
                <path d="M150 28 Q 155 5, 168 18" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
                {/* Eye */}
                <circle cx="158" cy="42" r="3" fill="#132A4B"/>
                {/* Snout */}
                <ellipse cx="168" cy="52" rx="8" ry="5" fill="white" stroke="#132A4B" strokeWidth="2"/>
                {/* Legs */}
                <rect x="60" y="210" width="14" height="45" rx="6" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
                <rect x="85" y="210" width="14" height="45" rx="6" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
                <rect x="115" y="210" width="14" height="45" rx="6" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
                <rect x="140" y="210" width="14" height="45" rx="6" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
                {/* Tail */}
                <path d="M45 170 Q 25 165, 28 185 Q 32 200, 50 195" fill="white" stroke="#132A4B" strokeWidth="2.5"/>
              </svg>
            </div>
          </div>
        </div>
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

      {/* How It Works - White */}
      <section className="bg-white py-24 px-4 md:px-8 transition-colors">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-[#132A4B] text-3xl md:text-4xl font-black mb-4 text-center tracking-tight">
            How Milkyway Works
          </h2>
          <p className="text-[#132A4B]/70 text-center mb-16 max-w-[600px] mx-auto">
            Three simple steps to start earning
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-4 items-start">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-[#132A4B]">
              <div className="w-20 h-20 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Monitor className="w-10 h-10 text-[#132A4B]" />
              </div>
              <h3 className="text-[#132A4B] text-xl font-bold mb-3">Choose a product</h3>
              <p className="text-[#132A4B]/70 text-sm">Browse ready-made software solutions from our catalog</p>
            </div>
            
            {/* Yellow Curved Arrow 1 */}
            <div className="hidden md:flex items-center justify-center h-[140px]">
              <svg className="w-16 h-16 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M4 12h12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12v6a2 2 0 01-2 2H8" strokeLinecap="round"/>
              </svg>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-[#132A4B]">
              <div className="w-20 h-20 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-[#132A4B]" />
              </div>
              <h3 className="text-[#132A4B] text-xl font-bold mb-3">Find a client</h3>
              <p className="text-[#132A4B]/70 text-sm">Pitch using our demos and tools</p>
            </div>
            
            {/* Yellow Curved Arrow 2 */}
            <div className="hidden md:flex items-center justify-center h-[140px]">
              <svg className="w-16 h-16 text-[#FFCC00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M4 12h12m0 0l-4-4m4 4l4-4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 12v6a2 2 0 01-2 2H8" strokeLinecap="round"/>
              </svg>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border-2 border-[#132A4B]">
              <div className="w-20 h-20 bg-[#FFCC00] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-[#132A4B]" />
              </div>
              <h3 className="text-[#132A4B] text-xl font-bold mb-3">Close & earn</h3>
              <p className="text-[#132A4B]/70 text-sm">Submit the deal and get paid commission</p>
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
