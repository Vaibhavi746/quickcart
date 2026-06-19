type Product = {
  _id: string;
  name: string;
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
};

export default function ProductCard({
  product,
  addToCart,
  deleteProduct,
  editProduct,
}: Props) {
  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-2xl font-semibold">
        {product.name}
      </h2>

      <p className="text-lg">
          Zepto: ₹{product.prices.zepto}
      </p>

      <p className="text-lg">
           Blinkit: ₹{product.prices.blinkit}
      </p>

      <p className="text-lg">
           Instamart: ₹{product.prices.instamart}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        Add to Cart
      </button>

      <button 
        onClick={()=>{
          console.log("delete clicked", product._id);
          deleteProduct(product._id);
        }}
        className= "bg-red-500 text-white px-4 py-2 rounded mt-2">
          Delete
        </button>

        <button 
          onClick={()=> editProduct(product)}
          className ="bg-yellow-500 text-white px-4 py-2 rounded mt-2">
            Edit
          </button>
    </div>
  );
}
