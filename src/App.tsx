import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ShoppingBag, 
  Search, 
  Plus, 
  Heart, 
  MessageSquare, 
  LogOut, 
  Star, 
  Calendar, 
  Clock, 
  Send,
  X,
  Menu
} from 'lucide-react';
import { BLOG_POSTS, PRODUCTS, BlogPost, Product } from './data/fashionData';
import Login from './components/Login';
import CartDrawer, { CartItem } from './components/CartDrawer';
import CreatePostModal from './components/CreatePostModal';
import ExtraSections from './components/ExtraSections';

interface UserData {
  name: string;
  email: string;
  avatar: string;
  persona: string;
}

interface ToastNotification {
  id: string;
  message: string;
}

export default function App() {
  // Login Session
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('kashi_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Dynamic Blog & Shop Data States
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('kashi_posts');
    return saved ? JSON.parse(saved) : BLOG_POSTS;
  });

  const [products] = useState<Product[]>(PRODUCTS);
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kashi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // UI States
  const [activeTab, setActiveTab] = useState<'blog' | 'shop'>('blog');
  const [blogCategory, setBlogCategory] = useState<string>('All');
  const [shopCategory, setShopCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Drawer visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Mobile UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected sizes for shop product cards (key: productId, value: size string)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  // Dynamic Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Local Storage synchronizers
  useEffect(() => {
    if (user) {
      localStorage.setItem('kashi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kashi_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kashi_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('kashi_cart', JSON.stringify(cart));
  }, [cart]);

  // Toast utility helper
  const addNotification = (message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    addNotification(`Welcome, ${userData.name}! Enjoy Kashi's Styles Elite Club.`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kashi_user');
    addNotification('Logged out successfully from the Atelier.');
  };

  // Blog Interactions
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const hasLiked = localStorage.getItem(`liked_${postId}`);
          if (hasLiked) {
            localStorage.removeItem(`liked_${postId}`);
            addNotification('Removed like from article.');
            return { ...post, likes: post.likes - 1 };
          } else {
            localStorage.setItem(`liked_${postId}`, 'true');
            addNotification('💖 Liked article!');
            return { ...post, likes: post.likes + 1 };
          }
        }
        return post;
      })
    );

    // Update active modal post to keep it synchronized in real-time
    if (selectedPost && selectedPost.id === postId) {
      const hasLiked = localStorage.getItem(`liked_${postId}`);
      setSelectedPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: hasLiked ? prev.likes - 1 : prev.likes + 1
        };
      });
    }
  };

  const handleAddComment = (postId: string, contentStr: string) => {
    if (!contentStr.trim()) return;
    if (!user) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      author: user.name,
      avatar: user.avatar,
      content: contentStr,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );

    // Update active modal post as well
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          comments: [...prev.comments, newComment]
        };
      });
    }

    addNotification('Comment posted successfully!');
  };

  const handleCreatePost = (newPostData: Omit<BlogPost, 'id' | 'likes' | 'comments'>) => {
    const newPost: BlogPost = {
      ...newPostData,
      id: `blog-${Date.now()}`,
      likes: 12, // starting likes
      comments: []
    };
    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('blog');
  };

  // Cart Interactions
  const handleAddToCart = (product: Product, size: string | null) => {
    const finalSize = size || selectedSizes[product.id] || product.sizes[0] || 'M';
    
    if (!product.inStock) {
      addNotification('This luxury item is currently out of stock.');
      return;
    }

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === finalSize
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { product, selectedSize: finalSize, quantity: 1 }];
      }
    });

    addNotification(`👜 Added ${product.name} (Size: ${finalSize}) to your Cart!`);
  };

  const handleUpdateQuantity = (productId: string, size: string, change: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const nextQty = item.quantity + change;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    ));
    addNotification('Removed garment from cart.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Filtering Logic
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = blogCategory === 'All' || post.category === blogCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = shopCategory === 'All' || prod.category === shopCategory;
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render Login screen if no session exists
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-400 selection:text-black">
      
      {/* Dynamic Toasts Container */}
      <div className="fixed bottom-5 right-5 z-[100] space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="p-4 rounded-xl bg-zinc-900 border border-amber-400/30 text-white shadow-2xl flex items-center justify-between space-x-3 pointer-events-auto animate-slide-in duration-300"
          >
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-zinc-400 hover:text-white text-xs font-extrabold focus:outline-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab('blog'); setBlogCategory('All'); }}>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/10">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-widest text-amber-400 block font-serif">KASHI'S STYLES</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 block -mt-1 font-semibold">Elite Couture & Editorial</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 font-semibold text-xs tracking-wider uppercase">
              <button 
                onClick={() => { setActiveTab('blog'); setIsMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'blog' 
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/10' 
                    : 'text-zinc-300 hover:text-amber-400 hover:bg-zinc-900'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>The Editorial Feed</span>
              </button>
              
              <button 
                onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }}
                className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1.5 ${
                  activeTab === 'shop' 
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/10' 
                    : 'text-zinc-300 hover:text-amber-400 hover:bg-zinc-900'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Boutique Shop</span>
              </button>
            </nav>

            {/* Action Bar (Search, Write Blog, Cart, Profile) */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Dynamic Write Post trigger */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-amber-400 flex items-center space-x-1.5 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Write Editorial</span>
              </button>

              {/* Shopping Cart button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-all group"
                aria-label="Open Cart"
              >
                <ShoppingBag className="h-4 w-4 text-zinc-300 group-hover:text-amber-400 transition-colors" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* User Identity Panel */}
              <div className="flex items-center space-x-2 pl-3 border-l border-zinc-800">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border border-amber-400/30"
                />
                <div className="text-left leading-none">
                  <p className="text-xs font-bold text-zinc-200">{user.name}</p>
                  <p className="text-[9px] text-amber-400/80 mt-0.5 truncate max-w-[120px]">{user.persona}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex md:hidden items-center space-x-3">
              {/* Mini Cart */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                <ShoppingBag className="h-4 w-4 text-amber-400" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-6 bg-zinc-950 border-t border-zinc-900 space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/60">
              <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user.persona}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-400">
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setActiveTab('blog'); setIsMobileMenuOpen(false); }}
                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center border ${
                  activeTab === 'blog' ? 'bg-amber-400 text-black border-amber-400' : 'bg-transparent text-white border-zinc-800'
                }`}
              >
                📖 Blog Feed
              </button>
              <button
                onClick={() => { setActiveTab('shop'); setIsMobileMenuOpen(false); }}
                className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center border ${
                  activeTab === 'shop' ? 'bg-amber-400 text-black border-amber-400' : 'bg-transparent text-white border-zinc-800'
                }`}
              >
                🛍️ Boutique Shop
              </button>
            </div>

            <button
              onClick={() => { setIsCreateModalOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Write Style Editorial</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Page Layout Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Dynamic High Fashion Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 min-h-[380px] flex items-center">
          {/* Cover background with luxury low-key dark aesthetic */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600" 
              alt="Kashi Couture Editorial Backdrop" 
              className="w-full h-full object-cover opacity-35 filter grayscale scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>

          <div className="relative z-10 px-6 sm:px-12 md:px-16 max-w-2xl py-12 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full text-amber-400 text-[10px] uppercase font-bold tracking-widest">
              <Sparkles className="h-3 w-3" />
              <span>EXCLUSIVE ATELIER JOURNAL</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Where Style is <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500">Uniquely Authored</span>, Not Copied.
            </h1>
            
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              Explore meticulously written design guides, behind-the-seams production journals, and match them with real-world, hand-made garments tailored for high-impact presence.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('blog')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:from-amber-400 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/10"
              >
                Read Autumn Chronicles
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Shop the Catalog
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Global Search and Category Bar */}
        <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tab Subtitle */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-extrabold mb-1">
              Currently Browsing:
            </h3>
            <span className="text-xl font-bold text-white flex items-center gap-2">
              {activeTab === 'blog' ? '📖 The Editorial Feed' : '🛍️ The Curated Boutique'}
              <span className="text-xs font-normal text-amber-400 bg-amber-400/5 border border-amber-400/10 px-2 py-0.5 rounded-full">
                {activeTab === 'blog' ? filteredPosts.length : filteredProducts.length} Items Available
              </span>
            </span>
          </div>

          {/* Real-time search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-500" />
            </div>
            <input 
              type="text" 
              placeholder={activeTab === 'blog' ? "Search editorial tags, titles, authors..." : "Search premium garments, colors, fit..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

        </div>

        {/* TAB CONTENT: 1. THE EDITORIAL FEED (BLOG) */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-900 pb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-extrabold mr-2">Filters:</span>
              {['All', 'Styling Tips', 'Trends', 'Collection Launches', 'Behind The Scenes'].map((cat) => {
                const isSelected = blogCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setBlogCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isSelected 
                        ? 'bg-amber-400 text-black font-extrabold' 
                        : 'bg-zinc-900/60 hover:bg-zinc-900 hover:text-white text-zinc-400'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="p-16 text-center bg-zinc-900/20 rounded-2xl border border-zinc-900">
                <BookOpen className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
                <p className="font-bold text-zinc-400">No matching editorials found</p>
                <p className="text-xs text-zinc-600 mt-1">Try refining your search keyword or selecting "All" categories.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setBlogCategory('All'); }}
                  className="mt-4 px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400 hover:bg-zinc-800 rounded-lg"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-zinc-900/40 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:shadow-amber-500/[0.01]"
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 bg-zinc-950/90 text-amber-400 text-[10px] font-extrabold tracking-widest uppercase border border-amber-400/20 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="p-6 pb-0 space-y-3">
                      <div className="flex items-center space-x-3 text-xs text-zinc-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{post.date}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer (Author, likes, comment counts) */}
                  <div className="p-6 pt-4 border-t border-zinc-900/80 mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="h-7 w-7 rounded-full object-cover border border-zinc-800"
                      />
                      <div className="text-left leading-none">
                        <p className="text-[10px] font-bold text-zinc-300">{post.author.name}</p>
                        <p className="text-[8px] text-zinc-500">{post.author.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5 text-xs text-zinc-400">
                      <button 
                        onClick={(e) => handleLikePost(post.id, e)}
                        className="flex items-center space-x-1 hover:text-amber-400 transition-colors"
                        title="Like Article"
                      >
                        <Heart className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{post.likes}</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="font-semibold">{post.comments.length}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

        {/* TAB CONTENT: 2. BOUTIQUE COUTURE SHOP */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-900 pb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-extrabold mr-2">Collections:</span>
              {['All', 'Urban Streetwear', 'Traditional Elegance', 'Luxe Evening', 'Casual Chic', 'Dresses', 'Track Suits'].map((cat) => {
                const isSelected = shopCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setShopCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                      isSelected 
                        ? 'bg-amber-400 text-black font-extrabold' 
                        : 'bg-zinc-900/60 hover:bg-zinc-900 hover:text-white text-zinc-400'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="p-16 text-center bg-zinc-900/20 rounded-2xl border border-zinc-900">
                <ShoppingBag className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
                <p className="font-bold text-zinc-400">No garments found in this category</p>
                <p className="text-xs text-zinc-600 mt-1">Try resetting your filters or search term.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setShopCategory('All'); }}
                  className="mt-4 px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-wider text-amber-400 hover:bg-zinc-800 rounded-lg"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const selectedSize = selectedSizes[product.id] || product.sizes[0];
                return (
                  <div 
                    key={product.id}
                    className="bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-500/[0.01]"
                  >
                    <div>
                      {/* Product image */}
                      <div className="relative h-72 overflow-hidden bg-zinc-950">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-4 left-4 bg-zinc-950/90 text-zinc-300 text-[9px] uppercase tracking-widest font-extrabold border border-zinc-800 px-2.5 py-1 rounded-full">
                          {product.category}
                        </span>

                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-red-400 border border-red-500/30 px-4 py-2 rounded bg-black/40">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info & Sizing */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-extrabold text-white">${product.price.toFixed(2)}</span>
                          <div className="flex items-center space-x-1 text-xs text-amber-400">
                            <Star className="h-3 w-3 fill-amber-400" />
                            <span className="font-bold">{product.rating}</span>
                            <span className="text-[10px] text-zinc-500 font-normal">({product.reviewsCount})</span>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
                          {product.name}
                        </h4>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Size selector buttons */}
                        {product.inStock && (
                          <div className="space-y-1.5 pt-2">
                            <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold">Select Tailored Size:</p>
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((size) => {
                                const isChosen = selectedSize === size;
                                return (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                                    className={`h-6 min-w-6 text-[10px] font-bold rounded flex items-center justify-center transition-all border ${
                                      isChosen 
                                        ? 'bg-amber-400 border-amber-400 text-black font-extrabold shadow-sm' 
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                                    }`}
                                  >
                                    {size}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Footer Button */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleAddToCart(product, selectedSize)}
                        disabled={!product.inStock}
                        className={`w-full py-2.5 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                          product.inStock 
                            ? 'bg-zinc-900 hover:bg-amber-400 hover:text-black border border-zinc-800 hover:border-amber-400 text-amber-400' 
                            : 'bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>{product.inStock ? 'Acquire Garment' : 'Currently Unavailable'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* 5 MORE LUXURY INTERACTIVE SECTIONS (Heritage, Concierge, Lookbooks, Loyalty Milestones, Style Quiz) */}
        <div className="border-t border-zinc-900 pt-12">
          <ExtraSections 
            products={products}
            onAddToCart={handleAddToCart}
            user={user}
            addNotification={addNotification}
          />
        </div>

      </main>

      {/* IMMERSIVE BLOG READER DETAIL MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:py-12 flex justify-center items-start">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
            onClick={() => setSelectedPost(null)} 
          />

          <div className="relative bg-zinc-950 text-white border border-zinc-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[85vh]">
            
            {/* Header image with close button overlay */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full shrink-0">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                aria-label="Close reader"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Floating tags */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="inline-block px-3 py-1 bg-amber-400 text-black text-xs font-extrabold tracking-widest uppercase rounded-full">
                  {selectedPost.category}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
                  {selectedPost.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Content Pane */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
              
              {/* Author & Stats bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900/40 rounded-2xl border border-zinc-900">
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedPost.author.avatar} 
                    alt={selectedPost.author.name} 
                    className="h-10 w-10 rounded-full object-cover border border-amber-400/20"
                  />
                  <div>
                    <p className="text-sm font-bold text-zinc-100">{selectedPost.author.name}</p>
                    <p className="text-xs text-zinc-400">{selectedPost.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-zinc-400 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{selectedPost.readTime}</span>
                  </div>
                  <button 
                    onClick={() => handleLikePost(selectedPost.id)}
                    className="flex items-center space-x-1.5 hover:text-amber-400 text-amber-400 transition-colors"
                  >
                    <Heart className="h-3.5 w-3.5 fill-amber-400" />
                    <span className="font-bold">{selectedPost.likes}</span>
                  </button>
                </div>
              </div>

              {/* Markdown content parser representation */}
              <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
                {selectedPost.content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h4 key={i} className="text-base font-extrabold text-amber-400 tracking-wide uppercase pt-4">
                        {paragraph.replace('###', '').trim()}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('##')) {
                    return (
                      <h3 key={i} className="text-lg font-black text-amber-400 tracking-wide uppercase pt-6">
                        {paragraph.replace('##', '').trim()}
                      </h3>
                    );
                  }
                  return (
                    <p key={i} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Editorial Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4">
                {selectedPost.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-[10px] uppercase font-semibold text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-850"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Connected Section: Shop the Look */}
              {selectedPost.relatedProducts && selectedPost.relatedProducts.length > 0 && (
                <div className="pt-8 border-t border-zinc-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Shop the Look</h3>
                      <p className="text-[10px] text-zinc-400">Add garments inspired by this editorial directly to your cart.</p>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-400 uppercase bg-amber-400/5 px-2 py-0.5 rounded border border-amber-400/10">Curated Pairing</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedPost.relatedProducts.map((prodId) => {
                      const prod = products.find((p) => p.id === prodId);
                      if (!prod) return null;
                      return (
                        <div 
                          key={prod.id}
                          className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <img src={prod.image} alt={prod.name} className="h-12 w-10 object-cover rounded bg-zinc-950" />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[11px] font-bold text-zinc-200 truncate">{prod.name}</h4>
                              <p className="text-[10px] text-amber-400 font-extrabold">${prod.price.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleAddToCart(prod, null)}
                            disabled={!prod.inStock}
                            className="w-full mt-3 py-1.5 bg-zinc-950 hover:bg-amber-400 hover:text-black border border-zinc-800 hover:border-amber-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                          >
                            {prod.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interactive Comments Board */}
              <div className="pt-8 border-t border-zinc-900 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Atelier Comments ({selectedPost.comments.length})
                </h3>

                {/* Comment Input */}
                <CommentInputForm onSubmitComment={(contentStr) => handleAddComment(selectedPost.id, contentStr)} />

                {/* Comment List */}
                <div className="space-y-4 pt-2">
                  {selectedPost.comments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">No comments published yet. Be the first to express your thoughts!</p>
                  ) : (
                    selectedPost.comments.map((comm) => (
                      <div 
                        key={comm.id} 
                        className="p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-900/80 flex items-start space-x-3"
                      >
                        <img 
                          src={comm.avatar} 
                          alt={comm.author} 
                          className="h-8 w-8 rounded-full object-cover border border-zinc-800 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-zinc-200">{comm.author}</span>
                            <span className="text-[9px] text-zinc-500">{comm.date}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">{comm.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CART DRAWER SIDEBAR */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        addNotification={addNotification}
      />

      {/* CREATE NEW POST MODAL */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        author={{
          name: user.name,
          role: user.persona,
          avatar: user.avatar
        }}
        addNotification={addNotification}
      />

      {/* Footer Branding */}
      <footer className="border-t border-zinc-900 bg-zinc-950 mt-16 py-14 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md shadow-amber-500/10">
                  <Sparkles className="h-4 w-4 text-black" />
                </div>
                <div>
                  <span className="text-sm font-black tracking-widest text-amber-400 block font-serif">KASHI'S STYLES</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 block -mt-0.5">Elite Couture & Editorial</span>
                </div>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Where raw streetwear meets royal heritage. Handcrafted garments, editorial storytelling, and a community of style-forward individuals.
              </p>
              {/* Social Links */}
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-extrabold">Follow the Atelier</p>
                <div className="flex items-center gap-3">
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/kashistyles"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-all group"
                  >
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a
                    href="https://tiktok.com/@kashistyles"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-all group"
                  >
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                    </svg>
                  </a>
                  {/* Pinterest */}
                  <a
                    href="https://pinterest.com/kashistyles"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Pinterest"
                    className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-all group"
                  >
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@kashistyles"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-all group"
                  >
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href="https://facebook.com/kashistyles"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-400 hover:bg-amber-400/10 flex items-center justify-center transition-all group"
                  >
                    <svg className="h-4 w-4 text-zinc-400 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Dresses Category Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-amber-400 font-extrabold mb-1">Shop by Category</p>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Dresses</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  { label: 'Midi Dresses', desc: 'Knee-to-calf length elegance' },
                  { label: 'Maxi Dresses', desc: 'Floor-length statement pieces' },
                  { label: 'Wrap Dresses', desc: 'Flattering adjustable silhouettes' },
                  { label: 'Bodycon Dresses', desc: 'Form-fitting evening styles' },
                  { label: 'Shirt Dresses', desc: 'Casual everyday chic' },
                  { label: 'Lace & Embroidered', desc: 'Intricate artisan detailing' },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => { setActiveTab('shop'); setShopCategory('Dresses'); }}
                      className="text-left group"
                    >
                      <span className="text-zinc-300 group-hover:text-amber-400 transition-colors font-semibold text-[11px] block">{item.label}</span>
                      <span className="text-zinc-600 text-[10px]">{item.desc}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Track Suits Category Column */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-amber-400 font-extrabold mb-1">Shop by Category</p>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Track Suits</h4>
              </div>
              <ul className="space-y-2.5">
                {[
                  { label: 'Velour Track Suits', desc: 'Plush premium velour sets' },
                  { label: 'Tech Performance', desc: 'Moisture-wicking activewear' },
                  { label: 'Ribbed Lounge Sets', desc: 'Soft cotton comfort wear' },
                  { label: 'Retro Athletic', desc: 'Heritage-inspired stripe sets' },
                  { label: 'Satin Luxury Sets', desc: 'Elevated evening loungewear' },
                  { label: 'Oversized Hoodies', desc: 'Relaxed streetwear staples' },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => { setActiveTab('shop'); setShopCategory('Track Suits'); }}
                      className="text-left group"
                    >
                      <span className="text-zinc-300 group-hover:text-amber-400 transition-colors font-semibold text-[11px] block">{item.label}</span>
                      <span className="text-zinc-600 text-[10px]">{item.desc}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Quick Links Column */}
            <div className="space-y-5">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-amber-400 font-extrabold mb-1">Stay Connected</p>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Atelier Newsletter</h4>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Get exclusive early access to new drops, editorial features, and member-only promo codes.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-extrabold">Quick Links</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    'About the Atelier', 'Sustainability', 'Size Guide', 'Shipping Info',
                    'Returns Policy', 'Atelier Support', 'Privacy Policy', 'Terms of Service'
                  ].map((link) => (
                    <a key={link} href="#" className="text-zinc-500 hover:text-amber-400 transition-colors text-[10px]">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-[10px]">© 2026 Kashi's Styles Atelier. All premium rights reserved.</p>
            <div className="flex items-center gap-4 text-[10px]">
              <a href="#privacy" className="hover:text-amber-400 transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-amber-400 transition-colors">Terms</a>
              <a href="#support" className="hover:text-amber-400 transition-colors">Atelier Support</a>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-600">Designed for absolute premium self-expression.</span>
            </div>
          </div>

        </div>
      </footer>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
              <span className="text-sm font-bold tracking-widest text-amber-400 font-serif">KASHI'S STYLES</span>
            </div>
            <p className="leading-relaxed text-zinc-400">
              Crafting a beautiful bridge between streetwear utility and classic South Asian silk craft since 2026.
            </p>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-3">Shop Curations</h5>
            <ul className="space-y-2">
              <li><button onClick={() => { setActiveTab('shop'); setShopCategory('Urban Streetwear'); }} className="hover:text-amber-400 transition-colors">Urban Streetwear</button></li>
              <li><button onClick={() => { setActiveTab('shop'); setShopCategory('Traditional Elegance'); }} className="hover:text-amber-400 transition-colors">Traditional Elegance</button></li>
              <li><button onClick={() => { setActiveTab('shop'); setShopCategory('Luxe Evening'); }} className="hover:text-amber-400 transition-colors">Luxe Evening</button></li>
              <li><button onClick={() => { setActiveTab('shop'); setShopCategory('Casual Chic'); }} className="hover:text-amber-400 transition-colors">Casual Chic</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-3">Atelier Editorial</h5>
            <ul className="space-y-2">
              <li><button onClick={() => { setActiveTab('blog'); setBlogCategory('Styling Tips'); }} className="hover:text-amber-400 transition-colors">Styling Tips</button></li>
              <li><button onClick={() => { setActiveTab('blog'); setBlogCategory('Trends'); }} className="hover:text-amber-400 transition-colors">Trends</button></li>
              <li><button onClick={() => { setActiveTab('blog'); setBlogCategory('Collection Launches'); }} className="hover:text-amber-400 transition-colors">Collection Launches</button></li>
              <li><button onClick={() => { setActiveTab('blog'); setBlogCategory('Behind The Scenes'); }} className="hover:text-amber-400 transition-colors">Behind The Scenes</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold uppercase tracking-wider text-white">Join the Newsletter</h5>
            <p className="text-zinc-400 leading-relaxed">Get 10% off your next handmade couture purchase.</p>
            <form onSubmit={(e) => { e.preventDefault(); addNotification('✨ Thank you for subscribing to Kashi’s newsletter!'); }} className="flex space-x-1">
              <input 
                type="email" 
                required
                placeholder="your.email@domain.com"
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs w-full text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button 
                type="submit"
                className="px-3 bg-amber-400 text-black rounded-lg text-xs font-bold uppercase hover:bg-amber-300 transition-colors"
              >
                Join
              </button>
            </form>
          </div>

        </div>

      </footer>

    </div>
  );
}

// Inner Helper Component: Comment Input Form
interface CommentInputFormProps {
  onSubmitComment: (content: string) => void;
}

function CommentInputForm({ onSubmitComment }: CommentInputFormProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSubmitComment(commentText);
    setCommentText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Write a respectful, fashion-forward comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center space-x-1"
      >
        <Send className="h-3 w-3" />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
}
