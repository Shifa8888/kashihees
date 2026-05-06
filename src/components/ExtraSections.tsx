import { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Scissors, 
  Award, 
  HelpCircle, 
  Flame, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2, 
  Gift, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Product } from '../data/fashionData';

interface ExtraSectionsProps {
  products: Product[];
  onAddToCart: (product: Product, size: string | null) => void;
  user: {
    name: string;
    persona: string;
    avatar: string;
  };
  addNotification: (message: string) => void;
}

export default function ExtraSections({ products, onAddToCart, user, addNotification }: ExtraSectionsProps) {
  
  // SECTION 1 STATES: Atelier Vision Philosophy Tabs
  const [activeVisionTab, setActiveVisionTab] = useState<'heritage' | 'craft' | 'future'>('heritage');
  
  const visionData = {
    heritage: {
      title: 'Our South Asian Heritage roots',
      subtitle: 'Blending centuries-old silk-weaving and gold gota-patti work with contemporary, sharp fits.',
      description: 'At Kashi’s Styles, we work directly with legacy master weavers in Varanasi and Lucknow to preserve traditional textiles. Each thread carries ancestral stories, reimagined to give you a powerful presence in modern global metropolises.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
      tag: 'Hand-Woven Legacy'
    },
    craft: {
      title: 'Bespot Atelier Hand-Tailoring',
      subtitle: 'No mass production. Custom patterns drawn and scissors guided by masters of the cut.',
      description: 'Every Midnight Velvet Blazer and Anarkali Gown undergoes over 48 hours of meticulous tailoring. Our silk and velvet fabrics are custom-dyed in small batches using eco-friendly natural colors, giving each garment a unique hue variation.',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      tag: 'Atelier Craftsmanship'
    },
    future: {
      title: 'Sustainable Luxury Future',
      subtitle: 'Zero waste patterns, organic premium materials, and life-long repair guarantees.',
      description: 'We believe premium couture should last a lifetime. All Kashi utility cargos and bombers are built with heavyweight water-resistant nylon and triple-reinforced seams. We offer free lifetime alterations and repairs on all elite items.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
      tag: 'Zero-Waste Vision'
    }
  };

  // SECTION 2 STATES: Virtual Style Concierge
  const [vibe, setVibe] = useState<'street' | 'festive' | 'evening' | 'casual'>('street');
  const [preferredSize, setPreferredSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [recoProduct, setRecoProduct] = useState<Product | null>(null);

  const handleGenerateRecommendation = () => {
    // Map vibes to categories
    const categoryMap: Record<string, string> = {
      street: 'Urban Streetwear',
      festive: 'Traditional Elegance',
      evening: 'Luxe Evening',
      casual: 'Casual Chic'
    };
    
    const matchedCategory = categoryMap[vibe];
    const matchingProducts = products.filter(p => p.category === matchedCategory && p.inStock);
    
    if (matchingProducts.length > 0) {
      // Pick a random product from matching category
      const randomProd = matchingProducts[Math.floor(Math.random() * matchingProducts.length)];
      setRecoProduct(randomProd);
      addNotification(`✨ Custom Concierge Outfit Recommended: ${randomProd.name}`);
    } else {
      setRecoProduct(products[0]);
    }
  };

  // SECTION 3 STATES: Lookbook Sets
  const lookbookSets = [
    {
      id: 'look-1',
      name: 'The Festive Fusion Duo',
      tagline: 'Modern Royalty Streetwear pairing',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
      items: ['prod-2', 'prod-6'], // Saffron Silk + Onyx Cargo
      price: 230.00,
      badge: 'Bestseller'
    },
    {
      id: 'look-2',
      name: 'Metropolitan Midnight Evening',
      tagline: 'Satin & rich velvet formal aesthetic',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
      items: ['prod-1', 'prod-8'], // Velvet Blazer + Crimson Satin
      price: 309.99,
      badge: 'Limited Drop'
    }
  ];

  const handleBuySet = (itemIds: string[], setName: string) => {
    let addedCount = 0;
    itemIds.forEach(id => {
      const prod = products.find(p => p.id === id);
      if (prod && prod.inStock) {
        onAddToCart(prod, 'M');
        addedCount++;
      }
    });
    if (addedCount > 0) {
      addNotification(`👜 Added complete "${setName}" look to your cart!`);
    } else {
      addNotification(`Items in this look are currently out of stock.`);
    }
  };

  // SECTION 5 STATES: Sartorial Style Quiz
  const [quizStep, setQuizStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<string>('');

  const handleSelectAnswer = (stepNum: number, value: string) => {
    setAnswers(prev => ({ ...prev, [stepNum]: value }));
    if (stepNum < 3) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate final result based on choices
      const combined = `${answers[1] || ''}-${answers[2] || ''}-${value}`;
      let styleType = 'Neo-Traditionalist';
      if (combined.includes('street') || combined.includes('oversized')) {
        styleType = 'Streetwear Minimalist';
      } else if (combined.includes('velvet') || combined.includes('formal')) {
        styleType = 'Gilded Luxe Maximalist';
      } else if (combined.includes('minimal')) {
        styleType = 'Contemporary Casual Chic';
      }
      setQuizResult(styleType);
      setQuizStep(4);
      addNotification(`🎉 Style diagnosis complete: You are a ${styleType}!`);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(1);
    setAnswers({});
    setQuizResult('');
  };

  return (
    <div className="space-y-16 pt-8 pb-12 font-sans text-white">

      {/* SECTION 1: THE ATELIER VISION (INTERACTIVE PHILOSOPHY) */}
      <section className="bg-zinc-900/40 border border-zinc-900 rounded-3xl overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Tab selection & text info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Atelier Storytelling</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                The Kashi Philosophy & Vision
              </h2>
            </div>

            {/* Interactive Tab Buttons */}
            <div className="flex border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveVisionTab('heritage')}
                className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[10px] ${
                  activeVisionTab === 'heritage' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                1. South Asian Heritage
              </button>
              <button
                onClick={() => setActiveVisionTab('craft')}
                className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[10px] ${
                  activeVisionTab === 'craft' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                2. Atelier Tailoring
              </button>
              <button
                onClick={() => setActiveVisionTab('future')}
                className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[10px] ${
                  activeVisionTab === 'future' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                3. Sustainable Future
              </button>
            </div>

            {/* Dynamic Content Display */}
            <div className="space-y-4 animate-fade-in">
              <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-bold tracking-widest uppercase rounded-full">
                {visionData[activeVisionTab].tag}
              </span>
              <h3 className="text-xl font-extrabold text-white">
                {visionData[activeVisionTab].title}
              </h3>
              <p className="text-zinc-300 font-medium italic text-xs sm:text-sm">
                "{visionData[activeVisionTab].subtitle}"
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {visionData[activeVisionTab].description}
              </p>
            </div>

            {/* Icon Milestones */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60">
              <div className="flex items-center space-x-2 text-zinc-400">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Locally Sourced</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400">
                <Scissors className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Hand-Stitched</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Lifetime Alteration</span>
              </div>
            </div>
          </div>

          {/* Right: Immersive dynamic image */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-zinc-800">
            <img 
              src={visionData[activeVisionTab].image} 
              alt={visionData[activeVisionTab].title} 
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 backdrop-blur-sm p-3.5 rounded-xl border border-zinc-800 text-center">
              <p className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">Kashi Styles Atelier Collection</p>
            </div>
          </div>

        </div>
      </section>


      {/* SECTION 2: INTERACTIVE VIRTUAL STYLE CONCIERGE */}
      <section className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Personalized Wardrobe</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Interactive Style Concierge
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Choose your desired styling vibe and size. Our algorithm will match you with a premium Kashi ensemble instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Input parameters */}
          <div className="lg:col-span-5 space-y-6 bg-zinc-950/80 p-6 rounded-2xl border border-zinc-800">
            {/* Style Vibe Selection */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block">
                Select Your Aesthetic Vibe:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'street', label: 'Urban Streetwear', emoji: '🛹' },
                  { key: 'festive', label: 'Traditional Elegance', emoji: '🕌' },
                  { key: 'evening', label: 'Luxe Evening Wear', emoji: '✨' },
                  { key: 'casual', label: 'Casual Chic Lounging', emoji: '🍂' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setVibe(item.key as any)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center space-x-2 ${
                      vibe === item.key 
                        ? 'border-amber-400 bg-amber-400/5 text-amber-400' 
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/80'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tailor Size Selection */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block">
                Select Tailored Fit:
              </label>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPreferredSize(size as any)}
                    className={`h-10 w-10 text-xs font-bold rounded-lg border transition-all flex items-center justify-center ${
                      preferredSize === size 
                        ? 'border-amber-400 bg-amber-400 text-black font-extrabold' 
                        : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateRecommendation}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10"
            >
              <Flame className="h-4 w-4" />
              <span>Get Curated Recommendation</span>
            </button>
          </div>

          {/* Right: Recommended Garment Card */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {recoProduct ? (
              <div className="bg-zinc-950/80 border border-amber-400/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 animate-fade-in">
                <img 
                  src={recoProduct.image} 
                  alt={recoProduct.name} 
                  className="h-44 w-36 object-cover rounded-xl border border-zinc-800 bg-zinc-900 shadow-md"
                />
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2.5 py-1 rounded-full font-extrabold">
                      🌟 Perfect Concierge Match
                    </span>
                    <h4 className="text-lg font-black text-white mt-2 leading-tight">
                      {recoProduct.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Category: {recoProduct.category} | Size selected: <span className="text-amber-400 font-bold">{preferredSize}</span>
                    </p>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {recoProduct.description}
                  </p>

                  <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-4">
                    <span className="text-lg font-black text-white">${recoProduct.price.toFixed(2)}</span>
                    <button
                      onClick={() => onAddToCart(recoProduct, preferredSize)}
                      className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center space-x-1.5"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Acquire Recommended Garment</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-zinc-950/40 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <Sparkles className="h-10 w-10 text-zinc-700 mb-2 animate-pulse" />
                <p className="text-sm font-semibold">Your personal stylist is waiting.</p>
                <p className="text-xs max-w-xs mt-1">Configure your parameters and tap the curator button on the left to reveal your bespoke outfit match.</p>
              </div>
            )}
          </div>

        </div>
      </section>


      {/* SECTION 3: AUTUMN LOOKBOOK HOTSPOTS & SET BUILDER */}
      <section className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Complete Look Set</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              Autumn '26 Curated Lookbooks
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm">
              Save time and styling effort. Acquire whole coordinated outfits matching our elite blog lookbooks with a single click.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lookbookSets.map((set) => (
            <div 
              key={set.id}
              className="bg-zinc-950/80 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-zinc-800 transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={set.image} 
                  alt={set.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
                <span className="absolute top-4 left-4 bg-amber-400 text-black text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                  {set.badge}
                </span>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-base font-bold text-white drop-shadow-md">{set.name}</h4>
                  <p className="text-[10px] text-zinc-300 italic">{set.tagline}</p>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-500">Includes 2 premium garments</p>
                  <p className="text-base font-black text-white">${set.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleBuySet(set.items, set.name)}
                  className="px-5 py-2.5 bg-amber-400 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-colors flex items-center space-x-1.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Acquire Full Styled Set</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* SECTION 4: LOYALTY CLUB CARD & MEMBERSHIP MILESTONES */}
      <section className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Gamified interactive card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm h-56 rounded-2xl bg-gradient-to-br from-zinc-900 via-neutral-950 to-amber-950/40 border border-amber-400/30 p-6 flex flex-col justify-between overflow-hidden shadow-xl shadow-amber-500/[0.02]">
              {/* Abstract decorative graphic */}
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 rounded-full bg-amber-400/5 blur-2xl pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-400">Atelier Elite Card</h4>
                  <p className="text-[9px] text-zinc-500 uppercase">Kashi Styles Membership Program</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
                  <Sparkles className="h-4.5 w-4.5 text-black" />
                </div>
              </div>

              <div className="space-y-1.5 relative z-10">
                <p className="text-[9px] uppercase tracking-wider text-zinc-500">Member Identity</p>
                <div className="flex items-center space-x-2">
                  <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full object-cover border border-amber-400/30" />
                  <div>
                    <h5 className="text-sm font-bold text-white leading-none">{user.name}</h5>
                    <p className="text-[9px] text-amber-400 italic mt-0.5">{user.persona}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center relative z-10 border-t border-zinc-900 pt-3">
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-zinc-500">Current Level</p>
                  <p className="text-xs font-black uppercase tracking-wider text-amber-400">Velvet Imperial Tier</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-wider text-zinc-500">Loyalty Points</p>
                  <p className="text-xs font-black text-white text-right">4,850 pts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Benefits list and Claim Gift */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Gamified Rewards</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                Loyalty Milestones & Privileges
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                You are enrolled in our highest tier as a Velvet Imperial Member. Build points by buying bespoke garments or engaging with the style editorials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-start space-x-3">
                <div className="h-8 w-8 rounded bg-amber-400/10 flex items-center justify-center shrink-0">
                  <Gift className="h-4.5 w-4.5 text-amber-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-200 uppercase">Anniversary Gifts</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Complimentary handcrafted silk pocket square or scarf sent to your door annually.</p>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 flex items-start space-x-3">
                <div className="h-8 w-8 rounded bg-amber-400/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4.5 w-4.5 text-amber-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-200 uppercase">Priority Tailoring</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Your garment measurements saved in our atelier databases and drafted first in line.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => addNotification('🎁 Imperial Velvet Welcome Gift Claimed! A customized handwoven silk pocket square has been added to your shipping profile.')}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold uppercase tracking-wider rounded-xl text-amber-400 flex items-center space-x-1.5 transition-all"
            >
              <span>Claim Welcome VIP Gift</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>


      {/* SECTION 5: THE SARTORIAL STYLE QUIZ */}
      <section className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase font-black tracking-widest text-amber-400">Interactive Quiz</span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Find Your Signature Kashi Vibe
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Complete our 3-question diagnostic style quiz to discover your exact wardrobe vibe and unlock a secret custom promo code!
          </p>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 sm:p-8">
          
          {quizStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Question 1 of 3</p>
                <HelpCircle className="h-4 w-4 text-amber-400" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">How do you prefer your garment shoulders and silhouette tailored?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { val: 'oversized', desc: 'Relaxed, dropped-shoulder oversized streetwear structure.' },
                  { val: 'sharp', desc: 'Bespoke tailoring, sharp shoulders, and clean form-fitting lines.' },
                  { val: 'flared', desc: 'Flowing flares, elegant drapes, and traditional silk curves.' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => handleSelectAnswer(1, opt.val)}
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all"
                  >
                    <p className="text-xs font-black uppercase text-amber-400 mb-1">{opt.val}</p>
                    <p className="text-[11px] text-zinc-400 leading-normal">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Question 2 of 3</p>
                <HelpCircle className="h-4 w-4 text-amber-400" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">Which fabric textures feel best against your skin?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { val: 'velvet', desc: 'High-density cotton velvet or luxurious evening satins.' },
                  { val: 'silk', desc: 'Legacy handwoven silk, linen blends, or pure lightweight georgette.' },
                  { val: 'heavy-twill', desc: 'Heavyweight cotton-twill, water-resistant nylon, or modular technical fabrics.' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => handleSelectAnswer(2, opt.val)}
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all"
                  >
                    <p className="text-xs font-black uppercase text-amber-400 mb-1">{opt.val}</p>
                    <p className="text-[11px] text-zinc-400 leading-normal">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Question 3 of 3</p>
                <HelpCircle className="h-4 w-4 text-amber-400" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-white">What type of events make up your typical weekly calendar?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { val: 'street', desc: 'Art galleries, underground live shows, coffee shop networking.' },
                  { val: 'formal', desc: 'Premium cocktail banquets, high-end fine dining, galas.' },
                  { val: 'minimal', desc: 'Cozy weekend brunches, relaxed beach retreats, work from home.' }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => handleSelectAnswer(3, opt.val)}
                    className="p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-xl text-left transition-all"
                  >
                    <p className="text-xs font-black uppercase text-amber-400 mb-1">{opt.val}</p>
                    <p className="text-[11px] text-zinc-400 leading-normal">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 4 && (
            <div className="space-y-6 text-center py-6 animate-fade-in">
              <div className="h-14 w-14 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-amber-400/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Your Custom Style Diagnosis</p>
                <h4 className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                  {quizResult}
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Based on your choices, your aesthetic is perfectly suited for Kashi's premium blends.
                </p>
              </div>

              {/* Dynamic reward display */}
              <div className="max-w-sm mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Secret Coupon Unlocked</p>
                <p className="text-lg font-black text-white tracking-widest uppercase">KASHI20</p>
                <p className="text-[10px] text-zinc-400">Enter this code at checkout to claim your 20% off discount!</p>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
