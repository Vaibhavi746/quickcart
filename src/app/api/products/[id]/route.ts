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
  const productsCollection =
    db.collection("products");

  await productsCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        name: body.name,
        category: body.category,
        prices: body.prices,
      },
    }
  );

  return NextResponse.json({
    message: "Product updated successfully",
  });
}