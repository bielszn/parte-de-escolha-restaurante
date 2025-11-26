import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-brand-card rounded-xl overflow-hidden flex flex-col h-full border border-white/5 shadow-lg hover:border-brand-orange/50 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
    >
      {/* 1. A Foto */}
      <div className="h-32 md:h-48 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-card to-transparent opacity-80"></div>
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-grow relative">
        {/* 2. O Título */}
        <h3 className="text-base md:text-lg font-bold text-brand-white leading-tight mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>
        
        {/* 3. A Descrição (Cinza Claro) */}
        <p className="text-xs md:text-sm text-brand-gray mb-4 line-clamp-3 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Footer: Price + Button */}
        <div className="mt-auto pt-3 border-t border-white/5 flex flex-col gap-2">
           {/* 4. O Preço (Laranja Destaque) */}
          <div className="text-brand-orange font-bold text-lg md:text-xl">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>

          {/* 5. O Botão (Agora abre o modal) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent double trigger if parent has onclick
              onClick(product);
            }}
            className="w-full py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95 shadow-md bg-brand-orange text-white hover:bg-orange-600"
          >
            <Plus size={16} className="text-white" />
            <span>ADICIONAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};