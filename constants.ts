import { Category, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 'burgers', name: 'Hambúrgueres' },
  { id: 'drinks', name: 'Bebidas' },
  { id: 'sides', name: 'Porções' },
  { id: 'desserts', name: 'Sobremesas' },
];

export const PRODUCTS: Product[] = [
  // Burgers
  {
    id: 'b1',
    categoryId: 'burgers',
    name: 'X-Bacon do Beto',
    description: 'Pão brioche, burger 180g, queijo cheddar, muito bacon crocante e maionese da casa.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'b2',
    categoryId: 'burgers',
    name: 'X-Tudo Monstro',
    description: 'Pão, 2 carnes de 150g, ovo, bacon, calabresa, alface, tomate e cheddar cremoso.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'b3',
    categoryId: 'burgers',
    name: 'Smash Simples',
    description: 'Pão, carne prensada 100g e queijo prato. Simples e saboroso.',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800&auto=format&fit=crop'
  },
  
  // Drinks
  {
    id: 'd1',
    categoryId: 'drinks',
    name: 'Coca-Cola Lata',
    description: 'Lata 350ml geladíssima.',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'd2',
    categoryId: 'drinks',
    name: 'Suco de Laranja',
    description: 'Natural, feito na hora. 500ml.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
  },

  // Sides
  {
    id: 's1',
    categoryId: 'sides',
    name: 'Batata Frita Rustica',
    description: 'Porção individual com alho e alecrim.',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1630384060421-a4323ce66488?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 's2',
    categoryId: 'sides',
    name: 'Nuggets Crocantes',
    description: '10 unidades acompanhadas de molho barbecue.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop'
  },

  // Desserts
  {
    id: 'de1',
    categoryId: 'desserts',
    name: 'Pudim de Leite',
    description: 'Aquele clássico da vovó, sem furinhos.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1639679647228-569b0d24c08e?q=80&w=800&auto=format&fit=crop'
  }
];