import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="flex items-center mb-6 border-b pb-4">
      <img
        src={product.imageUrl}
        alt="Product"
        className="w-32 h-32 object-cover bg-white rounded-lg shadow-md" // No border class
      />
      <div className="ml-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          {product.title}
        </h2>
        <p className="text-gray-600">{product.description}</p>
        <span
          className={`mt-2 inline-block text-sm px-2 py-1 rounded-full ${
            product.isActive
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
        <p className="text-gray-700 mt-2">
          <strong>Category:</strong> {product.subCategory.title}
        </p>
      </div>
    </div>
  );
}
