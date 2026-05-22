"use client";

import Image from "next/image";

export interface ItemData {
  id: number;
  name: string;
  description: string | null;
  category: string;
  quantity: number;
  price: string;
  imageUrl: string | null;
  createdAt: string;
}

interface ItemCardProps {
  item: ItemData;
  onEdit: (item: ItemData) => void;
  onDelete: (item: ItemData) => void;
  onView: (item: ItemData) => void;
}

export default function ItemCard({ item, onEdit, onDelete, onView }: ItemCardProps) {
  const isLowStock = item.quantity <= 5;
  const isOutOfStock = item.quantity === 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image — click to view detail */}
      <div
        onClick={() => onView(item)}
        className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-6xl opacity-20">📦</span>
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Stock badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
            isOutOfStock
              ? "bg-gray-900 text-white"
              : isLowStock
              ? "bg-amber-400 text-amber-900"
              : "bg-emerald-400 text-emerald-900"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
            {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-sm px-3 py-1 rounded-full shadow-sm">
            ${parseFloat(item.price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1">
              {item.name}
            </h3>
          </div>

          <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full mb-3">
            {item.category}
          </span>

          {item.description && (
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-xs">Qty</span>
            <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
              isOutOfStock
                ? "bg-gray-100 text-gray-500"
                : isLowStock
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-50 text-gray-700"
            }`}>
              {item.quantity}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
