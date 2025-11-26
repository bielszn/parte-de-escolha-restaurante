export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem extends Product {
  cartId: string; // Unique ID for the cart entry (handling same product with different obs)
  quantity: number;
  observation?: string;
}

export interface Address {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero?: string;
  complemento?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}