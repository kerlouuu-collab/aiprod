
import React from 'react';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-lg self-start">
      <h2 className="text-xl font-bold font-heading mb-4 text-gray-800">الفئات</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id} className="mb-2">
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-right px-4 py-2 rounded-md transition duration-300 text-base ${
                selectedCategory?.id === category.id
                  ? 'bg-gold text-white shadow'
                  : 'text-gray-600 hover:bg-gold-50 hover:text-gold'
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
