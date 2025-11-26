import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AiWaiter } from './components/AiWaiter';
import { ProductDetailModal } from './components/ProductDetailModal';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cart Logic
  const addToCart = (product: Product, quantity: number = 1, observation?: string) => {
    setCart(prev => {
      // Check if item exists with SAME ID and SAME OBSERVATION
      const existingIndex = prev.findIndex(item => 
        item.id === product.id && (item.observation || '') === (observation || '')
      );
      
      if (existingIndex >= 0) {
        // Update quantity of existing specific item configuration
        const newCart = [...prev];
        newCart[existingIndex] = {
           ...newCart[existingIndex], 
           quantity: newCart[existingIndex].quantity + quantity 
        };
        return newCart;
      }
      
      // Add new unique item to cart
      return [...prev, { 
        ...product, 
        quantity, 
        observation,
        cartId: `${product.id}-${Date.now()}-${Math.random()}` // Unique internal ID
      }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartId === cartId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Modal Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  const handleAddToCartFromModal = (product: Product, quantity: number, observation?: string) => {
    addToCart(product, quantity, observation);
    handleCloseModal();
  };

  // Scroll Logic
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const headerOffset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveCategory(id);
    }
  };

  // Observe scroll to update active category tab
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      
      for (const category of CATEGORIES) {
        const element = document.getElementById(category.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = top + window.scrollY;
          const absoluteBottom = bottom + window.scrollY;
          
          if (scrollPosition >= absoluteTop && scrollPosition < absoluteBottom) {
            setActiveCategory(category.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black pb-24 font-sans">
      {/* 0. Hero Banner (Visual Impact) */}
      <div className="relative h-48 md:h-64 w-full">
        <img 
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop" 
          alt="Banner Roberto's Burgers" 
          className="w-full h-full object-cover"
        />
        {/* Overlay using specific hex from palette with opacity */}
        <div className="absolute inset-0 bg-brand-overlay flex flex-col items-center justify-center text-center p-4">
          <h1 className="font-bold text-4xl md:text-5xl text-brand-white tracking-tight mb-2 drop-shadow-lg">Roberto's Burgers</h1>
          <div className="flex items-center gap-2 text-brand-yellow font-bold text-sm tracking-wider uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-brand-yellow/30">
            <Star size={14} fill="#F2A900" />
            <span>DESDE 2015</span>
            <Star size={14} fill="#F2A900" />
          </div>
        </div>
      </div>

      {/* 1. Header Sticky */}
      <header className="sticky top-0 z-30 bg-brand-black/95 backdrop-blur-md shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-3 flex justify-between items-center">
            <span className="font-bold text-lg text-brand-orange tracking-wide">CARDÁPIO</span>
            
            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-brand-card rounded-full hover:bg-brand-orange/20 transition-colors border border-white/10 group"
            >
              <ShoppingCart size={22} className="text-brand-white group-hover:text-brand-orange transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-brand-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-md">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Categories Navigation (Horizontal Scroll) */}
          <nav className="overflow-x-auto no-scrollbar py-3 px-4 bg-transparent border-t border-white/5">
            <div className="flex gap-3 min-w-max">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`
                    px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 border
                    ${activeCategory === cat.id 
                      ? 'bg-brand-orange border-brand-orange text-brand-white shadow-[0_0_15px_rgba(255,90,0,0.3)]' 
                      : 'bg-brand-card border-white/10 text-brand-gray hover:border-brand-orange/50 hover:text-white'}
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 pt-6">
        {CATEGORIES.map(category => {
          const categoryProducts = PRODUCTS.filter(p => p.categoryId === category.id);
          
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="mb-10 scroll-mt-48">
              <h2 className="text-2xl font-bold text-brand-white mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-brand-orange rounded-full block"></span>
                {category.name}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {categoryProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={handleProductClick} 
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Components */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />

      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCartFromModal}
      />

      <AiWaiter />
    </div>
  );
};

export default App;