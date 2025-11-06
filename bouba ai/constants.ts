import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 1, name: 'مصابيح سقف' },
  { id: 2, name: 'سبوتات' },
  { id: 3, name: 'إضاءة ليد' },
  { id: 4, name: 'أباجورات' },
  { id: 5, name: 'إضاءة خارجية' },
];

export const PRODUCTS: Product[] = [
  // مصابيح سقف
  {
    id: 1,
    name: 'ثريا كريستال ذهبية',
    price: '35,000 دج',
    category: 'مصابيح سقف',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8mCfEGyql6qCdeSyn1GV8uCrtHRuk665S1ayXDaOhSKEXHCsvL4JHQSOuNgkZuf8EpE8wUvo6Cxv7F1UUVhkpNsYj4T7fiFMNiQDbfu91UfKQsX-pzPtdfxLrEgaYG1XuZcS4uOmSAkrwv0VaQn7vZq31EgKZcK7E9zRr6m9yS4kTngbvUYzT0JS0huc/s800/SP-0011-1.jpg',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  {
    id: 2,
    name: 'مصباح سقف مودرن',
    price: '18,500 دج',
    category: 'مصابيح سقف',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7HnwpzpRuBa1_G_hYfUWeP8G9OLTbDrZy5F-fV7hT3I_5P61bb8jkt5aEBzqIoSl9BzdXZNdLlBWRLuPJSdcZWrgS2oP62WBCD01u1CHWxut0J3jqh7CowRi_nR4QApT-eFCHiS7MxIt6miqwXBzyHqkEMrSQ5zzYSGNw4eimsMhpWGPShNkhoIO2YdU/s800/R-H372-5070.jpg',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  {
    id: 3,
    name: 'ثريا كلاسيكية برونزية',
    price: '42,000 دج',
    category: 'مصابيح سقف',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4vu-mQcKN4g2volaQ6y_j4_NbKVjX02tXOZs3Ye87Q6VeocUNpY97nK85VRqyX1o7v9zGlyL5usZRMuwmMg3myun8WRfb4PBE6q6JjRA6m9Pc-BLC56RQFOZiAWAXgt37AiI4NKyCBUGcES1NHTYf5TZKARYr6UqCMJxnKd1ObY9MHmkSh7AKEznKOIM/s800/M-09048CL-3.jpg',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  // سبوتات
  {
    id: 4,
    name: 'سبوت LED غاطس',
    price: '1,200 دج',
    category: 'سبوتات',
    imageUrl: 'https://picsum.photos/seed/spot1/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  {
    id: 5,
    name: 'سبوت موجه أبيض',
    price: '2,500 دج',
    category: 'سبوتات',
    imageUrl: 'https://picsum.photos/seed/spot2/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  // إضاءة ليد
  {
    id: 6,
    name: 'شريط ليد متعدد الألوان',
    price: '4,500 دج',
    category: 'إضاءة ليد',
    imageUrl: 'https://picsum.photos/seed/led1/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  {
    id: 7,
    name: 'لوحة ليد مربعة',
    price: '6,000 دج',
    category: 'إضاءة ليد',
    imageUrl: 'https://picsum.photos/seed/led2/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  // أباجورات
  {
    id: 8,
    name: 'أباجورة طاولة سيراميك',
    price: '7,800 دج',
    category: 'أباجورات',
    imageUrl: 'https://picsum.photos/seed/lamp1/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  {
    id: 9,
    name: 'أباجورة أرضية معدنية',
    price: '12,000 دج',
    category: 'أباجورات',
    imageUrl: 'https://picsum.photos/seed/lamp2/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
   // إضاءة خارجية
  {
    id: 10,
    name: 'مصباح حائط خارجي',
    price: '9,500 دج',
    category: 'إضاءة خارجية',
    imageUrl: 'https://picsum.photos/seed/outdoor1/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
  {
    id: 11,
    name: 'كشاف حديقة بالطاقة الشمسية',
    price: '6,200 دج',
    category: 'إضاءة خارجية',
    imageUrl: 'https://picsum.photos/seed/outdoor2/400/400',
    purchaseUrl: 'https://www.lumirama.dz',
  },
];