
import React, { useState, useCallback } from 'react';
import { Product } from '../types';
import { placeProductInImage } from '../services/geminiService';
import Spinner from './Spinner';

interface VirtualTryOnProps {
  product: Product;
  onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

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


const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ product, onBack }) => {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGeneratedImages([]);
      const base64Image = await fileToBase64(file);
      const imageUrl = `data:${file.type};base64,${base64Image}`;
      setRoomImage(imageUrl);
      handleImageGeneration(base64Image, file.type);
    }
  };

  const handleImageGeneration = useCallback(async (roomImageBase64: string, roomImageMimeType: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const productImageUrl = product.imageUrl;
        const productImageBase64 = await urlToBase64(productImageUrl);
        const productImageMimeType = "image/jpeg";

        const prompts = [
            `ضع وحدة الإضاءة هذه بشكل واقعي في الغرفة. يجب أن تكون مثبتة في السقف. ركز على الظلال والإضاءة والحجم لجعلها تبدو طبيعية.`,
            `اعرض وحدة الإضاءة هذه في الغرفة من زاوية مختلفة قليلاً، مع إضاءة أكثر نعومة.`,
            `قم بدمج وحدة الإضاءة هذه في الغرفة، واعرضها كما لو أن الأضواء مضاءة في المساء.`
        ];
        
        const promises = prompts.map(prompt => 
            placeProductInImage(roomImageBase64, roomImageMimeType, productImageBase64, productImageMimeType, prompt, product.category)
        );

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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
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
            <input
              type="file"
              id="room-image-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="room-image-upload" className="inline-block bg-gold text-white font-bold py-2 px-6 rounded-lg cursor-pointer hover:bg-gold-600 transition duration-300">
              ارفع صورة
            </label>
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>
      
      {isLoading && (
        <div className="mt-8 text-center">
            <Spinner />
            <p className="mt-4 text-gray-600">يقوم الذكاء الاصطناعي بدمج المنتج في صورتك... قد يستغرق هذا بضع لحظات.</p>
        </div>
      )}

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
                <a 
                    href={product.purchaseUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white font-bold py-3 px-10 rounded-lg cursor-pointer hover:bg-green-700 transition duration-300 text-lg shadow-md"
                >
                    إكمال الشراء على موقع Lumirama
                </a>
            </div>
        </div>
      )}

      {roomImage && generatedImages.length === 0 && !isLoading && (
         <div className="mt-12">
             <h3 className="text-2xl font-bold font-heading text-center mb-6">صورتك الأصلية</h3>
             <div className="flex justify-center">
                <img src={roomImage} alt="Your room" className="max-w-full md:max-w-lg rounded-lg shadow-lg" />
             </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTryOn;
