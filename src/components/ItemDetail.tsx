"use client";

import Image from "next/image";
import { ItemData } from "./ItemCard";

interface ItemDetailProps {
  item: ItemData;
  onClose: () => void;
  onEdit: (item: ItemData) => void;
  onDelete: (item: ItemData) => void;
}

export default function ItemDetail({ item, onClose, onEdit, onDelete }: ItemDetailProps) {
  const isLowStock = item.quantity <= 5 && item.quantity > 0;
  const isOutOfStock = item.quantity === 0;

  const stockLabel = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";
  const stockBadgeColor = isOutOfStock
    ? "bg-teal-700 text-white"
    : isLowStock
    ? "bg-amber-400 text-amber-900"
    : "bg-emerald-400 text-emerald-900";

  const createdDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col md:flex-row overflow-hidden">

      {/* Back arrow — top left */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-sm"
        aria-label="Go back"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      {/* Image — full left on desktop, full top on mobile */}
      <div className="relative w-full h-72 sm:h-80 md:h-screen md:w-1/2 lg:w-[55%] bg-gray-100 dark:bg-gray-800 flex-shrink-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <span className="text-8xl opacity-20">📦</span>
            <span className="text-sm text-gray-400">No image available</span>
          </div>
        )}

        {/* Stock badge on image */}
        <div className="absolute bottom-4 left-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${stockBadgeColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
            {stockLabel}
          </span>
        </div>
      </div>

      {/* Details — right on desktop, below image on mobile */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-8 md:px-10 md:py-14 lg:px-14 max-w-2xl mx-auto md:mx-0">

          {/* Category pill + product name */}
          <div className="mb-5 mt-2 md:mt-8">
            <span className="inline-block text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full mb-3">
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {item.name}
            </h1>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Unit Price</p>
            <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400">
              ${parseFloat(item.price).toFixed(2)}
            </p>
          </div>

          {/* Quantity + Total Value */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Quantity</p>
              <p className={`text-2xl font-bold ${isOutOfStock ? "text-gray-400 dark:text-gray-500" : isLowStock ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-white"}`}>
                {item.quantity}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">units</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Description</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          )}

          {/* Added date */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Added on {createdDate}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); onEdit(item); }}
              className="flex-1 px-5 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-semibold text-sm"
            >
              Edit Item
            </button>
            <button
              onClick={() => { onClose(); onDelete(item); }}
              className="px-5 py-3 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors font-semibold text-sm"
            >
              Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
