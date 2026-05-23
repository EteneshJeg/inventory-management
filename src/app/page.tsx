"use client";

import ItemCard, { ItemData } from "@/components/ItemCard";
import ItemForm from "@/components/ItemForm";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useRef, useState } from "react";

type SortOption = "newest" | "name_az" | "price_low" | "price_high" | "qty_low";


export default function HomePage() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ItemData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ItemData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { dark, toggle } = useTheme();

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
      setConfirmDelete(false);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center border border-teal-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inventory Manager</h1>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Manage your products with ease</p>
              </div>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="ml-auto p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6">
            {[
              { label: "Total Products", value: items.length },
              { label: "Categories", value: categories.length - 1 },
              { label: "Total Value", value: `$${totalValue.toFixed(2)}` },
              { label: "Low Stock", value: lowStockCount },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <p className="text-gray-400 dark:text-gray-400 text-xs font-medium mb-1">{stat.label}</p>
                <p className="text-teal-700 dark:text-teal-400 font-bold text-lg">{stat.value}</p>
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
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 font-medium hover:border-gray-300 dark:hover:border-gray-600 transition-colors whitespace-nowrap"
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
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-20 py-1.5 overflow-hidden">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                          sortBy === opt.value
                            ? "bg-teal-600 text-white font-semibold"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
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
            className="px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold text-sm whitespace-nowrap flex items-center gap-2"
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
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className={`ml-1.5 ${selectedCategory === cat ? "text-teal-200" : "text-gray-400 dark:text-gray-500"}`}>
                    {items.filter((i) => i.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {!loading && (search || selectedCategory !== "All") && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
            Showing <span className="font-semibold text-gray-700 dark:text-gray-200">{filteredItems.length}</span> of {items.length} items
            {selectedCategory !== "All" && <span> in <span className="font-semibold text-gray-700 dark:text-gray-200">{selectedCategory}</span></span>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-white dark:bg-gray-800 rounded-3xl animate-pulse border border-gray-100 dark:border-gray-700" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-5xl mb-5 border border-gray-200 dark:border-gray-700">
              {search ? "🔍" : "📦"}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {search || selectedCategory !== "All" ? "No results found" : "Your inventory is empty"}
            </h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm max-w-xs">
              {search || selectedCategory !== "All"
                ? "Try a different search term or category."
                : "Start by adding your first product to the inventory."}
            </p>
            {!search && selectedCategory === "All" && (
              <button
                onClick={() => { setEditItem(null); setShowForm(true); }}
                className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-colors font-semibold text-sm"
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
                onEdit={(item) => { setEditItem(item); setShowForm(true); }}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </main>



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
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/40 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Delete Item?</h3>
              </div>
              <button
                onClick={() => { setDeleteItem(null); setConfirmDelete(false); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            {/* Body */}
            <div className="px-5 pt-4 pb-5">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                If you delete{" "}
                <span className="font-semibold text-gray-800 dark:text-gray-100">&quot;{deleteItem.name}&quot;</span>,
                it will be permanently removed from your inventory along with its image. This action cannot be undone.
              </p>

              <label className="flex items-start gap-3 mt-4 p-3.5 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                  className="mt-0.5 accent-rose-600 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 select-none">
                  I understand this will permanently delete this item and cannot be undone.
                </span>
              </label>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setDeleteItem(null); setConfirmDelete(false); }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 border border-rose-300 dark:border-rose-700 rounded-xl text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting || !confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
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
