import React, { useState, useEffect } from 'react';
import { X, Trash2, MapPin, ShoppingBag, User } from 'lucide-react';
import { CartItem, Address } from '../types';
import { fetchAddressByCep } from '../services/cepService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onUpdateQuantity 
}) => {
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<Address | null>(null);
  const [addressNumber, setAddressNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Format CEP while typing
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setCep(value);
  };

  // Auto-fetch address when CEP is complete
  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      fetchAddressByCep(cleanCep).then((addr) => {
        setAddress(addr);
        setIsLoadingCep(false);
      });
    } else {
      setAddress(null);
    }
  }, [cep]);

  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert("Por favor, digite seu nome para continuarmos!");
      return;
    }

    if (!address || !addressNumber.trim()) {
      alert("Por favor, preencha o endereço e o número da casa.");
      return;
    }

    // 1. Items List (Using standard bullets)
    const itemsList = cart.map(item => 
      `▪️ ${item.quantity}x ${item.name}`
    ).join('\n');

    // 2. Observations Section (Strict formatting as requested)
    const itemsWithObs = cart.filter(item => item.observation && item.observation.trim() !== '');
    
    let obsSection = '';
    if (itemsWithObs.length > 0) {
      // Using standard text structure requested: "obs:\n item: ...\n-..."
      obsSection = '\n\n⚠️ *Observações:*\n' + itemsWithObs.map(item => 
        ` item: ${item.quantity}x ${item.name}\n - ${item.observation}`
      ).join('\n');
    }

    // 3. Address Construction
    const addressSection = 
      `📍 *Entrega:*\n` +
      `${address.logradouro}, ${addressNumber}\n` +
      `${address.bairro}\n` +
      `${address.localidade} - ${address.uf}\n` +
      `CEP: ${cep}`;

    // 4. Final Message Assembly with Universal Emojis
    const message = 
      `*NOVO PEDIDO - ROBERTO'S BURGERS* 🍔\n\n` +
      `👤 *Cliente:* ${customerName}\n\n` +
      `📋 *Itens:*\n${itemsList}` +
      `${obsSection}\n\n` +
      `💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}\n\n` +
      `${addressSection}`;

    const phoneNumber = "5511973534101";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-brand-black h-full shadow-2xl flex flex-col animate-slide-in border-l border-white/10">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-card text-brand-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-brand-orange" />
            Seu Pedido
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-brand-gray hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-brand-gray mt-10">
              <p>Seu carrinho está vazio.</p>
              <p className="text-sm mt-2 text-brand-orange font-semibold">Que tal um X-Bacon?</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-4 border-b border-white/5 pb-4 bg-brand-card p-3 rounded-lg">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-grow">
                  <h4 className="font-bold text-brand-white text-sm">{item.name}</h4>
                  
                  {/* Observation Display */}
                  {item.observation && (
                    <p className="text-xs text-brand-orange mt-1 italic border-l-2 border-brand-orange pl-2">
                      Obs: {item.observation}
                    </p>
                  )}

                  <div className="text-brand-orange font-bold text-sm mt-1">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.cartId, -1)}
                      className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center font-bold hover:bg-white/20 transition-colors"
                    >-</button>
                    <span className="text-sm font-medium text-white">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.cartId, 1)}
                      className="w-6 h-6 rounded bg-brand-orange text-white flex items-center justify-center font-bold hover:bg-orange-600 transition-colors"
                    >+</button>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(item.cartId)}
                  className="text-brand-gray hover:text-red-500 p-2 transition-colors self-start"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}

          {/* Checkout Section within Scroll */}
          {cart.length > 0 && (
            <div className="mt-8 bg-brand-card p-4 rounded-xl border border-white/5 space-y-4">
              
              {/* Name Input */}
              <div>
                <h3 className="font-bold text-brand-white mb-3 flex items-center gap-2">
                  <User size={18} className="text-brand-orange"/> 
                  Quem vai comer?
                </h3>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full p-3 bg-brand-black border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                />
              </div>

              {/* Address Section */}
              <div className="pt-4 border-t border-white/5">
                <h3 className="font-bold text-brand-white mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-brand-orange"/> 
                  Onde entregamos?
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-gray mb-1">CEP</label>
                    <input 
                      type="text" 
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      className="w-full p-2 bg-brand-black border border-white/10 rounded-lg text-white placeholder-gray-600 focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange transition-all"
                      maxLength={9}
                    />
                  </div>

                  {isLoadingCep && <p className="text-xs text-brand-orange animate-pulse">Buscando endereço...</p>}

                  {address && (
                    <div className="animate-fade-in space-y-2">
                      <input 
                        type="text" 
                        value={address.logradouro} 
                        disabled 
                        className="w-full p-2 bg-white/5 border border-white/5 rounded-lg text-brand-gray text-sm"
                      />
                      <div className="flex gap-2">
                         <input 
                          type="text" 
                          value={address.bairro} 
                          disabled 
                          className="w-1/2 p-2 bg-white/5 border border-white/5 rounded-lg text-brand-gray text-sm"
                        />
                         <input 
                          type="text" 
                          value={address.localidade} 
                          disabled 
                          className="w-1/2 p-2 bg-white/5 border border-white/5 rounded-lg text-brand-gray text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-gray mb-1">Número da Casa/Apto</label>
                        <input 
                          type="text" 
                          value={addressNumber}
                          onChange={(e) => setAddressNumber(e.target.value)}
                          placeholder="Ex: 123 - Apto 42"
                          className="w-full p-2 bg-brand-black border border-white/10 rounded-lg text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Totals */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-brand-black">
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-gray">Total</span>
              <span className="text-2xl font-bold text-brand-orange">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button 
              onClick={handleSendOrder}
              className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              ENVIAR PEDIDO NO ZAP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};