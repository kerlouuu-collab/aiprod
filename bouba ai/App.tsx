
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import VirtualTryOn from './components/VirtualTryOn';
import { Product, Category } from './types';
import { PRODUCTS, CATEGORIES } from './constants';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(CATEGORIES[0]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return PRODUCTS;
    }
    return PRODUCTS.filter(p => p.category === selectedCategory.name);
  }, [selectedCategory]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        <Sidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="flex-1">
          {selectedProduct ? (
            <VirtualTryOn product={selectedProduct} onBack={handleBackToProducts} />
          ) : (
            <ProductGrid products={filteredProducts} onSelectProduct={handleSelectProduct} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
