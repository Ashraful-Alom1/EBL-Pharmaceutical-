"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, CheckCircle2, AlertCircle, X, Save } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { Product } from "@/lib/types";
import { formatPaiseToInr } from "@/lib/gst";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("ultra-thin-condoms");
  const [priceInr, setPriceInr] = useState("149");
  const [mrpInr, setMrpInr] = useState("199");
  const [gstRate, setGstRate] = useState<0 | 5 | 12 | 18 | 28>(12);
  const [stock, setStock] = useState("100");
  const [hsn, setHsn] = useState("40141010");
  const [unit, setUnit] = useState("Pack of 3");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500");
  const [uploading, setUploading] = useState(false);

  // Edit product form fields
  const [editName, setEditName] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editPriceInr, setEditPriceInr] = useState("");
  const [editMrpInr, setEditMrpInr] = useState("");
  const [editGstRate, setEditGstRate] = useState<0 | 5 | 12 | 18 | 28>(12);
  const [editStock, setEditStock] = useState("");
  const [editHsn, setEditHsn] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editUploading, setEditUploading] = useState(false);

  const categories = dataStore.getCategories();

  // Load products and listen to all store changes (local & Firebase)
  useEffect(() => {
    setProducts(dataStore.getProducts());
    const unsubscribe = dataStore.subscribe(() => {
      setProducts([...dataStore.getProducts()]);
    });
    return unsubscribe;
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    setLoading: (loading: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "ebl-pharmaceutical/products");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setter(data.url);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image to Cloudinary");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === categoryId);
    const pricePaise = Math.round(parseFloat(priceInr) * 100);
    const mrpPaise = Math.round(parseFloat(mrpInr) * 100);
    const stockAvailable = parseInt(stock) || 0;

    dataStore.createProduct({
      name,
      sku,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId,
      categoryName: cat?.name || "General",
      brandName: "Eastern Biochemicals",
      shortDesc: desc.slice(0, 100),
      description: desc,
      mrpPaise,
      pricePaise,
      gstRate,
      hsnCode: hsn,
      unit,
      trackInventory: true,
      reorderLevel: 20,
      stockAvailable,
      isLowStock: stockAvailable <= 20,
      requiresPrescription: false,
      ageRestricted18Plus: false,
      images: [
        {
          publicId: `prod-${Date.now()}`,
          url: imageUrl,
          alt: name,
          sort: 1,
          isPrimary: true,
        },
      ],
      status: "PUBLISHED",
      searchKeywords: name.toLowerCase().split(" "),
      ratingAvg: 5.0,
      ratingCount: 1,
    });

    setIsModalOpen(false);
    setName("");
    setSku("");
    setDesc("");
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku);
    setEditCategoryId(prod.categoryId);
    setEditPriceInr((prod.pricePaise / 100).toString());
    setEditMrpInr((prod.mrpPaise / 100).toString());
    setEditGstRate(prod.gstRate);
    setEditStock(prod.stockAvailable.toString());
    setEditHsn(prod.hsnCode || "");
    setEditUnit(prod.unit);
    setEditDesc(prod.description);
    setEditImageUrl(prod.images[0]?.url || "");
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const cat = categories.find((c) => c.id === editCategoryId);
    const pricePaise = Math.round(parseFloat(editPriceInr) * 100);
    const mrpPaise = Math.round(parseFloat(editMrpInr) * 100);
    const stockAvailable = parseInt(editStock) || 0;

    dataStore.updateProduct(editingProduct.id, {
      name: editName,
      sku: editSku,
      categoryId: editCategoryId,
      categoryName: cat?.name || editingProduct.categoryName,
      pricePaise,
      mrpPaise,
      gstRate: editGstRate,
      stockAvailable,
      isLowStock: stockAvailable <= editingProduct.reorderLevel,
      hsnCode: editHsn,
      unit: editUnit,
      description: editDesc,
      shortDesc: editDesc.slice(0, 100),
      images: [
        {
          publicId: editingProduct.images[0]?.publicId || `prod-${Date.now()}`,
          url: editImageUrl,
          alt: editName,
          sort: 1,
          isPrimary: true,
        },
      ],
    });

    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this product from the catalogue?")) {
      dataStore.deleteProduct(id);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Product Catalogue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage SKUs, retail pricing, GST tax slabs, and real-time inventory levels permanently stored in Firebase &amp; Cloudinary.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by SKU or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs px-4 py-2 border border-slate-200 rounded-full outline-none focus:border-[#0A1B8F] w-72 bg-white"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU / HSN</th>
                <th className="py-3.5 px-4">Selling Price</th>
                <th className="py-3.5 px-4">GST Rate</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border p-1 relative shrink-0">
                        <Image
                          src={prod.images[0]?.url || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100"}
                          alt={prod.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <strong className="text-slate-900 block line-clamp-1">{prod.name}</strong>
                        <span className="text-[10px] text-slate-400">{prod.unit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {prod.categoryName}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span className="block text-slate-900 font-bold">{prod.sku}</span>
                    <span className="text-[10px] text-slate-400">HSN: {prod.hsnCode}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-[#E01B47] block">
                      {formatPaiseToInr(prod.pricePaise)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatPaiseToInr(prod.mrpPaise)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {prod.gstRate}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-black ${
                        prod.stockAvailable <= prod.reorderLevel
                          ? "text-amber-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {prod.stockAvailable}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="text-slate-500 hover:text-[#0A1B8F] p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Add New Product to Store</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. EBL Pure Silk Lavender Lube"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="e.g. EB-LAV-01"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={mrpInr}
                    onChange={(e) => setMrpInr(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GST Rate *</label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(parseInt(e.target.value) as 0 | 5 | 12 | 18 | 28)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white"
                  >
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST</option>
                    <option value="28">28% GST</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={hsn}
                    onChange={(e) => setHsn(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Unit / Packaging Format</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. 200 ml Bottle, Pack of 10"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Media (Cloudinary)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/web8vmww/..."
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                  <label className="bg-[#0A1B8F] hover:bg-[#071360] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 select-none">
                    <span>{uploading ? "Uploading..." : "Upload Cloudinary"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleFileUpload(e, setImageUrl, setUploading)}
                      className="hidden"
                    />
                  </label>
                </div>
                {imageUrl && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ Connected: {imageUrl.slice(0, 60)}...
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detail product features, formulation safety, and packaging..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors"
                >
                  Save &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Product</h3>
                <span className="text-[10px] text-slate-400 font-mono">ID: {editingProduct.id}</span>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value.toUpperCase())}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editPriceInr}
                    onChange={(e) => setEditPriceInr(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editMrpInr}
                    onChange={(e) => setEditMrpInr(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">GST Rate *</label>
                  <select
                    value={editGstRate}
                    onChange={(e) => setEditGstRate(parseInt(e.target.value) as 0 | 5 | 12 | 18 | 28)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white"
                  >
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST</option>
                    <option value="28">28% GST</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={editHsn}
                    onChange={(e) => setEditHsn(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Unit / Packaging Format</label>
                <input
                  type="text"
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product Image (Cloudinary)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                  <label className="bg-[#0A1B8F] hover:bg-[#071360] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 select-none">
                    <span>{editUploading ? "Uploading..." : "Upload Cloudinary"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={editUploading}
                      onChange={(e) => handleFileUpload(e, setEditImageUrl, setEditUploading)}
                      className="hidden"
                    />
                  </label>
                </div>
                {editImageUrl && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ Connected: {editImageUrl.slice(0, 60)}...
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
