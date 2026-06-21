type Product = {
  _id: string;
  name: string;
  prices: {
    blinkit: number;
    zepto: number;
    instamart: number;
  };
  links?:{
    blinkit: string;
    zepto: string;
    instamart:string;
  }
  quantity: number;
};

type Props = {
  item: Product;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

export default function CartItem({
  item,
  increaseQuantity,
  decreaseQuantity,
}: Props) {
  return (
    <div className="flex justify-between items-center border p-3 rounded">
      <div>
        <p className="font-semibold">
          {item.name}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() =>
              decreaseQuantity(item._id)
            }
            className="bg-red-500 text-white px-3 py-1 rounded"
           >
             -
           </button>

           <span className="text-lg font-bold">
              {item.quantity}
           </span>

           <button
              onClick={() =>
                increaseQuantity(item._id)
              }
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              +
            </button>
        </div>

       <p className="mt-2">
           ₹{item.prices.zepto * item.quantity}
        </p>

        <div className="flex gap-2 mt-3">
           <button
            onClick={() => window.open(item.links?.zepto, "_blank")}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
          >
              Zepto
          </button>

           <button
             onClick={() => window.open(item.links?.blinkit, "_blank")}
             className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
            >
              Blinkit
            </button>

            <button
              onClick={() => window.open(item.links?.instamart, "_blank")}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
               Instamart
            </button>
        </div>
    </div>

    
    </div>
  );
}
