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
    <div
      onClick={() => onView(item)}
      className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
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
              ? "bg-teal-700 text-white"
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
          <span className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white font-bold text-sm px-3 py-1 rounded-full shadow-sm">
            ${parseFloat(item.price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-1">
              {item.name}
            </h3>
          </div>

          <span className="inline-block text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2.5 py-0.5 rounded-full mb-3">
            {item.category}
          </span>

          {item.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-xs">Qty</span>
            <span className={`text-sm font-bold px-2 py-0.5 rounded-lg ${
              isOutOfStock
                ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : isLowStock
                ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}>
              {item.quantity}
            </span>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(item); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-100 dark:border-rose-800 rounded-xl transition-colors"
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
