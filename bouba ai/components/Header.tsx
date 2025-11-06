
import React from 'react';

const Header: React.FC = () => {
  return (
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
        <button className="md:hidden text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
