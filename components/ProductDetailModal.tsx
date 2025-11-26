import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, CheckCircle } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, observation?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setObservation('');
      setIsAnimating(true);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    // Pass undefined if string is empty to keep data clean
    const finalObs = observation.trim() === '' ? undefined : observation.trim();
    onAddToCart(product, quantity, finalObs);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div 
        className={`
          w-full max-w-lg bg-brand-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative flex flex-col max-h-[90vh]
          ${isAnimating ? 'animate-scale-in' : ''}
        `}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-brand-orange transition-colors backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="h-56 sm:h-64 md:h-72 relative shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card to-transparent opacity-90"></div>
        </div>

        {/* Content Section - Scrollable */}
        <div className="p-6 -mt-12 relative flex-grow overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-white mb-2 leading-tight">
              {product.name}
            </h2>
            <div className="h-1 w-12 bg-brand-orange rounded-full mb-4"></div>
            
            <h3 className="text-sm font-bold text-brand-orange mb-2 uppercase tracking-wider">Ingredientes & Detalhes</h3>
            <p className="text-brand-gray text-sm md:text-base leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {product.description}
            </p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold text-brand-white mb-2 block">Alguma observação?</label>
            <textarea 
              placeholder="Ex: Tirar a cebola, maionese à parte..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full bg-brand-black border border-white/10 rounded-xl p-3 text-white text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none resize-none h-20 placeholder-gray-600"
            />
          </div>
        </div>

        {/* Footer Actions - Fixed at bottom */}
        <div className="p-4 bg-brand-black border-t border-white/10 shrink-0">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Quantity Control */}
            <div className="flex items-center gap-4 bg-brand-card px-4 py-2 rounded-xl border border-white/5">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`p-1 rounded-md transition-colors ${quantity === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:text-brand-orange'}`}
                disabled={quantity === 1}
              >
                <Minus size={20} />
              </button>
              <span className="text-lg font-bold text-white w-6 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-white hover:text-brand-orange transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Add Button */}
            <button 
              onClick={handleConfirm}
              className="w-full sm:w-auto flex-grow bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>ADICIONAR</span>
              <span className="bg-black/20 px-2 py-0.5 rounded text-sm">
                R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};