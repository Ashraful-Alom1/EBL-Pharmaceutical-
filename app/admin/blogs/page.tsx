"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  X,
  Save,
  Eye,
  Upload,
} from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { BlogPost } from "@/lib/types";

const BLOG_CATEGORIES = [
  "Gastro & Reflux Care",
  "Cardio Care",
  "Women's Health",
  "Sexual Health",
  "Intimate Care",
  "Pharma R&D & Formulation",
  "Wellness & Life",
  "Flavoured",
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // New Blog form state
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newCategory, setNewCategory] = useState("Gastro & Reflux Care");
  const [newAuthor, setNewAuthor] = useState("Dr. Anirban Roy, Formulation Scientist");
  const [newReadTime, setNewReadTime] = useState("5 min read");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCoverUrl, setNewCoverUrl] = useState("https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800");
  const [uploading, setUploading] = useState(false);

  // Edit Blog form state
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editReadTime, setEditReadTime] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editUploading, setEditUploading] = useState(false);

  useEffect(() => {
    setBlogs(dataStore.getBlogs());
    const unsub = dataStore.subscribe(() => {
      setBlogs([...dataStore.getBlogs()]);
    });
    return unsub;
  }, []);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    setNewSlug(generateSlug(val));
  };

  const handleCloudinaryUpload = async (
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
      formData.append("folder", "ebl-pharmaceutical/blogs");
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
      console.error("Cloudinary upload error:", err);
      alert("Failed to upload image to Cloudinary");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    dataStore.addBlog({
      title: newTitle.trim(),
      slug: newSlug.trim() || generateSlug(newTitle),
      category: newCategory,
      author: newAuthor.trim(),
      readTime: newReadTime.trim(),
      excerpt: newExcerpt.trim(),
      body: newBody.trim(),
      coverUrl: newCoverUrl.trim(),
    });

    setIsAddModalOpen(false);
    setNewTitle("");
    setNewSlug("");
    setNewExcerpt("");
    setNewBody("");
  };

  const handleStartEdit = (b: BlogPost) => {
    setEditingBlog(b);
    setEditTitle(b.title);
    setEditSlug(b.slug);
    setEditCategory(b.category);
    setEditAuthor(b.author);
    setEditReadTime(b.readTime);
    setEditExcerpt(b.excerpt);
    setEditBody(b.body);
    setEditCoverUrl(b.coverUrl);
  };

  const handleUpdateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    dataStore.updateBlog(editingBlog.id, {
      title: editTitle.trim(),
      slug: editSlug.trim() || generateSlug(editTitle),
      category: editCategory,
      author: editAuthor.trim(),
      readTime: editReadTime.trim(),
      excerpt: editExcerpt.trim(),
      body: editBody.trim(),
      coverUrl: editCoverUrl.trim(),
    });

    setEditingBlog(null);
  };

  const handleDeleteBlog = (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete article "${title}"?`)) {
      dataStore.deleteBlog(id);
    }
  };

  const filtered = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "ALL" || b.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Medical &amp; Clinical Blog Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and publish patient guides, pharmaceutical research breakdowns, and health articles.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#0A1B8F] hover:bg-[#1527ab] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search articles by title, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs px-4 py-2 border border-slate-200 rounded-full outline-none focus:border-[#0A1B8F] w-72 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoryFilter("ALL")}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
              categoryFilter === "ALL"
                ? "bg-[#0A1B8F] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            All Categories ({blogs.length})
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-[#0A1B8F] text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Published Date</th>
                <th className="py-3.5 px-4">Read Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-slate-100 border">
                        <Image
                          src={b.coverUrl}
                          alt={b.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-md">
                        <strong className="text-slate-900 block line-clamp-1 font-bold text-xs">
                          {b.title}
                        </strong>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {b.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-blue-50 text-[#0A1B8F] px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {b.author}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono whitespace-nowrap">
                    {b.publishedAt}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {b.readTime}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      PUBLISHED
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/shop/blogs/${b.slug}`}
                        target="_blank"
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View Live Article"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleStartEdit(b)}
                        className="text-slate-500 hover:text-[#0A1B8F] p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id, b.title)}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No articles found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Blog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Create Medical Article</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBlog} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Mechanism of Action: Dual Calcium Channel Blockers in Hypertension"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    placeholder="e.g. dual-calcium-channel-blockers-hypertension"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Dr. Anirban Roy, Formulation Scientist"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    required
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="e.g. 5 min read"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cover Image (Cloudinary)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCoverUrl}
                    onChange={(e) => setNewCoverUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                  <label className="bg-[#0A1B8F] hover:bg-[#071360] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 select-none">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload Cloudinary"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      onChange={(e) => handleCloudinaryUpload(e, setNewCoverUrl, setUploading)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Article Excerpt (Brief Summary) *</label>
                <textarea
                  rows={2}
                  required
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="A concise clinical overview that appears on preview cards..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Article Body *</label>
                <textarea
                  rows={6}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Write the full content of the article with clinical references..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Medical Article</h3>
                <span className="text-[10px] text-slate-400 font-mono">ID: {editingBlog.id}</span>
              </div>
              <button
                onClick={() => setEditingBlog(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBlog} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] bg-white font-medium"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    required
                    value={editReadTime}
                    onChange={(e) => setEditReadTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Cover Image (Cloudinary)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editCoverUrl}
                    onChange={(e) => setEditCoverUrl(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                  />
                  <label className="bg-[#0A1B8F] hover:bg-[#071360] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 select-none">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{editUploading ? "Uploading..." : "Upload Cloudinary"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={editUploading}
                      onChange={(e) => handleCloudinaryUpload(e, setEditCoverUrl, setEditUploading)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Article Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Article Body *</label>
                <textarea
                  rows={6}
                  required
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#0A1B8F] font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="text-xs font-bold text-slate-500 px-4 py-2 hover:bg-slate-100 rounded-full cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0A1B8F] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#1527ab] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
