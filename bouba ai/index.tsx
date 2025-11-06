import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Modality } from '@google/genai';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
  purchaseUrl: string;
}

interface Category {
  id: number;
  name: string;
}

// --- CONSTANTS ---
const CATEGORIES: Category[] = [
  { id: 1, name: 'مصابيح سقف' },
  { id: 2, name: 'سبوتات' },
  { id: 3, name: 'إضاءة ليد' },
  { id: 4, name: 'أباجورات' },
  { id: 5, name: 'إضاءة خارجية' },
];

const PRODUCTS: Product[] = [
  { id: 1, name: 'ثريا كريستال ذهبية', price: '35,000 دج', category: 'مصابيح سقف', imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8mCfEGyql6qCdeSyn1GV8uCrtHRuk665S1ayXDaOhSKEXHCsvL4JHQSOuNgkZuf8EpE8wUvo6Cxv7F1UUVhkpNsYj4T7fiFMNiQDbfu91UfKQsX-pzPtdfxLrEgaYG1XuZcS4uOmSAkrwv0VaQn7vZq31EgKZcK7E9zRr6m9yS4kTngbvUYzT0JS0huc/s800/SP-0011-1.jpg', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 2, name: 'مصباح سقف مودرن', price: '18,500 دج', category: 'مصابيح سقف', imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7HnwpzpRuBa1_G_hYfUWeP8G9OLTbDrZy5F-fV7hT3I_5P61bb8jkt5aEBzqIoSl9BzdXZNdLlBWRLuPJSdcZWrgS2oP62WBCD01u1CHWxut0J3jqh7CowRi_nR4QApT-eFCHiS7MxIt6miqwXBzyHqkEMrSQ5zzYSGNw4eimsMhpWGPShNkhoIO2YdU/s800/R-H372-5070.jpg', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 3, name: 'ثريا كلاسيكية برونزية', price: '42,000 دج', category: 'مصابيح سقف', imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4vu-mQcKN4g2volaQ6y_j4_NbKVjX02tXOZs3Ye87Q6VeocUNpY97nK85VRqyX1o7v9zGlyL5usZRMuwmMg3myun8WRfb4PBE6q6JjRA6m9Pc-BLC56RQFOZiAWAXgt37AiI4NKyCBUGcES1NHTYf5TZKARYr6UqCMJxnKd1ObY9MHmkSh7AKEznKOIM/s800/M-09048CL-3.jpg', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 4, name: 'سبوت LED غاطس', price: '1,200 دج', category: 'سبوتات', imageUrl: 'https://picsum.photos/seed/spot1/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 5, name: 'سبوت موجه أبيض', price: '2,500 دج', category: 'سبوتات', imageUrl: 'https://picsum.photos/seed/spot2/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 6, name: 'شريط ليد متعدد الألوان', price: '4,500 دج', category: 'إضاءة ليد', imageUrl: 'https://picsum.photos/seed/led1/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 7, name: 'لوحة ليد مربعة', price: '6,000 دج', category: 'إضاءة ليد', imageUrl: 'https://picsum.photos/seed/led2/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 8, name: 'أباجورة طاولة سيراميك', price: '7,800 دج', category: 'أباجورات', imageUrl: 'https://picsum.photos/seed/lamp1/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 9, name: 'أباجورة أرضية معدنية', price: '12,000 دج', category: 'أباجورات', imageUrl: 'https://picsum.photos/seed/lamp2/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 10, name: 'مصباح حائط خارجي', price: '9,500 دج', category: 'إضاءة خارجية', imageUrl: 'https://picsum.photos/seed/outdoor1/400/400', purchaseUrl: 'https://www.lumirama.dz' },
  { id: 11, name: 'كشاف حديقة بالطاقة الشمسية', price: '6,200 دج', category: 'إضاءة خارجية', imageUrl: 'https://picsum.photos/seed/outdoor2/400/400', purchaseUrl: 'https://www.lumirama.dz' },
];

// --- SERVICES ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function getPlacementInstruction(category: string): string {
    switch(category) {
        case 'مصابيح سقف':
        case 'سبوتات': return 'The fixture should be installed on the ceiling.';
        case 'أباجورات': return 'The lamp should be placed on a suitable surface like a table or the floor.';
        case 'إضاءة خارجية': return 'The light should be placed on an exterior wall or in a garden setting.';
        default: return 'Place the fixture appropriately in the room.';
    }
}

const placeProductInImage = async (roomImageBase64: string, roomImageMimeType: string, productImageBase64: string, productImageMimeType: string, prompt: string, category: string): Promise<string> => {
    try {
        const placement = getPlacementInstruction(category);
        const fullPrompt = `You are an expert interior design visualizer. Your task is to realistically integrate a lighting product into a room photo. - Room photo is provided. - Lighting product photo is provided. - User instruction: "${prompt}" - Placement guideline based on category: "${placement}" Combine these elements to create a photorealistic image. Pay close attention to scale, perspective, lighting, and shadows to make the integration seamless.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ inlineData: { data: roomImageBase64, mimeType: roomImageMimeType } }, { inlineData: { data: productImageBase64, mimeType: productImageMimeType } }, { text: fullPrompt }] },
            config: { responseModalities: [Modality.IMAGE] },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error('No image was generated by the API.');
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate image with Gemini API.");
    }
};

// --- COMPONENTS ---
const Spinner: React.FC = () => (
    <div className="flex justify-center items-center" aria-label="Loading">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gold"></div>
    </div>
);

interface ProductCardProps { product: Product; onSelectProduct: (product: Product) => void; }
const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 group relative" onClick={() => onSelectProduct(product)} role="button" aria-label={`Try ${product.name}`}>
      <div className="aspect-w-1 w-full overflow-hidden">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
        <p className="text-gold font-semibold mt-2">{product.price}</p>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-bold">جرب الآن</span>
      </div>
    </div>
);

interface ProductGridProps { products: Product[]; onSelectProduct: (product: Product) => void; }
const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelectProduct }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />)}
    </div>
);

const Header: React.FC = () => (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18M5.47 7.72l13.06 8.56M5.47 16.28L18.53 7.72"></path></svg>
          <h1 className="text-2xl font-heading font-bold text-gray-800">Lumirama</h1>
        </div>
        <nav className="hidden md:flex space-x-8 space-x-reverse">
          <a href="#" className="text-gray-600 hover:text-gold transition duration-300">الرئيسية</a>
          <a href="#" className="text-gray-600 hover:text-gold transition duration-300">المنتجات</a>
          <a href="#" className="text-gray-600 hover:text-gold transition duration-300">تواصل معنا</a>
        </nav>
        <button className="md:hidden text-gray-600" aria-label="Open menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
);

interface SidebarProps { categories: Category[]; selectedCategory: Category | null; onSelectCategory: (category: Category) => void; }
const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => (
    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-lg self-start">
      <h2 className="text-xl font-bold font-heading mb-4 text-gray-800">الفئات</h2>
      <ul role="list">
        {categories.map(category => (
          <li key={category.id} className="mb-2">
            <button onClick={() => onSelectCategory(category)} className={`w-full text-right px-4 py-2 rounded-md transition duration-300 text-base ${ selectedCategory?.id === category.id ? 'bg-gold text-white shadow' : 'text-gray-600 hover:bg-gold-50 hover:text-gold' }`}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
);

interface VirtualTryOnProps { product: Product; onBack: () => void; }
const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, onBack }) => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
  });

  const urlToBase64 = async (url: string): Promise<string> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGeneratedImages([]);
      const base64Image = await fileToBase64(file);
      setRoomImage(`data:${file.type};base64,${base64Image}`);
      handleImageGeneration(base64Image, file.type);
    }
  };

  const handleImageGeneration = useCallback(async (roomImageBase64: string, roomImageMimeType: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const productImageBase64 = await urlToBase64(product.imageUrl);
        const prompts = [
            `ضع وحدة الإضاءة هذه بشكل واقعي في الغرفة. يجب أن تكون مثبتة في السقف. ركز على الظلال والإضاءة والحجم لجعلها تبدو طبيعية.`,
            `اعرض وحدة الإضاءة هذه في الغرفة من زاوية مختلفة قليلاً، مع إضاءة أكثر نعومة.`,
            `قم بدمج وحدة الإضاءة هذه في الغرفة، واعرضها كما لو أن الأضواء مضاءة في المساء.`
        ];
        const promises = prompts.map(prompt => placeProductInImage(roomImageBase64, roomImageMimeType, productImageBase64, "image/jpeg", prompt, product.category));
        const results = await Promise.all(promises);
        setGeneratedImages(results);
    } catch (err) {
      setError('فشل في توليد الصورة. الرجاء المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [product]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
      <button onClick={onBack} className="mb-6 text-gold hover:underline flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        العودة إلى المنتجات
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow-md" />
          <h2 className="text-2xl font-bold font-heading mt-4">{product.name}</h2>
          <p className="text-xl text-gold mt-2">{product.price}</p>
          <p className="text-gray-600 mt-1">{product.category}</p>
        </div>
        <div className="md:w-2/3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gold-50">
            <h3 className="text-xl font-bold mb-2">جرب المنتج في مساحتك الخاصة</h3>
            <p className="text-gray-600 mb-4">ارفع صورة لغرفتك لترى كيف سيبدو المنتج فيها.</p>
            <input type="file" id="room-image-upload" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
            <label htmlFor="room-image-upload" className="inline-block bg-gold text-white font-bold py-2 px-6 rounded-lg cursor-pointer hover:bg-gold-600 transition duration-300">ارفع صورة</label>
          </div>
          {error && <p className="text-red-500 mt-4 text-center" role="alert">{error}</p>}
        </div>
      </div>
      {isLoading && <div className="mt-8 text-center" role="status" aria-live="polite"><Spinner /><p className="mt-4 text-gray-600">يقوم الذكاء الاصطناعي بدمج المنتج في صورتك... قد يستغرق هذا بضع لحظات.</p></div>}
      {generatedImages.length > 0 && (
        <div className="mt-12">
            <h3 className="text-2xl font-bold font-heading text-center mb-6">النتائج التي تم إنشاؤها بواسطة الذكاء الاصطناعي</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {generatedImages.map((imgSrc, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-lg border-2 border-gold">
                        <img src={imgSrc} alt={`Generated view ${index + 1}`} className="w-full h-auto object-contain" />
                    </div>
                ))}
            </div>
             <div className="text-center mt-8">
                <a href={product.purchaseUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-lg cursor-pointer hover:bg-green-700 transition duration-300 text-lg shadow-md">إكمال الشراء على موقع Lumirama</a>
            </div>
        </div>
      )}
      {roomImage && generatedImages.length === 0 && !isLoading && (
         <div className="mt-12">
             <h3 className="text-2xl font-bold font-heading text-center mb-6">صورتك الأصلية</h3>
             <div className="flex justify-center"><img src={roomImage} alt="Your room" className="max-w-full md:max-w-lg rounded-lg shadow-lg" /></div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(CATEGORIES[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory.name);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
            <Sidebar categories={CATEGORIES} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            <div className="flex-1">
            {selectedProduct ? <VirtualTryOn product={selectedProduct} onBack={() => setSelectedProduct(null)} /> : <ProductGrid products={filteredProducts} onSelectProduct={(product) => setSelectedProduct(product)} />}
            </div>
        </div>
      </main>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
