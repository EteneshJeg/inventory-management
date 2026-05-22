"use client";

import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";
import { ItemData } from "./ItemCard";

interface ItemDetailProps {
  item: ItemData;
  onClose: () => void;
  onEdit: (item: ItemData) => void;
  onDelete: (item: ItemData) => void;
}

export default function ItemDetail({ item, onClose, onEdit, onDelete }: ItemDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isLowStock = item.quantity <= 5;
  const isOutOfStock = item.quantity === 0;

  const stockLabel = isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock";
  const stockColor = isOutOfStock
    ? "bg-gray-100 text-gray-600"
    : isLowStock
    ? "bg-amber-100 text-amber-700"
    : "bg-emerald-100 text-emerald-700";

  const createdDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
    {lightboxOpen && item.imageUrl && (
      <ImageLightbox
        src={item.imageUrl}
        alt={item.name}
        onClose={() => setLightboxOpen(false)}
      />
    )}
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Image — click to open fullscreen */}
        <div
          className={`relative h-56 bg-gray-100 ${item.imageUrl ? "cursor-zoom-in" : ""}`}
          onClick={() => item.imageUrl && setLightboxOpen(true)}
        >
          {item.imageUrl ? (
            <>
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-end justify-end p-2">
                <span className="text-white text-xs bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  Click to expand
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-7xl opacity-20">📦</span>
            </div>
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-sm text-sm font-bold"
          >
            ✕
          </button>
          {/* Stock badge */}
          <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${stockColor}`}>
            {stockLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              <span className="inline-block mt-1 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                {item.category}
              </span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 shrink-0">
              ${parseFloat(item.price).toFixed(2)}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">Quantity</p>
              <p className={`text-lg font-bold ${isLowStock ? "text-amber-600" : "text-gray-900"}`}>
                {item.quantity} units
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">Total Value</p>
              <p className="text-lg font-bold text-gray-900">
                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          {/* Created date */}
          <p className="text-xs text-gray-400 mb-5">Added on {createdDate}</p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => { onClose(); onEdit(item); }}
              className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold text-sm"
            >
              Edit Item
            </button>
            <button
              onClick={() => { onClose(); onDelete(item); }}
              className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-semibold text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
