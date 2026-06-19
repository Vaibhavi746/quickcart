import client from "@/lib/mongodb";
import { NextResponse } from "next/server";

 export async function GET() {
  await client.connect();
  const db= client.db("quickcart");
  const productsCollection= db.collection("products");

  console.log("Connected to MongoDB")
  console.log("Mongo URI:", process.env.MONGODB_URI);
  
  const products= await productsCollection.find({}).toArray();
  return NextResponse.json(products);
 }



export async function POST(request: Request) {
  const body = await request.json();
  await client.connect();
  const db= client.db("quickcart");
  const productsCollection= db.collection("products");

  const existingProduct= await productsCollection.findOne({
    name: body.name,
  });
  if(existingProduct){
    return NextResponse.json({
      message: "Product already exixts",
    },{
      status: 400,
    });
  }
  const searchQuery = encodeURIComponent(body.name);

  const productWithLinks = {
   ...body,
   links: {
    blinkit: `https://www.blinkit.com/s/?q=${searchQuery}`,
    zepto: `https://www.zeptonow.com/search?query=${searchQuery}`,
    instamart: `https://www.swiggy.com/instamart/search?query=${searchQuery}`,
  },
};

await productsCollection.insertOne(productWithLinks);

return NextResponse.json({
  message: "Product added successfully",
  product: productWithLinks,
});
}



