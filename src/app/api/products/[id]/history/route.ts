import { NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await client.connect();

  const db = client.db("quickcart");

  const historyCollection = db.collection("priceHistory");

  const history = await historyCollection
    .find({
      productId: id,
    })
    .sort({
      changedAt: -1,
    })
    .toArray();

  return NextResponse.json(history);
}
