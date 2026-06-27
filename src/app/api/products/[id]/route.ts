import client from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Deleting Mongo ID:", id);

  await client.connect();

  const db = client.db("quickcart");
  const productsCollection =
    db.collection("products");

   const result = await productsCollection.deleteOne({
    _id: new ObjectId(id),
  });
   console.log("Delete Result:", result);


//   await productsCollection.deleteOne({
//     _id: new ObjectId(id),
//   });

  return NextResponse.json({
    message: "Product deleted successfully",
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  await client.connect();

  const db = client.db("quickcart");
  const productsCollection = db.collection("products");
  const priceHistoryCollection = db.collection("priceHistory");

  const existingProduct = await productsCollection.findOne({
    _id: new ObjectId(id),
  });

  if (!existingProduct) {
    return NextResponse.json(
      {
        message: "Product not found",
      },
      {
        status: 404,
      }
    );
  }

  const oldPrices = existingProduct.prices;
const newPrices = body.prices;

const changes = [];

if (oldPrices.blinkit !== newPrices.blinkit) {
  changes.push({
    store: "Blinkit",
    oldPrice: oldPrices.blinkit,
    newPrice: newPrices.blinkit,
    difference: newPrices.blinkit - oldPrices.blinkit,
  });
}

if (oldPrices.zepto !== newPrices.zepto) {
  changes.push({
    store: "Zepto",
    oldPrice: oldPrices.zepto,
    newPrice: newPrices.zepto,
    difference: newPrices.zepto - oldPrices.zepto,
  });
}

if (oldPrices.instamart !== newPrices.instamart) {
  changes.push({
    store: "Instamart",
    oldPrice: oldPrices.instamart,
    newPrice: newPrices.instamart,
    difference: newPrices.instamart - oldPrices.instamart,
  });
}

const priceChanged = changes.length > 0;

if (priceChanged) {
  await priceHistoryCollection.insertOne({
    productId: id,
    productName: existingProduct.name,
    changes: changes,
    changedAt: new Date(),
  });
}

  await productsCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        name: body.name,
        category: body.category,
        image: body.image,
        prices: body.prices,
      },
    }
  );

  return NextResponse.json({
    message: priceChanged
      ? "Product updated and price history saved"
      : "Product updated successfully",
  });
}