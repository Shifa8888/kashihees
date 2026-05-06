import React, { useState } from 'react';
import { X, Edit3, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { BlogPost } from '../data/fashionData';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPost: Omit<BlogPost, 'id' | 'likes' | 'comments'>) => void;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  addNotification: (message: string) => void;
}

const PRESET_COVERS = [
  { id: 'c1', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', label: 'Neon Chic' },
  { id: 'c2', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800', label: 'Coastal Linen' },
  { id: 'c3', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800', label: 'Boutique Storefront' },
  { id: 'c4', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800', label: 'Minimal Wardrobe' }
];

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  author,
  addNotification
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Styling Tips');
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0].url);
  const [customCover, setCustomCover] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      addNotification('Please fill in all required fashion editorial fields.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const finalImage = customCover.trim() || selectedCover;

    onSubmit({
      title,
      excerpt,
      content,
      category,
      image: finalImage,
      author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime,
      relatedProducts: ['prod-1', 'prod-2'], // default related premium links
      tags: tags.length > 0 ? tags : ['New Drop', "Kashi's Styles", 'Trending']
    });

    addNotification(`"${title}" published successfully to Kashi's Style Editorial!`);
    onClose();

    // Reset fields
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('Styling Tips');
    setSelectedCover(PRESET_COVERS[0].url);
    setCustomCover('');
    setReadTime('5 min read');
    setTagsInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-zinc-950 text-white border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-zinc-950 z-10 px-6 py-4 border-b border-zinc-900 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-extrabold uppercase tracking-widest text-zinc-100">
              Publish Style Editorial
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Author Badge indicator */}
          <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 flex items-center space-x-3">
            <img 
              src={author.avatar} 
              alt={author.name} 
              className="h-9 w-9 rounded-full object-cover border border-amber-400/20"
            />
            <div>
              <p className="text-xs font-bold text-zinc-200">Writing as: <span className="text-amber-400 font-serif italic">{author.name}</span></p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{author.role || 'Fashion Stylist'}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Article Title *
            </label>
            <input 
              type="text"
              required
              placeholder="e.g., The Art of Monochromatic Denim in 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>

          {/* Grid of Category and Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                Editorial Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Styling Tips">Styling Tips</option>
                <option value="Trends">Trends</option>
                <option value="Collection Launches">Collection Launches</option>
                <option value="Behind The Scenes">Behind The Scenes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
                Estimated Read Time
              </label>
              <input 
                type="text"
                placeholder="e.g., 4 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Short Excerpt */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Short Description / Excerpt *
            </label>
            <input 
              type="text"
              required
              placeholder="Brief summary that grabs attention in the blog feed..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Article Content (Supports spacing and structure) *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Write your beautiful styling secrets or collection launch gossip here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 resize-none font-mono"
            />
          </div>

          {/* Preset Cover Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2 flex items-center justify-between">
              <span>Choose Editorial Cover</span>
              <span className="text-[10px] text-amber-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> High resolution pre-sets
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COVERS.map((cov) => {
                const isSelected = selectedCover === cov.url && !customCover;
                return (
                  <button
                    key={cov.id}
                    type="button"
                    onClick={() => {
                      setSelectedCover(cov.url);
                      setCustomCover('');
                    }}
                    className={`relative rounded-lg overflow-hidden h-14 border transition-all ${
                      isSelected ? 'border-amber-400 scale-[1.03] ring-2 ring-amber-400/20' : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <img src={cov.url} alt={cov.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[9px] text-zinc-200 font-bold tracking-tight truncate px-1">{cov.label}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-amber-400 p-0.5 rounded-full">
                        <Check className="h-2.5 w-2.5 text-black" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Cover Input */}
            <div className="mt-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ImageIcon className="h-4 w-4 text-zinc-500" />
              </div>
              <input 
                type="url"
                placeholder="Or paste custom image link (Unsplash, etc.)"
                value={customCover}
                onChange={(e) => {
                  setCustomCover(e.target.value);
                }}
                className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1.5">
              Fashion Tags (Separated by commas)
            </label>
            <input 
              type="text"
              placeholder="denim, spring collection, retro vibes"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-900 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-amber-500/10"
            >
              Publish Editorial
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
