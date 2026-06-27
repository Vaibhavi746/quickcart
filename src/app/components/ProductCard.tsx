"use client";
import { useState } from "react";
import PriceHistoryModal from "./PriceHistoryModal";

type Product = {
  _id: string;
  name: string;
  category: string;
  image?: string;
  prices: {
    blinkit: number;
    zepto: number;
    instamart: number;
  };
  links?: {
    blinkit: string;
    zepto: string;
    instamart: string;
  };
};

type Props = {
  product: Product;
  addToCart: (product: Product) => void;
  deleteProduct: (id: string)=> void;
  editProduct: (product: Product)=> void;
  isAdmin: boolean;
};

export default function ProductCard({
  product,
  addToCart,
  deleteProduct,
  editProduct,
  isAdmin,
}: Props) {
  const [showHistory, setShowHistory] = useState(false);

  const categoryImages: Record<string, string>={
     Dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150",
     Snacks: "https://images.unsplash.com/photo-1566478989037-eec170784d0b",
     Beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e",
     Groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    "Personal Care": "https://images.unsplash.com/photo-1526947425960-945c6e72858f",
     Sweets: "https://images.unsplash.com/photo-1551024601-bec78aea704b",
 };
 const defaultImage= categoryImages[product.category] || "https://images.unsplash.com/photo-1542838132-92c53300491e";
  
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <img src={product.image || defaultImage}
       alt={product.name}
       className="w-full h-28 object-cover rounded-lg mb-3"
      />
      <h2 className="text-sm text-green-700 font-medium">
        {product.name}
      </h2>

      <p className="text-sm text-gray-500"> {product.category}</p>

      <p className="text-sm text-gray-700">
          Zepto: ₹{product.prices.zepto}
      </p>

      <p className="text-sm text-gray-700">
           Blinkit: ₹{product.prices.blinkit}
      </p>

      <p className="text-sm text-gray-700">
           Instamart: ₹{product.prices.instamart}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        Add to Cart
      </button>

      <button
         onClick={() => setShowHistory(true)}
         className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
      >
           View Price History
      </button>
     
     {isAdmin && (
      <button 
        onClick={()=>{
          console.log("delete clicked", product._id);
          deleteProduct(product._id);
        }}
        className= "bg-red-500 text-white px-3 py-1.5 rounded mt-2">
          Delete
        </button>
     )}
     {isAdmin && (
        <button 
          onClick={()=> editProduct(product)}
          className ="bg-yellow-500 text-white px-3 py-1.5 rounded mt-2">
            Edit
          </button>
      )}

      {showHistory && (
        <PriceHistoryModal
          productId={product._id}
          productName={product.name}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
