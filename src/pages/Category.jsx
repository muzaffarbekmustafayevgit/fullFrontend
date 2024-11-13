import React from "react";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    navigate(`/courses?category=${category}`);
  };

  return (
    <div
      onClick={handleCategoryClick}
      className="cursor-pointer bg-gray-800 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
    >
      <div className="p-4">
        <h4 className="text-xl font-semibold">{category}</h4>
      </div>
    </div>
  );
};

const Category = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <CategoryCard key={index} category={category} />
      ))}
    </div>
  );
};

export default Category;
