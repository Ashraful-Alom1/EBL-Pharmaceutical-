"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { dataStore } from "@/lib/data-store";
import { BlogPost } from "@/lib/types";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    setBlogs(dataStore.getBlogs().filter((b) => b.published !== false));

    const unsub = dataStore.subscribe(() => {
      setBlogs([...dataStore.getBlogs().filter((b) => b.published !== false)]);
    });
    return unsub;
  }, []);

  const categories = [
    "All",
    "Intimate Care",
    "Sex Guide",
    "Sexual Health",
    "Flavoured",
    "Wellness & Life",
    "Pharmaceutical R&D",
  ];

  const filteredBlogs =
    selectedCat === "All"
      ? blogs
      : blogs.filter((b) => b.category.toLowerCase() === selectedCat.toLowerCase());

  const featured = filteredBlogs.slice(0, 3);
  const remaining = filteredBlogs.slice(3);

  return (
    <div className="py-12 px-4 sm:px-6 max-w-[1240px] mx-auto pb-28">
      {/* Hashtag & Header */}
      <div className="text-right mb-4">
        <span className="text-2xl sm:text-3xl font-black text-[#E01B47] tracking-tight">
          #EBLCare
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5 mb-10 pb-4 border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCat === cat
                ? "bg-[#E01B47] text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3-Up Featured Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {featured.map((blog) => (
          <div
            key={blog.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-storeCard hover:shadow-storeHover transition-all flex flex-col justify-between border border-transparent hover:border-rose-100"
          >
            <div className="h-56 relative overflow-hidden bg-gray-50">
              <Image
                src={blog.coverUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E01B47] block mb-2">
                  {blog.category} · {blog.readTime}
                </span>
                <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#E01B47] transition-colors leading-snug line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">{blog.publishedAt}</span>
                <Link
                  href={`/shop/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E01B47] hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {featured.length === 0 && (
          <div className="col-span-3 text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
            No published articles in this category yet.
          </div>
        )}
      </div>

      {/* Red Full-Width Banner Strip */}
      <div className="bg-[#E01B47] rounded-3xl p-8 sm:p-14 text-white mb-16 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Certified Pharmaceutical & Wellness Knowledge
          </h2>
          <p className="text-base sm:text-lg text-rose-100 font-normal leading-relaxed">
            From clinical biocompatibility reports to intimate healthcare guides, discover peer-reviewed insights from Eastern Biochemicals R&D desk.
          </p>
        </div>
      </div>

      {/* 2-Column Article List with "KNOW MORE →" Button */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remaining.map((blog) => (
            <div
              key={blog.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-storeCard hover:shadow-storeHover transition-all flex flex-col sm:flex-row items-center gap-5 group"
            >
              <div className="w-full sm:w-40 h-32 relative rounded-xl overflow-hidden shrink-0 bg-gray-50">
                <Image
                  src={blog.coverUrl}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-full w-full">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#E01B47] block mb-1">
                    {blog.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#E01B47] transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h4>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <Link
                    href={`/shop/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 border border-[#E01B47] text-[#E01B47] hover:bg-[#E01B47] hover:text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <span>KNOW MORE</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
