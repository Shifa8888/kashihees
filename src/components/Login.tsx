import React, { useState, useEffect } from 'react';
import { Mail, Lock, Sparkles, User, ArrowRight, Heart } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: { name: string; email: string; avatar: string; persona: string }) => void;
}

const PERSONAS = [
  {
    id: 'p1',
    name: 'Aria Sterling',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    description: 'Couture Enthusiast & Luxe Writer',
    tag: 'Luxe Evening'
  },
  {
    id: 'p2',
    name: 'Kenji Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    description: 'Streetwear Icon & Sneakerhead',
    tag: 'Urban Streetwear'
  },
  {
    id: 'p3',
    name: 'Zara Malhotra',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    description: 'Fusion Diva & Textile Scholar',
    tag: 'Traditional Elegance'
  },
  {
    id: 'p4',
    name: 'Lucas Dupont',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    description: 'Sartorial Minimalist & Stylist',
    tag: 'Casual Chic'
  }
];

const QUOTES = [
  "Fashion is the armor to survive the reality of everyday life. — Bill Cunningham",
  "Style is a way to say who you are without having to speak. — Rachel Zoe",
  "Kashi's Styles brings you the fusion of raw urban edge and royal heritage fabrics.",
  "Elegance is not standing out, but being remembered. — Giorgio Armani"
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]);
  const [customName, setCustomName] = useState('');
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate luxury brand portal verification
    setTimeout(() => {
      onLogin({
        name: customName.trim() || selectedPersona.name,
        email: email,
        avatar: selectedPersona.avatar,
        persona: selectedPersona.description
      });
      setIsLoading(false);
    }, 1200);
  };

  const handleQuickLogin = (persona: typeof PERSONAS[0]) => {
    setEmail(`${persona.name.toLowerCase().replace(/\s+/g, '')}@kashistyles.com`);
    setPassword('kashi2026');
    setSelectedPersona(persona);
    setCustomName(persona.name);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-zinc-950 text-white font-sans selection:bg-amber-400 selection:text-black">
      {/* Left side: Editorial Showcase & Brand Aesthetics */}
      <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-950 to-amber-950/20 border-r border-zinc-900">
        
        {/* Abstract floating circles for animations */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-600/5 blur-[150px] pointer-events-none animate-pulse duration-[12000ms]" />

        {/* Top Header branding */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="h-5 w-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-amber-400">KASHI'S STYLES</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400">Elite Atelier & Couture Blog</p>
          </div>
        </div>

        {/* Main Content: Big Fashion image placeholder with Overlay */}
        <div className="relative my-auto z-10 max-w-xl">
          <div className="absolute -top-6 -left-6 text-[120px] font-extrabold text-zinc-900/40 select-none leading-none">
            COUTURE
          </div>
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-amber-400 border border-amber-400/30 rounded-full bg-amber-400/5">
            Autumn / Winter '26 Collection
          </span>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Where Raw <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 font-serif italic">Streetwear</span> Meets Royal Heritage.
          </h2>
          
          {/* Animated Quotes Carousel */}
          <div className="min-h-[80px] border-l-2 border-amber-400 pl-4 transition-all duration-700 ease-in-out">
            <p className="text-zinc-300 italic text-lg leading-relaxed transition-opacity duration-500">
              "{QUOTES[activeQuoteIndex]}"
            </p>
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 flex justify-between items-center text-xs text-zinc-500">
          <p>© 2026 Kashi's Styles Inc. All premium rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#privacy" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right side: Beautiful Login Form & Persona selection */}
      <div className="lg:col-span-5 flex flex-col justify-center p-6 sm:p-12 md:p-16 relative bg-zinc-950">
        
        {/* Small decorative logo for mobile screens */}
        <div className="flex lg:hidden items-center space-x-3 mb-8">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-amber-400">KASHI'S STYLES</h1>
            <p className="text-[9px] uppercase tracking-widest text-zinc-400">Elite Atelier & Couture Blog</p>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Form Header */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sign In to <span className="text-amber-400 font-serif italic">the Atelier</span>
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              Any email and password works. Customize your identity below to participate in our luxury fashion blogs & shopping experiences.
            </p>
          </div>

          {/* Persona selector */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Choose Your Fashion Persona</span>
              <span className="text-[10px] text-amber-400 lowercase">Affects your blog avatar</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PERSONAS.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleQuickLogin(persona)}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-300 flex items-center space-x-2.5 group relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_12px_rgba(251,191,36,0.1)]'
                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80'
                    }`}
                  >
                    <img
                      src={persona.avatar}
                      alt={persona.name}
                      className="h-9 w-9 rounded-full object-cover border border-zinc-700 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-100 truncate">{persona.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{persona.tag}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute right-1 top-1 bg-amber-400 rounded-full p-0.5">
                        <svg className="w-2 h-2 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Traditional Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Custom Name (Optional overlay) */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-semibold flex items-center justify-between">
                <span>Display Name</span>
                <span className="text-zinc-500 font-normal italic">Optional customization</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder={selectedPersona.name}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@kashistyles.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                  Password
                </label>
                <span className="text-[10px] text-zinc-500 italic">Try "kashi2026" or any</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-400 animate-shake">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-sm tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>ENTERING THE ATELIER...</span>
                </>
              ) : (
                <>
                  <span>ENTER EXCLUSIVE ATELIER</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Secondary reassurance */}
          <div className="pt-4 border-t border-zinc-900 flex flex-col items-center justify-center space-y-2 text-xs text-zinc-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span>Free Luxury Club Membership Included</span>
            </div>
            <p className="text-center">
              Logging in gives you power to post comments, write original blogs, and build your fashion cart.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
