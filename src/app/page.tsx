"use client";

import ItemCard, { ItemData } from "@/components/ItemCard";
import ItemDetail from "@/components/ItemDetail";
import ItemForm from "@/components/ItemForm";
import { useEffect, useRef, useState } from "react";

type SortOption = "newest" | "name_az" | "price_low" | "price_high" | "qty_low";


export default function HomePage() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ItemData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemData | null>(null);
  const [viewItem, setViewItem] = useState<ItemData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      setItems(data);
    } catch {
      showToast("Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/items/${deleteItem.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast(`"${deleteItem.name}" deleted`, "success");
      fetchItems();
    } catch {
      showToast("Failed to delete item", "error");
    } finally {
      setDeleting(false);
      setDeleteItem(null);
    }
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_az":
          return a.name.localeCompare(b.name);
        case "price_low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price_high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "qty_low":
          return a.quantity - b.quantity;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const totalValue = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const lowStockCount = items.filter((item) => item.quantity <= 5).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Inventory Manager</h1>
                <p className="text-gray-400 text-xs mt-0.5">Manage your products with ease</p>
              </div>
            </div>

          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6">
            {[
              { label: "Total Products", value: items.length },
              { label: "Categories", value: categories.length - 1 },
              { label: "Total Value", value: `$${totalValue.toFixed(2)}` },
              { label: "Low Stock", value: lowStockCount },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <p className="text-gray-400 text-xs font-medium mb-1">{stat.label}</p>
                <p className="text-gray-900 font-bold text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Sort + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-sm text-gray-900 placeholder:text-gray-400"
          />

          {/* Sort dropdown */}
          {(() => {
            const sortOptions: { value: SortOption; label: string }[] = [
              { value: "newest",     label: "Newest First" },
              { value: "name_az",    label: "Name A–Z" },
              { value: "price_low",  label: "Price: Low to High" },
              { value: "price_high", label: "Price: High to Low" },
              { value: "qty_low",    label: "Quantity: Low to High" },
            ];
            const current = sortOptions.find((o) => o.value === sortBy)!;
            return (
              <div ref={sortRef} className="relative">
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 font-medium hover:border-gray-300 transition-colors whitespace-nowrap"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                  {current.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {sortOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-1.5 overflow-hidden">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                          sortBy === opt.value
                            ? "bg-gray-900 text-white font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.value && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <button
            onClick={() => { setEditItem(null); setShowForm(true); }}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold text-sm whitespace-nowrap flex items-center gap-2"
          >
            + Add Item
          </button>
        </div>

        {/* Category filter pills */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  selectedCategory === cat
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className={`ml-1.5 ${selectedCategory === cat ? "text-gray-300" : "text-gray-400"}`}>
                    {items.filter((i) => i.category === cat).length}
                  </span>
                )}
              </button>
            ))}

          </div>
        )}

        {!loading && (search || selectedCategory !== "All") && (
          <p className="text-sm text-gray-400 mb-5">
            Showing <span className="font-semibold text-gray-700">{filteredItems.length}</span> of {items.length} items
            {selectedCategory !== "All" && <span> in <span className="font-semibold text-gray-700">{selectedCategory}</span></span>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center text-5xl mb-5 border border-gray-200">
              {search ? "🔍" : "📦"}
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              {search || selectedCategory !== "All" ? "No results found" : "Your inventory is empty"}
            </h3>
            <p className="text-gray-400 mt-2 text-sm max-w-xs">
              {search || selectedCategory !== "All"
                ? "Try a different search term or category."
                : "Start by adding your first product to the inventory."}
            </p>
            {!search && selectedCategory === "All" && (
              <button
                onClick={() => { setEditItem(null); setShowForm(true); }}
                className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-700 transition-colors font-semibold text-sm"
              >
                + Add First Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onView={setViewItem}
                onEdit={(item) => { setEditItem(item); setShowForm(true); }}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-100 mt-8">
        Built with Next.js · Neon PostgreSQL · Drizzle ORM · Cloudinary · Tailwind CSS
      </footer>

      {/* Item Detail Modal */}
      {viewItem && (
        <ItemDetail
          item={viewItem}
          onClose={() => setViewItem(null)}
          onEdit={(item) => { setEditItem(item); setShowForm(true); }}
          onDelete={setDeleteItem}
        />
      )}

      {/* Item Form Modal */}
      {showForm && (
        <ItemForm
          item={editItem}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchItems();
            showToast(editItem ? "Item updated successfully" : "Item added successfully", "success");
          }}
          onError={(msg) => showToast(msg, "error")}
        />
      )}

      {/* Delete Modal */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-rose-100">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center">Delete Item</h3>
            <p className="text-gray-500 mt-2 text-center text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">&quot;{deleteItem.name}&quot;</span>?
              <br />This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteItem(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-2xl hover:bg-rose-700 transition-colors font-semibold disabled:opacity-60 text-sm"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl text-white font-semibold shadow-2xl z-50 text-sm ${
          toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
        }`}>
          <span className="text-base">{toast.type === "success" ? "✅" : "❌"}</span>
          {toast.message}
        </div>
      )}
    </div>
  );
}
