type Props = {
  storeName: string;
  total: number;
  isCheapest: boolean;
};

export default function StoreCard({
  storeName,
  total,
  isCheapest,
}: Props) {
  return (
    <div className="border rounded p-4">

      <h3 className="text-2xl font-bold">
        {storeName}
      </h3>

      <p className="text-xl mt-2">
        ₹{total}
      </p>

      {isCheapest && (
        <p className="mt-2 text-green-500 font-bold">
          🏆 Cheapest Option
        </p>
      )}

    </div>
  );
}