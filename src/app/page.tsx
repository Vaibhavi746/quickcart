"use client";

import { useState, useEffect} from "react";

import StoreCard from "./components/StoreCard";
import ProductCard from "./components/ProductCard";
import CartItem from "./components/CartItem";



export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm]= useState("");
  const [sortOption, setSortOption] = useState("name");
  const [productName, setProductName]= useState("");
  const [blinkitPrice, setBlinkitPrice]= useState("");
  const [zeptoPrice, setZeptoPrice]= useState("");
  const [instamartPrice, setInstamartPrice] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageUrl, setImageUrl] = useState("");


  async function fetchProducts(){
    const response = await fetch ("/api/products");
    const data = await response.json();
    setProducts(data);
  }
  useEffect(()=> {
    fetchProducts();
  }, []);

  useEffect(()=>{
    const savedCart = localStorage.getItem("cart");
    if(savedCart){
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem(
      "cart", JSON.stringify(cart)
    );
  },[cart]);

  function addToCart(product: any) {
    const existingItem = cart.find(
      (item) => item._id === product._id
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  }

  function resetForm(){
     setProductName("");
     setCategory("");
     setBlinkitPrice("");
     setZeptoPrice("");
     setInstamartPrice("");
     setMessage("");
     setEditingId(null);
     setImageUrl("");
  }

  function increaseQuantity(id: string) {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    setCart(updatedCart);
  }

  function decreaseQuantity(id: string) {
    const updatedCart = cart
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  }

  const blinkitTotal = cart.reduce(
    (total, item) => total + item.prices.blinkit * item.quantity,
    0
  );
  const zeptoTotal= cart.reduce(
    (total,item)=> total+ item.prices.zepto * item.quantity,
    0
  );
  const instamartTotal = cart.reduce(
    (total,item)=> total+ item.prices.instamart * item.quantity,
    0
  );
  const cheapestStore =
    Math.min(
      blinkitTotal,
      zeptoTotal,
      instamartTotal
    ) === blinkitTotal
      ? "Blinkit"
      : Math.min(
          blinkitTotal,
          zeptoTotal,
          instamartTotal
        ) === zeptoTotal
      ? "Zepto"
      : "Instamart";
  const cheapestPrice = Math.min(
    blinkitTotal, zeptoTotal, instamartTotal
  );
  const blinkitSavings= blinkitTotal - cheapestPrice;
  const zeptoSavings= zeptoTotal - cheapestPrice;
  const instamartSavings= instamartTotal - cheapestPrice;

  const filteredProducts= products.filter(
    (product)=> product.name.toLowerCase().includes(searchTerm.toLowerCase())&& 
    (selectedCategory==="all" ||
      product.category===selectedCategory
    )
  );

  function getCheapestPrice(product:any){
    return Math.min(
      product.prices.blinkit, product.prices.zepto, product.prices.instamart
    );
  }
  const sortedProducts=[...filteredProducts];
  
  if(sortOption==="name"){
    sortedProducts.sort((a,b)=>
    a.name.localeCompare(b.name));
  }
  if(sortOption==="cheapest"){
    sortedProducts.sort((a,b)=>
    getCheapestPrice(a)- getCheapestPrice(b));
  }
  if(sortOption==="expensive"){
    sortedProducts.sort((a,b)=> getCheapestPrice(b)-getCheapestPrice(a));
  }

  async function addNewProduct(){
    if(
     !productName || !category || Number(blinkitPrice)<=0 ||
     Number(zeptoPrice)<=0 || Number(instamartPrice)<=0
    ){
    setMessage("Please fill all the fields with valid values");
    return;
    }
    const response = await fetch("/api/products",{
      method: "POST",
    headers:{ "Content-Type" : "application/json",},
  body: JSON.stringify({
    name: productName,
    category: category,
    image: imageUrl ||  "https://images.unsplash.com/photo-1542838132-92c53300491e",
    prices:{
      blinkit: Number(blinkitPrice),
      zepto: Number(zeptoPrice),
      instamart: Number(instamartPrice),
    }
  }),});
  const data = await response.json();
  setMessage(data.message);
  await fetchProducts();
  setProductName("");
  setCategory("");
  setBlinkitPrice("");
  setZeptoPrice("");
  setInstamartPrice("");
  }

  async function updateProduct(){
    if(!editingId) return;
    const response = await fetch(`/api/products/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json",},
        body: JSON.stringify({
          
          name: productName,
          category: category,
          prices: {
            blinkit: Number(blinkitPrice),
            zepto: Number(zeptoPrice),
            instamart: Number(instamartPrice),
          },
        }),
      }
    );
    const data= await response.json();
   setMessage(data.message);
   await fetchProducts();
   setEditingId(null);
   setProductName("");
   setCategory("");
   setBlinkitPrice("");
   setZeptoPrice("");
   setInstamartPrice("");
  }

  

  async function deleteProduct(id: string){
    // console.log("deleting:", id);
    const response = await fetch(
      `/api/products/${id}`,
      {
        method: "DELETE",
      }
    );
    console.log("Status:", response.status);
    const data = await response.json();
    setMessage(data.message);
    fetchProducts();
  }

  function editProduct( product: any){
    // console.log("edit clicked:", product);
    setEditingId(product._id);
    setProductName(product.name);
    setCategory(product.category || "");
    setImageUrl(product.image || "");
    setBlinkitPrice( product.prices.blinkit.toString());
    setZeptoPrice( product.prices.zepto.toString());
    setInstamartPrice( product.prices.instamart.toString());
  }


  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
       <main className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
         <h1 className="text-4xl font-bold text-green-700">
          QuickCart
         </h1>

          <p className="text-gray-600 mt-2">
             Compare grocery prices across Blinkit, Zepto and Instamart.
          </p>
            <p className="mt-3 text-lg font-semibold">
               Cart Items: {cart.length}
            </p>
      </div>

      <div className="mb-8 bg-stone-50 border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">
          Admin Panel
        </h2>

        {message && (
          <p className="mb-4 font-semibold">
            {message}
          </p>
        )}
        <input
           type="text"
           placeholder="Product Name"
           value={productName}
           onChange={(e)=> setProductName(e.target.value)}
           className="border p-3 rounded w-full mb-4 bg-white text-black"/>

           <select
             value={category}
             onChange={(e)=>
              setCategory(e.target.value)
             }
             className="border p-3 rounded w-full mb-4 bg-white text-black"
            >
              <option value="">Select Category</option>
              <option value="Dairy">Dairy</option>
              <option value="Snacks">Snacks</option>
              <option value="Sweets">Sweets</option>
              <option value="Beverages">Beverages</option>
              <option value="Groceries">Groceries</option>
              <option value="Personal Care">Personal Care</option>
            </select>

            <input type="text"
                   placeholder="Image URL (optional)"
                   value={imageUrl}
                   onChange={(e)=> setImageUrl(e.target.value)}
                   className= "border p-3 rounded w-full mb-4 bg-white text-black" 
            />

        <input
          type="number"
          placeholder= "Blinkit Price"
          value={blinkitPrice}
          onChange={(e)=> setBlinkitPrice(e.target.value)}
          className= "border p-3 rounded w-full mb-4 bg-white text-black"
        />
        <input type="number"
         placeholder= "Zepto Price"
         value= {zeptoPrice}
         onChange={(e)=> setZeptoPrice(e.target.value)}
         className="border p-3 rounded w-full mb-4 bg-white text-black"
        />
        <input type="number"
         placeholder= "Instamart Price"
         value={instamartPrice}
         onChange={(e)=> setInstamartPrice(e.target.value)}
         className= "border p-3 rounded w-full mb-4 bg-white text-black"
        />

           <button 
              onClick ={
                editingId ? updateProduct: addNewProduct
              }
              className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingId ? "Update Product" : "Add Product"}
            </button>
            <button 
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-3">
                Reset
              </button>
      </div>
      <input
        type="text"
        placeholder="Search products"
        value={searchTerm}
        onChange={(e)=> setSearchTerm(e.target.value)}
        className="border p-3 rounded w-full mb-6 bg-white text-black"
      />

      <select value={selectedCategory}
              onChange={(e)=>
                setSelectedCategory(e.target.value)
              }
              className="border p-3 rounded mb-6 ml-4 bg-white text-black">
                <option value="all">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Snacks">Snacks</option>
                <option value="Sweets">Sweets</option>
                <option value="Beverages">Beverages</option>
                <option value="Groceries">Groceries</option>
                <option value="Personal Care">Personal Care</option>
              </select>

      <select
        value={sortOption}
        onChange={(e)=> setSortOption(e.target.value)}
        className="border p-3 rounded mb-6 bg-white text-black"
      >
        <option value="name">
          Product Name
        </option>
        <option value="cheapest">
          Cheapest Price
        </option>
        <option value="expensive">
          Most Expensive
        </option>
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            addToCart={addToCart}
            deleteProduct={deleteProduct}
            editProduct= {editProduct}
          />
        ))}
      </div>

      <div className="border-t pt-6">
        <h2 className="text-3xl font-bold mb-4">
          Cart
        </h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            ))}

            <div className="mt-6 space-y-3">

               <div className="grid md:grid-cols-3 gap-4">

                    <StoreCard
                       storeName="Blinkit"
                       total={blinkitTotal}
                       isCheapest={cheapestStore === "Blinkit"}
                    />

                    <StoreCard
                      storeName="Zepto"
                      total={zeptoTotal}
                      isCheapest={cheapestStore === "Zepto"}
                    />

                    <StoreCard
                      storeName="Instamart"
                      total={instamartTotal}
                      isCheapest={cheapestStore === "Instamart"}
                    />

                </div>

               <h2 className="text-3xl font-bold mt-6">
                🏆 Cheapest: {cheapestStore}
               </h2>
               <button 
                  onClick={()=> {
                    const storeLinks={
                      Blinkit:"https://www.blinkit.com",
                      Zepto: "https://www.zeptonow.com",
                      Instamart: "https://www.swiggy.com/instamart",

                    };
                    window.open(
                      storeLinks[cheapestStore as keyof typeof storeLinks],
                      "_blank"
                    );
                  }}
                  className= "bg-green-600 text-white px-4 py-2 rounded mt-4"
                  >
                 Open {cheapestStore}
               </button>
               <div className="mt-4 space-y-2">
                  {blinkitSavings > 0 &&(
                    <p> 
                      Save ₹{blinkitSavings} compared to Blinkit
                    </p>
                  )}
                  {zeptoSavings >0 &&(
                    <p>
                      Save ₹{zeptoSavings} compared to Zepto
                    </p>
                  )}
                  {instamartSavings >0 &&(
                    <p>
                      Save ₹{instamartSavings} compared to Instamart
                    </p>
                  )}

                </div>
            
            </div>
          </div>
        )}
        </div>
      </main>
      
    </div>
  );
}