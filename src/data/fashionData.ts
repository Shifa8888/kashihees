export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Urban Streetwear' | 'Traditional Elegance' | 'Luxe Evening' | 'Casual Chic';
  image: string;
  description: string;
  sizes: string[];
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Styling Tips' | 'Trends' | 'Collection Launches' | 'Behind The Scenes';
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  likes: number;
  comments: Comment[];
  relatedProducts: string[]; // Product IDs linked for "Shop the Look"
  tags: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Midnight Velvet Blazer Outfit',
    price: 189.99,
    category: 'Luxe Evening',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    description: 'A luxurious midnight blue velvet blazer tailored to perfection. Offers a sharp profile with premium silk lapels and classic double-vented structure.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 124,
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Saffron Silk Fusion Kurta',
    price: 135.00,
    category: 'Traditional Elegance',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Beautiful hand-woven silk fusion kurta featuring intricate Zardozi collar details. Combines traditional South Asian heritage with contemporary cuts.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    inStock: true,
    rating: 4.8,
    reviewsCount: 98,
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Neo-Tokyo Oversized Bomber',
    price: 110.00,
    category: 'Urban Streetwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    description: 'Water-resistant nylon shell bomber jacket with drop shoulders, utility sleeves, and bold custom typography print on the back.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 4.7,
    reviewsCount: 215,
    featured: true
  },
  {
    id: 'prod-4',
    name: 'Sandstone Ribbed Knit Set',
    price: 85.50,
    category: 'Casual Chic',
    image: 'https://images.unsplash.com/photo-1574164904299-3a102b110380?auto=format&fit=crop&q=80&w=800',
    description: 'An ultra-comfortable lounge knit set with cropped crewneck sweater and high-waisted ribbed pants. Perfect for chic weekend brunches.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    rating: 4.6,
    reviewsCount: 84
  },
  {
    id: 'prod-5',
    name: 'Emerald Blossom Wrap Dress',
    price: 145.00,
    category: 'Casual Chic',
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=800',
    description: 'Chiffon floral wrap dress with a romantic V-neckline, flutter sleeves, and asymmetrical ruffle hem. Elegant movement with every stride.',
    sizes: ['S', 'M', 'L'],
    inStock: true,
    rating: 4.9,
    reviewsCount: 47
  },
  {
    id: 'prod-6',
    name: 'Onyx Utility Cargo Pants',
    price: 95.00,
    category: 'Urban Streetwear',
    image: 'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&q=80&w=800',
    description: 'Heavyweight cotton-twill cargo pants featuring modular 3D pockets, adjustable ankle straps, and matte black hardware closures.',
    sizes: ['28', '30', '32', '34', '36'],
    inStock: true,
    rating: 4.5,
    reviewsCount: 162
  },
  {
    id: 'prod-7',
    name: 'Ivory Royal Anarkali Gown',
    price: 240.00,
    category: 'Traditional Elegance',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    description: 'Stunning 16-kali flared floor-length gown in pristine georgette fabric. Adorned with delicate gold gota-patti and thread embroidery.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 56,
    featured: true
  },
  {
    id: 'prod-8',
    name: 'Crimson Satin Slip Dress',
    price: 120.00,
    category: 'Luxe Evening',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=800',
    description: 'Seductive cowl neck bias-cut satin midi dress. Features delicate adjustable spaghetti straps and a low-cut cross-back design.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: false,
    rating: 4.8,
    reviewsCount: 39
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Ways to Style Fusion Wear for the Modern Festive Season',
    excerpt: 'Combining traditional Indian aesthetics with sleek western silhouettes is the ultimate power move this season. Here is Kashi’s definitive guide to nail fusion wear effortlessly.',
    content: `Fashion is a canvas of self-expression, and there is no better way to demonstrate your creativity than with Fusion Wear. 

At Kashi's Styles, we have witnessed a massive shift towards hybrid ensembles. Modern trendsetters no longer want to choose between the sublime grace of traditional attire and the crisp, comfortable utility of western cuts. They want both.

### 1. The Kurtis-with-Cargo Revolution
Take a hand-embroidered Saffron Silk Fusion Kurta and pair it with utility cargo pants in charcoal or onyx. This contrasts structural utility with flowing, elegant fabrics. Finish the look with chunky white sneakers and oxidized silver jewelry for a balanced urban ethnic aesthetic.

### 2. Blazers Over Anarkali Gowns
Do you have an upcoming cocktail party or high-end dinner? Throw a tailored velvet blazer over a flared ivory gown. It adds structure to the waistline while keeping you cozy and looking incredibly authoritative.

### 3. Styled Comfort is Key
Always prioritize fabrics that breathe. Premium silks and heavy-weight cotton blends allow your attire to fall naturally, creating a stunning silhouette that moves with you rather than restricting you.`,
    category: 'Styling Tips',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Kashi Malhotra',
      role: 'Creative Director & Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    date: 'Oct 14, 2026',
    readTime: '4 min read',
    likes: 342,
    comments: [
      {
        id: 'c1',
        author: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        content: 'I tried pairing my Kashi Silk Kurta with wide-leg utility trousers yesterday and received so many compliments! Absolutely love this fusion styling guide.',
        date: 'Oct 15, 2026'
      },
      {
        id: 'c2',
        author: 'Rohan Sharma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        content: 'The tips on layering structural blazers over ethnic gowns is pure gold. Doing this for my sisters wedding reception!',
        date: 'Oct 16, 2026'
      }
    ],
    relatedProducts: ['prod-2', 'prod-7', 'prod-1'],
    tags: ['Fusion Wear', 'Festive Styling', 'Kashi Lookbook', 'Modern Ethnic']
  },
  {
    id: 'blog-2',
    title: 'The Streetwear Renaissance: From Underground Subculture to Luxury Runway',
    excerpt: 'Streetwear has officially claimed its crown in high fashion. Discover how oversize silhouettes and technical fabrics are shaping the wardrobe of 2026.',
    content: `Streetwear is no longer just a casual style—it is a lifestyle statement that has conquered global runways from Milan to Tokyo. 

At Kashi's Styles, our Urban Streetwear collection is designed for individuals who demand both supreme comfort and high-impact aesthetics. The key is playing with proportions, textures, and unexpected pairings.

### Mastering the Oversized Look
The secret to wearing oversized clothing without looking messy is balance. If you wear an oversized bomber jacket, keep the bottom half more structured, or vice versa. Pair a relaxed-fit heavy graphic tee with cropped, clean trousers.

### Technical Fabrics are the Future
We are seeing a major influx of waterproof ripstop nylons, matte-finished hardware, and modular pocket arrangements. These fabrics look ultra-modern and withstand the hustle and bustle of city life.`,
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Elena Rostova',
      role: 'Head of Streetwear Design',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    },
    date: 'Sep 28, 2026',
    readTime: '6 min read',
    likes: 215,
    comments: [
      {
        id: 'c3',
        author: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        content: 'That Neo-Tokyo Bomber is literally the best jacket in my wardrobe. Premium quality, heavy duty, and the print gets stares everywhere I walk.',
        date: 'Sep 29, 2026'
      }
    ],
    relatedProducts: ['prod-3', 'prod-6'],
    tags: ['Streetwear', 'High Fashion', 'Techwear', 'Urban Essentials']
  },
  {
    id: 'blog-3',
    title: 'Behind the Seams: Crafting the Luxe Midnight Velvet Blazer',
    excerpt: 'Go behind the scenes of our atelier to see how we source, cut, and hand-tailor Kashi’s bestselling luxury evening blazer.',
    content: `Every great piece of clothing tells a story. Today, we are opening the doors of our design atelier to show you the meticulous craftsmanship that goes into creating Kashi's signature Midnight Velvet Blazer.

### Sourcing Royal Velvet
Our search took us through seven textile mills before we found the perfect weight: a high-density, cotton-blend velvet that possesses a rich, deep luster under dim lighting without feeling heavy or warm.

### The Art of Hand-Tailoring
Unlike mass-produced suits, our blazers are crafted in small batches. Each lapel is padded by hand to ensure a crisp roll that never sags. The interior features a bespoke jacquard lining depicting the signature Kashi imperial monogram.

### Versatility Reimagined
While traditionally paired with matching trousers for formal galas, we recommend trying it with premium indigo jeans and leather Chelsea boots for a ruggedly handsome look that screams confident sophistication.`,
    category: 'Behind The Scenes',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Kashi Malhotra',
      role: 'Creative Director & Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    date: 'Sep 15, 2026',
    readTime: '5 min read',
    likes: 412,
    comments: [
      {
        id: 'c4',
        author: 'Diana Prince',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        content: 'The attention to detail is mind-blowing. Sourcing of the fabric really shows when you touch the jacket. Feels absolutely divine!',
        date: 'Sep 16, 2026'
      }
    ],
    relatedProducts: ['prod-1', 'prod-8'],
    tags: ['Atelier', 'Tailoring', 'Behind The Scenes', 'Luxury Fabric']
  }
];
