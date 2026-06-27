"use client";

import { useEffect, useState } from "react";

type PriceHistory = {
  _id: string;
  productName: string;
  changes: {
    store: string;
    oldPrice: number;
    newPrice: number;
    difference: number;
  }[];
  changedAt: string;
};

type Props = {
  productId: string;
  productName: string;
  onClose: () => void;
};

export default function PriceHistoryModal({
  productId,
  productName,
  onClose,
}: Props) {
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const response = await fetch(`/api/products/${productId}/history`);
      const data = await response.json();

      setHistory(data);
      setLoading(false);
    }

    fetchHistory();
  }, [productId]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-[600px] max-h-[80vh] overflow-y-auto p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            📈 {productName} Price History
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No price history found.</p>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 mb-4"
            >
              <p className="text-sm text-gray-500 mb-3">
                {new Date(item.changedAt).toLocaleString()}
              </p>

              {item.changes.map((change, index) => (
  <div
    key={index}
    className="flex justify-between items-center border-b py-2"
  >
    <div>
      <p className="font-semibold">{change.store}</p>

      <p className="text-gray-600">
        ₹{change.oldPrice} → ₹{change.newPrice}
      </p>
    </div>

    <div>
      {change.difference > 0 ? (
        <span className="text-red-600 font-semibold">
          🔺 Increased by ₹{change.difference}
        </span>
      ) : (
        <span className="text-green-600 font-semibold">
          🔻 Decreased by{change.difference}
        </span>
      )}
    </div>
  </div>
))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
